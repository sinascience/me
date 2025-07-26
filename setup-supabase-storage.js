// Setup script for Supabase Storage
// Run this with: node setup-supabase-storage.js

console.log('🚀 Setting up Supabase Storage for Portfolio CMS...');
console.log('');

console.log('📋 Manual Setup Required:');
console.log('');
console.log('1. Go to your Supabase Dashboard → Storage');
console.log('2. Create a new bucket called "portfolio-assets"');
console.log('3. Make it public');
console.log('4. Set allowed MIME types: image/jpeg, image/png, image/webp, image/gif');
console.log('5. Set file size limit: 5MB');
console.log('');

console.log('🔐 Set up these RLS policies:');
console.log('');
console.log('Policy 1: "Admin can upload images"');
console.log('- Operation: INSERT');
console.log('- Target: storage.objects');  
console.log('- Policy: bucket_id = \'portfolio-assets\'');
console.log('');

console.log('Policy 2: "Public can view images"');
console.log('- Operation: SELECT');
console.log('- Target: storage.objects');
console.log('- Policy: bucket_id = \'portfolio-assets\'');
console.log('');

console.log('Policy 3: "Admin can delete images"');
console.log('- Operation: DELETE');
console.log('- Target: storage.objects');
console.log('- Policy: bucket_id = \'portfolio-assets\'');
console.log('');

console.log('✅ Once setup is complete, your image uploader will work with Supabase Storage!');
console.log('');
console.log('🔗 Images will be stored at: https://your-project.supabase.co/storage/v1/object/public/portfolio-assets/blog-images/');
console.log('');

console.log('📱 Benefits of using Supabase Storage:');
console.log('- ✅ CDN-powered image delivery');
console.log('- ✅ Automatic image optimization');
console.log('- ✅ Secure file management');
console.log('- ✅ No server storage limits');
console.log('- ✅ Production-ready deployment');