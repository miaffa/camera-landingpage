import { createClient } from '@supabase/supabase-js';

export interface UploadResult {
  url: string;
  path: string;
}

// Client-side avatar upload function
export async function uploadAvatarClient(
  file: File,
  userId: string,
  accessToken?: string
): Promise<UploadResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase is not configured. Please set up environment variables.');
  }

  // Create a client-side Supabase client with optional access token
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: accessToken ? {
        Authorization: `Bearer ${accessToken}`
      } : {}
    }
  });

  console.log(`Uploading avatar file: ${file.name}, size: ${file.size}, type: ${file.type}`);

  const fileExt = file.name.split('.').pop();
  const fileName = `avatar-${Date.now()}.${fileExt}`;
  const filePath = `avatars/${userId}/${fileName}`;

  console.log(`Uploading avatar to path: ${filePath}`);

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true, // Allow overwriting existing avatars
    });

  if (error) {
    console.error('Supabase avatar upload error:', error);
    throw new Error(`Failed to upload avatar: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(data.path);

  console.log(`Avatar upload successful, public URL: ${publicUrl}`);

  return {
    url: publicUrl,
    path: data.path,
  };
}
