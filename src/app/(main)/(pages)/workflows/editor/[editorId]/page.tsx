'use client';
import React, {useCallback, useRef} from 'react';
import {
  addEdge,
  Background,
  Controls,
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
import NodeItem from '@/app/(main)/(pages)/workflows/editor/[editorId]/_components/node-item';
import {useEditor} from '@/providers/editor-provider';

type Props = {};
let id = 0;
const getId = () => `dndnode_${id++}`;
const Page = ({}: Props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const {screenToFlowPosition} = useReactFlow();
  const [type] = useEditor();
  const onConnect = useCallback(
    params => setEdges(eds => addEdge(params, eds)),
    [],
  );
  const onDragOver = useCallback(event => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    event => {
      event.preventDefault();

      // check if the dropped element is valid
      if (!type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: {label: `${type} node`},
      };

      setNodes(nds => nds.concat(newNode));
    },
    [screenToFlowPosition, type],
  );
  return (
    <ResizablePanelGroup direction={'horizontal'}>
      <ResizablePanel defaultSize={70}>
        <div className="flex h-full items-center justify-center">
          {isLoading ? (
            <CircleProgress />
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onDrop={onDrop}
              onDragOver={onDragOver}
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
            <NodeItem />
          </>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Page;
