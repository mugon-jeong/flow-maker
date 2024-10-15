'use server';
import {supabaseServer} from '@/lib/supabase-server';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';

type Props = {
  email: string;
  password: string;
};

export async function login({
  email,
  password,
}: Props): Promise<{error?: string}> {
  const supabase = supabaseServer();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: email,
    password: password,
  };

  const {error} = await supabase.auth.signInWithPassword(data);

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}
