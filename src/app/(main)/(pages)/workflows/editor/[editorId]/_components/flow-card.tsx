import React, {useCallback, useState} from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {clsx} from 'clsx';
import {NodeResizer, Position, useReactFlow} from '@xyflow/react';
import {FlowCardType, FlowNodeType, FlowStatusTypes} from '@/types/editor';
import CustomHandle from '@/app/(main)/(pages)/workflows/editor/[editorId]/_components/custom-handle';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';

type Props = {
  id: string;
  data: FlowCardType;
  selected?: boolean | undefined;
};
const FlowCard = ({id, data, selected}: Props) => {
  const [flowStatus, setFlowStatus] = useState<FlowStatusTypes>(data.status);
  const [isEditing, setIsEditing] = useState(false);
  const {updateNodeData, setNodes} = useReactFlow<FlowNodeType>();
  const onEditing = (value: string) => {
    if (data.status === value) {
      setIsEditing(false);
    } else {
      setIsEditing(true);
      setFlowStatus(value as FlowStatusTypes);
    }
  };

  const onSubmit = () => {
    updateNodeData(id, {status: flowStatus});
    setIsEditing(false);
  };
  return (
    <>
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={30}
      />
      {data.type != 'Start' && (
        <CustomHandle
          type="target"
          position={Position.Top}
          style={{zIndex: 100}}
        />
      )}
      <Card
        onClick={e => {
          setNodes(nodes => {
            return nodes.map(n => {
              if (n.id === id) {
                return {
                  ...n,
                  selected: true,
                };
              }
              return {...n, selected: false};
            });
          });
        }}
        className="relative dark:border-muted-foreground/70 w-full h-full"
      >
        <CardHeader className="flex flex-row items-center gap-4">
          <div>logo</div>
          <div>
            <CardTitle className="text-md">{data.title}</CardTitle>
            <CardDescription>
              <p className="text-xs text-muted-foreground/50">
                <b className="text-muted-foreground/80">ID: </b>
                {id}
              </p>
              <p>{data.description}</p>
            </CardDescription>
          </div>
        </CardHeader>
        <Badge variant="secondary" className="absolute right-2 top-2">
          {data.type}
        </Badge>
        <div
          className={clsx('absolute left-3 top-4 h-2 w-2 rounded-full', {
            'bg-green-500': Math.random() < 0.6,
            'bg-orange-500': Math.random() >= 0.6 && Math.random() < 0.8,
            'bg-red-500': Math.random() >= 0.8,
          })}
        ></div>
        <CardContent className={'flex flex-row justify-between'}>
          <RadioGroup defaultValue={data.status} onValueChange={onEditing}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pending" id="pending" />
              <Label htmlFor="pending">pending</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="current" id="current" />
              <Label htmlFor="current">current</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="completed" id="completed" />
              <Label htmlFor="completed">completed</Label>
            </div>
          </RadioGroup>
          {isEditing && (
            <div className={'flex flex-col justify-end'}>
              <Button onClick={onSubmit}>Submit</Button>
            </div>
          )}
        </CardContent>
      </Card>
      {data.type !== 'End' && (
        <CustomHandle type="source" position={Position.Bottom} id="a" />
      )}
    </>
  );
};
export default FlowCard;
