import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function DELETE(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json({ error: 'No image URL provided' }, { status: 400 });
    }

    // Extract filename from Supabase URL
    // Format: https://{project}.supabase.co/storage/v1/object/public/portfolio-assets/blog-images/filename.jpg
    const urlParts = imageUrl.split('/');
    const bucketIndex = urlParts.findIndex(part => part === 'portfolio-assets');
    
    if (bucketIndex === -1 || bucketIndex >= urlParts.length - 1) {
      return NextResponse.json({ error: 'Invalid Supabase storage URL' }, { status: 400 });
    }

    // Get the path after the bucket name
    const filePath = urlParts.slice(bucketIndex + 1).join('/');

    // Delete from Supabase Storage using admin client (bypasses RLS)
    const { error: deleteError } = await supabaseAdmin.storage
      .from('portfolio-assets')
      .remove([filePath]);

    if (deleteError) {
      console.error('Supabase delete error:', deleteError);
      return NextResponse.json({ 
        error: 'Failed to delete from storage: ' + deleteError.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Image deleted successfully',
      deletedFile: filePath
    });

  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}