'use client';
import React, {useCallback, useEffect, useState} from 'react';
import {usePathname} from 'next/navigation';
import {Button} from '@/components/ui/button';
import {onCreateNodesEdges} from '@/app/(main)/(pages)/workflows/editor/[editorId]/_actions/flow-action';
import {useToast} from '@/hooks/use-toast';

type Props = {
  children: React.ReactNode;
  edges: any[];
  nodes: any[];
};
const FlowInstance = ({children, edges, nodes}: Props) => {
  const {toast} = useToast();
  const pathname = usePathname();
  const [isFlow, setIsFlow] = useState([]);
  const onFlowCreate = useCallback(async () => {
    console.log('pathname', pathname.split('/').pop()!);
    const {status} = await onCreateNodesEdges({
      flowId: pathname.split('/').pop()!,
      nodes: JSON.stringify(nodes),
      edges: JSON.stringify(edges),
      flowPath: JSON.stringify(isFlow),
    });
    console.log('status', status);
    if (status == 204)
      toast({
        title: 'Flow created successfully',
      });
  }, [isFlow, nodes, edges, pathname, toast]);

  const onAutomateFlow = async () => {
    const flows: any = [];
    const connectedEdges = edges.map(edge => edge.target);
    connectedEdges.map(target => {
      nodes.map(node => {
        if (node.id === target) {
          flows.push(node.type);
        }
      });
    });

    setIsFlow(flows);
  };

  useEffect(() => {
    onAutomateFlow();
  }, [edges]);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-3 p-4">
        <Button onClick={onFlowCreate} disabled={isFlow.length < 1}>
          Save
        </Button>
        <Button disabled={isFlow.length < 1} onClick={() => {}}>
          Publish
        </Button>
      </div>
      {children}
    </div>
  );
};
export default FlowInstance;
