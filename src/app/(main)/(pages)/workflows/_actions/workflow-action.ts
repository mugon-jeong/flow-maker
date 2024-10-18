'use server';
import {TablesInsert} from '@/lib/supabase';
import {supabaseServer} from '@/lib/supabase-server';

export const createWorkflow = async (data: TablesInsert<'workflows'>) => {
  const supabase = supabaseServer();
  const {
    data: {user},
  } = await supabase.auth.getUser();
  const {error, status} = await supabase
    .from('workflows')
    .insert({...data, user_id: user?.id});
  console.log('error', error);
  return status;
};

export const getWorkflows = async (user: string) => {
  const supabase = supabaseServer();
  const {data} = await supabase
    .from('workflows')
    .select('*')
    .eq('user_id', user);
  return data;
};

export const deleteWorkflow = async (id: string) => {
  const supabase = supabaseServer();
  const {status} = await supabase.from('workflows').delete().eq('id', id);
  return status;
};
