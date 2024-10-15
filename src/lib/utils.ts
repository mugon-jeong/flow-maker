import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';
import {supabaseClient} from '@/lib/supabase-client';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const downloadImage = async (
  path: string,
): Promise<string | undefined> => {
  try {
    const {data, error} = await supabaseClient()
      .storage.from('avatars')
      .download(path);
    if (error) {
      throw error;
    }

    return URL.createObjectURL(data);
  } catch (error) {
    console.log('Error downloading image: ', error);
  }
};
