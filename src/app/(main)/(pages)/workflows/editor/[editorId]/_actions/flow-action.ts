'use server';

import {supabaseServer} from '@/lib/supabase-server';

export const onCreateNodesEdges = async ({
  flowId,
  flowPath,
  edges,
  nodes,
}: {
  flowId: string;
  nodes: string;
  edges: string;
  flowPath: string;
}) => {
  const supabase = supabaseServer();
  const {status} = await supabase
    .from('workflows')
    .update({
      nodes: nodes,
      edges: edges,
      flowPath: flowPath,
    })
    .eq('id', flowId);
  return {status};
};
