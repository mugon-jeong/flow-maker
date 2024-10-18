'use server';
import {supabaseServer} from '@/lib/supabase-server';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {headers} from 'next/headers';

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

export async function googleLogin() {
  const origin = headers().get('origin');
  const supabase = supabaseServer();
  const {data, error} = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
        redirectTo: `${origin}/api/auth/callback`,
      },
    },
  });
  console.log('data', data);
  if (data.url) {
    redirect(data.url); // use the redirect API for your server framework
  }
}
