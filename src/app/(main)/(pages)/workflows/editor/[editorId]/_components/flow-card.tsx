import React from 'react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {clsx} from 'clsx';
import {useNodeId} from '@xyflow/react';
import {useEditor} from '@/providers/editor-provider';
import {FlowCardType} from '@/types/editor';

type Props = {
  data: FlowCardType;
};
const FlowCard = ({data}: Props) => {
  const {dispatch, state} = useEditor();
  const nodeId = useNodeId();
  return (
    <>
      <Card
        onClick={e => {
          e.stopPropagation();
          const val = state.editor.elements.find(n => n.id === nodeId);
          if (val)
            dispatch({
              type: 'SELECTED_ELEMENT',
              payload: {
                element: val,
              },
            });
        }}
        className="relative max-w-[400px] dark:border-muted-foreground/70"
      >
        <CardHeader className="flex flex-row items-center gap-4">
          <div>logo</div>
          <div>
            <CardTitle className="text-md">data.title</CardTitle>
            <CardDescription>
              <p className="text-xs text-muted-foreground/50">
                <b className="text-muted-foreground/80">ID: </b>
                {nodeId}
              </p>
              <p>data.description</p>
            </CardDescription>
          </div>
        </CardHeader>
        <Badge variant="secondary" className="absolute right-2 top-2">
          data.type
        </Badge>
        <div
          className={clsx('absolute left-3 top-4 h-2 w-2 rounded-full', {
            'bg-green-500': Math.random() < 0.6,
            'bg-orange-500': Math.random() >= 0.6 && Math.random() < 0.8,
            'bg-red-500': Math.random() >= 0.8,
          })}
        ></div>
      </Card>
    </>
  );
};
export default FlowCard;
