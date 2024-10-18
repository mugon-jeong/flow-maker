'use server';
import {supabaseServer} from '@/lib/supabase-server';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';

export async function signup({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const supabase = supabaseServer();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: email,
    password: password,
  };

  const {error} = await supabase.auth.signUp(data);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/', 'layout');
  redirect('/login');
}
