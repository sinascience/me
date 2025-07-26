// Script to set up Supabase storage bucket
// Run this once to create the necessary storage bucket and policies

import { supabase } from '../lib/supabase';

async function setupStorage() {
  console.log('Setting up Supabase storage...');

  try {
    // Create bucket if it doesn't exist
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return;
    }

    const bucketExists = buckets?.some(bucket => bucket.name === 'portfolio-assets');

    if (!bucketExists) {
      console.log('Creating portfolio-assets bucket...');
      
      const { data, error } = await supabase.storage.createBucket('portfolio-assets', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 5242880 // 5MB
      });

      if (error) {
        console.error('Error creating bucket:', error);
        return;
      }

      console.log('Bucket created successfully:', data);
    } else {
      console.log('Bucket already exists');
    }

    console.log('✅ Storage setup complete!');
    console.log('');
    console.log('Make sure to set up the following RLS policies in your Supabase dashboard:');
    console.log('');
    console.log('1. Policy for INSERT operations:');
    console.log('   Policy name: "Admin can upload images"');
    console.log('   Operation: INSERT');
    console.log('   Target: storage.objects');
    console.log('   Condition: bucket_id = \'portfolio-assets\'');
    console.log('');
    console.log('2. Policy for SELECT operations:');
    console.log('   Policy name: "Public can view images"');
    console.log('   Operation: SELECT');
    console.log('   Target: storage.objects');
    console.log('   Condition: bucket_id = \'portfolio-assets\'');
    console.log('');
    console.log('3. Policy for DELETE operations:');
    console.log('   Policy name: "Admin can delete images"');
    console.log('   Operation: DELETE');
    console.log('   Target: storage.objects');
    console.log('   Condition: bucket_id = \'portfolio-assets\'');

  } catch (error) {
    console.error('Setup failed:', error);
  }
}

// Run the setup
setupStorage();