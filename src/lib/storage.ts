import { supabase } from './supabase';

export const STORAGE_BUCKET = 'portfolio-assets';

export interface UploadResult {
  success: boolean;
  imageUrl?: string;
  filename?: string;
  error?: string;
}

export async function uploadImage(file: File): Promise<UploadResult> {
  try {
    // Validate file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'
      };
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File too large. Maximum size is 5MB.'
      };
    }

    // Create unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').replace(/\.[^/.]+$/, "");
    const filename = `blog-images/${timestamp}-${cleanName}.${fileExtension}`;

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      return {
        success: false,
        error: 'Failed to upload: ' + error.message
      };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filename);

    return {
      success: true,
      imageUrl: publicUrl,
      filename: data.path
    };

  } catch (error) {
    return {
      success: false,
      error: 'Upload failed: ' + (error as Error).message
    };
  }
}

export async function deleteImage(imageUrl: string): Promise<boolean> {
  try {
    // Extract filename from Supabase URL
    const urlParts = imageUrl.split('/');
    const bucketIndex = urlParts.findIndex(part => part === STORAGE_BUCKET);
    
    if (bucketIndex === -1 || bucketIndex >= urlParts.length - 1) {
      console.error('Invalid Supabase storage URL');
      return false;
    }

    const filePath = urlParts.slice(bucketIndex + 1).join('/');

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error('Failed to delete image:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete failed:', error);
    return false;
  }
}

export function isSupabaseUrl(url: string): boolean {
  return url.includes('supabase') && url.includes(STORAGE_BUCKET);
}