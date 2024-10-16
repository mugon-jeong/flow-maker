import {FlowCardType} from '@/types/editor';

export const onDragStart = (event: any, nodeType: FlowCardType['type']) => {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.effectAllowed = 'move';
};
