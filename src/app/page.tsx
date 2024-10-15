// @flow
import {supabaseServer} from '@/lib/supabase-server';
import {redirect} from 'next/navigation';

const Page = async () => {
  const supabase = supabaseServer();

  const {data, error} = await supabase.auth.getUser();

  if (error || !data?.user) {
    console.log('User is not logged in');
    redirect('/login');
  } else {
    redirect('/dashboard');
  }
};

export default Page;
