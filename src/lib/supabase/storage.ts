import { supabase } from './client';
import { supabaseAdmin } from './server';

export interface UploadResult {
  url: string;
  path: string;
}

export async function uploadPostImage(
  file: File,
  postId: string,
  userId: string
): Promise<UploadResult> {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up environment variables.');
  }

  console.log(`Uploading file: ${file.name}, size: ${file.size}, type: ${file.type}`);

  const fileExt = file.name.split('.').pop();
  const fileName = `${postId}-${Date.now()}.${fileExt}`;
  const filePath = `posts/${userId}/${fileName}`;

  console.log(`Uploading to path: ${filePath}`);

  const { data, error } = await supabase.storage
    .from('post-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Supabase upload error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('post-images')
    .getPublicUrl(data.path);

  console.log(`Upload successful, public URL: ${publicUrl}`);

  return {
    url: publicUrl,
    path: data.path,
  };
}

export async function uploadMultiplePostImages(
  files: File[],
  postId: string,
  userId: string
): Promise<UploadResult[]> {
  const uploadPromises = files.map(file => 
    uploadPostImage(file, postId, userId)
  );

  return Promise.all(uploadPromises);
}

export async function deletePostImage(imagePath: string): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up environment variables.');
  }

  const { error } = await supabase.storage
    .from('post-images')
    .remove([imagePath]);

  if (error) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}

// Gear image upload functions
export async function uploadGearImage(
  file: File,
  gearId: string,
  userId: string
): Promise<UploadResult> {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up environment variables.');
  }

  console.log(`Uploading gear file: ${file.name}, size: ${file.size}, type: ${file.type}`);

  const fileExt = file.name.split('.').pop();
  const fileName = `${gearId}-${Date.now()}.${fileExt}`;
  const filePath = `gear/${userId}/${fileName}`;

  console.log(`Uploading gear to path: ${filePath}`);

  const { data, error } = await supabase.storage
    .from('gear-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Supabase gear upload error:', error);
    throw new Error(`Failed to upload gear image: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('gear-images')
    .getPublicUrl(data.path);

  console.log(`Gear upload successful, public URL: ${publicUrl}`);

  return {
    url: publicUrl,
    path: data.path,
  };
}

export async function uploadMultipleGearImages(
  files: File[],
  gearId: string,
  userId: string
): Promise<UploadResult[]> {
  const uploadPromises = files.map(file => 
    uploadGearImage(file, gearId, userId)
  );

  return Promise.all(uploadPromises);
}

export async function deleteGearImage(imagePath: string): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up environment variables.');
  }

  const { error } = await supabase.storage
    .from('gear-images')
    .remove([imagePath]);

  if (error) {
    throw new Error(`Failed to delete gear image: ${error.message}`);
  }
}

// Avatar upload functions
export async function uploadAvatar(
  file: File,
  userId: string
): Promise<UploadResult> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client is not configured. Please set up SUPABASE_SERVICE_ROLE_KEY environment variable.');
  }

  console.log(`Uploading avatar file: ${file.name}, size: ${file.size}, type: ${file.type}`);

  const fileExt = file.name.split('.').pop();
  const fileName = `avatar-${Date.now()}.${fileExt}`;
  const filePath = `avatars/${userId}/${fileName}`;

  console.log(`Uploading avatar to path: ${filePath}`);

  const { data, error } = await supabaseAdmin.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true, // Allow overwriting existing avatars
    });

  if (error) {
    console.error('Supabase avatar upload error:', error);
    throw new Error(`Failed to upload avatar: ${error.message}`);
  }

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('avatars')
    .getPublicUrl(data.path);

  console.log(`Avatar upload successful, public URL: ${publicUrl}`);

  return {
    url: publicUrl,
    path: data.path,
  };
}

export async function deleteAvatar(imagePath: string): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set up environment variables.');
  }

  const { error } = await supabase.storage
    .from('avatars')
    .remove([imagePath]);

  if (error) {
    throw new Error(`Failed to delete avatar: ${error.message}`);
  }
}