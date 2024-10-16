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
import FlowCard from '@/app/(main)/(pages)/workflows/editor/[editorId]/_components/flow-card';
import EditorSidebar from '@/app/(main)/(pages)/workflows/editor/[editorId]/_components/editor-sidebar';
import {useEditor} from '@/providers/editor-provider';
import {usePathname} from 'next/navigation';
import {FlowCardType} from '@/types/editor';
import {v4} from 'uuid';
import {EditorCanvasDefaultCardTypes} from '@/lib/constants';

type Props = {};
const Page = ({}: Props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const {dispatch, state} = useEditor();
  const pathname = usePathname();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const {screenToFlowPosition} = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onConnect = useCallback(
    (params: Edge | Connection) =>
      // @ts-ignore
      setEdges(eds => addEdge(params, eds)),
    [],
  );

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();

      const type: FlowCardType['type'] = event.dataTransfer.getData(
        'application/reactflow',
      );

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: v4(),
        type: type,
        position,
        data: {
          title: type,
          description: EditorCanvasDefaultCardTypes[type].description,
          completed: false,
          current: false,
          metadata: {},
          type: type,
        },
      };

      // @ts-ignore
      setNodes(nds => nds.concat(newNode));
    },
    [screenToFlowPosition, state],
  );

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
    dispatch({
      type: 'SELECTED_ELEMENT',
      payload: {
        element: {
          data: {
            completed: false,
            current: false,
            description: '',
            metadata: {},
            title: '',
            type: 'Trigger',
          },
          id: '',
          position: {x: 0, y: 0},
          type: 'Trigger',
        },
      },
    });
  };

  useEffect(() => {
    dispatch({type: 'LOAD_DATA', payload: {edges, elements: nodes}});
  }, [nodes, edges]);

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
            <EditorSidebar nodes={nodes} />
          </>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Page;
