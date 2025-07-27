import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  console.log('Upload request received');
  
  if (!isAuthenticated(request)) {
    console.log('Authentication failed');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  console.log('Authentication successful');

  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' 
      }, { status: 400 });
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 5MB.' 
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').replace(/\.[^/.]+$/, "");
    
    // Determine the folder based on file usage context
    const referer = request.headers.get('referer') || '';
    
    let folder = 'uploads';
    if (referer.includes('/admin/personal')) {
      folder = 'profiles';
    } else if (referer.includes('/admin/blog')) {
      folder = 'blog-images';
    } else if (referer.includes('/admin/projects')) {
      folder = 'project-images';
    }
    
    const filename = `${folder}/${timestamp}-${cleanName}.${fileExtension}`;

    // Upload to Supabase Storage using admin client (bypasses RLS)
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('portfolio-assets')
      .upload(filename, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json({ 
        error: 'Failed to upload to storage: ' + uploadError.message 
      }, { status: 500 });
    }

    // Get public URL using admin client
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('portfolio-assets')
      .getPublicUrl(filename);

    return NextResponse.json({ 
      success: true, 
      imageUrl: publicUrl,
      url: publicUrl, // Also include 'url' for compatibility
      filename: uploadData.path,
      originalName: file.name,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}