'use client';
import React, {useCallback, useEffect, useMemo} from 'react';
import {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import CircleProgress from '@/components/global/circle-progress';
import FlowCard from '@/app/(main)/(pages)/workflows/(editor)/[editorId]/_components/flow-card';
import EditorSidebar from '@/app/(main)/(pages)/workflows/(editor)/[editorId]/_components/editor-sidebar';
import {v4} from 'uuid';
import {EditorCanvasDefaultCardTypes} from '@/lib/constants';
import FlowInstance from '@/app/(main)/(pages)/workflows/(editor)/[editorId]/_components/flow-instance';
import {onGetNodesEdges} from '@/app/(main)/(pages)/workflows/(editor)/[editorId]/_actions/flow-action';
import FlowDownloadButton from '@/app/(main)/(pages)/workflows/(editor)/[editorId]/_components/flow-download-button';
import {FlowNodeType, FlowTypes} from '@/types/editor';

type Props = {
  searchParams: {
    id: string;
  };
};
const initialNodes: FlowNodeType[] = [];

const initialEdges: {id: string; source: string; target: string}[] = [];
const Page = ({searchParams}: Props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const {screenToFlowPosition} = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges(eds => addEdge(params, eds)),
    [],
  );

  const onDrop = useCallback(
    (event: {
      preventDefault: () => void;
      dataTransfer: {getData: (arg0: string) => string};
      clientX: number;
      clientY: number;
    }) => {
      event.preventDefault();

      const type = event.dataTransfer.getData(
        'application/reactflow',
      ) as FlowTypes;

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode: FlowNodeType = {
        id: v4(),
        type: type,
        position: position,
        selected: false,
        data: {
          title: type,
          description: EditorCanvasDefaultCardTypes[type].description,
          completed: false,
          current: false,
          metadata: {},
          status: 'pending',
          type: type,
          icon: 'workflow',
          fileUrl: null,
          fileName: null,
        },
      };

      setNodes(nds => nds.concat(newNode));
    },
    [screenToFlowPosition],
  );

  const onGetWorkFlow = async () => {
    setIsLoading(true);
    const {data, status} = await onGetNodesEdges(searchParams.id);
    if (status == 200 && data) {
      if (data[0].edges && data[0].nodes) {
        setEdges(JSON.parse(data[0].edges!));
        setNodes(JSON.parse(data[0].nodes!));
        setIsLoading(false);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    onGetWorkFlow();
  }, []);

  const nodeTypes = useMemo(
    () => ({
      Start: FlowCard,
      Action: FlowCard,
      Trigger: FlowCard,
      Condition: FlowCard,
      End: FlowCard,
    }),
    [],
  );

  const handleClickCanvas = () => {
    console.log('handleClickCanvas');
    setNodes(nodes.map(node => ({...node, selected: false})));
  };

  return (
    <ResizablePanelGroup direction={'horizontal'}>
      <ResizablePanel defaultSize={70}>
        <div className="flex h-full items-center justify-center">
          {isLoading ? (
            <CircleProgress />
          ) : (
            <ReactFlow
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodes={nodes}
              onNodesChange={onNodesChange}
              edges={edges}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
              onClick={handleClickCanvas}
              nodeTypes={nodeTypes}
            >
              <Background />
              <Controls position={'top-left'} className={'text-black'} />
              <MiniMap
                position="bottom-left"
                className="!bg-background"
                zoomable
                pannable
              />
              <FlowDownloadButton />
            </ReactFlow>
          )}
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={40} className="relative sm:block">
        {isLoading ? (
          <CircleProgress />
        ) : (
          <>
            <FlowInstance>
              <EditorSidebar />
            </FlowInstance>
          </>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Page;
