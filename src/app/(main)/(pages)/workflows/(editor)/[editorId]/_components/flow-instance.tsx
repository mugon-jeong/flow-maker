'use client';
import React, {useCallback, useEffect, useState} from 'react';
import {usePathname, useSearchParams} from 'next/navigation';
import {Button} from '@/components/ui/button';
import {onCreateNodesEdges} from '@/app/(main)/(pages)/workflows/(editor)/[editorId]/_actions/flow-action';
import {useToast} from '@/hooks/use-toast';
import {useReactFlow} from '@xyflow/react';

type Props = {
  children: React.ReactNode;
};
const FlowInstance = ({children}: Props) => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const {toast} = useToast();
  const {getNodes, getEdges} = useReactFlow();
  const [isFlow, setIsFlow] = useState<string[]>([]);
  const onFlowCreate = useCallback(async () => {
    const {status} = await onCreateNodesEdges({
      flowId: id!,
      nodes: JSON.stringify(getNodes()),
      edges: JSON.stringify(getEdges()),
      flowPath: JSON.stringify(isFlow),
    });
    console.log(JSON.stringify(getNodes()));
    if (status == 204)
      toast({
        title: 'Flow created successfully',
      });
  }, [id, getNodes, getEdges, isFlow, toast]);

  useEffect(() => {
    console.log(getEdges());
    setIsFlow(getEdges().map(edge => edge.id));
  }, [getEdges]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-3 p-4">
        <Button
          onClick={onFlowCreate}
          disabled={getNodes().length - getEdges().length != 1}
        >
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
