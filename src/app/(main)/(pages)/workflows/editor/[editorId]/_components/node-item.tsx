'use client';
import React from 'react';
import {useEditor} from '@/providers/editor-provider';

type Props = {};
const NodeItem = ({}: Props) => {
  const [_, setType] = useEditor();
  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };
  return (
    <div>
      <div
        className="w-full h-10 py-2 my-2 border-amber-50 border-2 flex items-center justify-center"
        onDragStart={event => onDragStart(event, 'input')}
        draggable
      >
        Input Node
      </div>
      <div
        className="w-full h-10 py-2 my-2 border-blue-400 border-2 flex items-center justify-center"
        onDragStart={event => onDragStart(event, 'default')}
        draggable
      >
        Default Node
      </div>
      <div
        className="w-full h-10 py-2 my-2 border-red-200 border-2 flex items-center justify-center"
        onDragStart={event => onDragStart(event, 'output')}
        draggable
      >
        Output Node
      </div>
    </div>
  );
};

export default NodeItem;
