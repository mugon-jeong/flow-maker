import {supabaseServer} from '@/lib/supabase-server';
import AccountForm from '@/components/forms/account-form';

export default async function Account() {
  const supabase = supabaseServer();

  const {
    data: {user},
  } = await supabase.auth.getUser();

  return <AccountForm user={user} />;
}
