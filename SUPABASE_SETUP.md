# Supabase Storage Setup Guide

## 🚀 Quick Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and anon key

### 2. Set Up Environment Variables
Add these to your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
```

### 3. Create Storage Bucket
1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the sidebar
3. Click **New Bucket**
4. Name: `post-images`
5. Set as **Public bucket** ✅
6. Click **Create bucket**

### 4. Set Up Bucket Policies
Go to **Storage** → **Policies** and add these policies:

#### Policy 1: Allow authenticated users to upload
```sql
CREATE POLICY "Users can upload their own images" ON storage.objects
FOR INSERT WITH CHECK (
  auth.uid()::text = (storage.foldername(name))[2]
  AND bucket_id = 'post-images'
);
```

#### Policy 2: Allow public read access
```sql
CREATE POLICY "Public can view images" ON storage.objects
FOR SELECT USING (bucket_id = 'post-images');
```

#### Policy 3: Allow users to delete their own images
```sql
CREATE POLICY "Users can delete their own images" ON storage.objects
FOR DELETE USING (
  auth.uid()::text = (storage.foldername(name))[2]
  AND bucket_id = 'post-images'
);
```

### 5. Test the Setup
1. Start your development server: `pnpm dev`
2. Go to `/app/create`
3. Create a new post with an image
4. Check your profile to see the uploaded image!

## 📁 File Structure
Images will be stored in this structure:
```
post-images/
├── {userId}/
│   ├── {postId}-{timestamp}.jpg
│   ├── {postId}-{timestamp}.png
│   └── ...
```

## 🔧 Troubleshooting

### Images not showing?
1. Check that your Supabase URL and key are correct
2. Verify the bucket is public
3. Check browser console for errors
4. Ensure the policies are set up correctly

### Upload errors?
1. Check file size limits (default is 50MB)
2. Verify file types are allowed
3. Check Supabase logs for detailed errors

## 🎉 You're Done!
Your images should now display properly in both the profile and feed views!
