import React, {useMemo, useState} from 'react';
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
import CustomHandle from '@/app/(main)/(pages)/workflows/(editor)/[editorId]/_components/custom-handle';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {useModal} from '@/providers/modal-provider';
import DialogModal from '@/components/global/dialog-modal';
import Icon, {DynamicIconTypes} from '@/components/global/icon';
import IconPicker from '@/components/global/icon-picker';

type Props = {
  id: string;
  data: FlowCardType;
  selected?: boolean | undefined;
};
const FlowCard = ({id, data, selected}: Props) => {
  const {setOpen} = useModal();
  const [flowStatus, setFlowStatus] = useState<FlowStatusTypes>(data.status);
  const [isEditing, setIsEditing] = useState(false);
  const {updateNodeData, setNodes} = useReactFlow<FlowNodeType>();
  const [searchIcon, setSearchIcon] = useState(data.icon || 'workflow');
  const onEditing = (value: string) => {
    if (data.status === value) {
      setIsEditing(false);
    } else {
      setIsEditing(true);
      setFlowStatus(value as FlowStatusTypes);
    }
  };

  const logo = useMemo(() => {
    return <Icon name={searchIcon as DynamicIconTypes} />;
  }, [searchIcon]);

  const handleIconModal = () => {
    setOpen(
      <DialogModal title={'Icon Picker'}>
        <IconPicker onSubmit={onChangeIcon} />
      </DialogModal>,
    );
  };

  const onChangeIcon = (value: DynamicIconTypes) => {
    if (data.icon !== value) {
      setIsEditing(true);
      setSearchIcon(value);
    }
  };

  const onSubmit = () => {
    updateNodeData(id, {status: flowStatus, icon: searchIcon});
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
        <div
          className={'flex flex-row justify-between items-center p-2 w-full'}
        >
          <p className="text-xs text-muted-foreground/50 pr-6">
            <b className="text-muted-foreground/80">ID: </b>
            {id}
          </p>
          <Badge variant="secondary" className="">
            {data.type}
          </Badge>
        </div>
        <CardHeader className="flex flex-row items-center pt-0 gap-4">
          <div onClick={handleIconModal}>{logo}</div>
          <div>
            <CardTitle className="text-md">{data.title}</CardTitle>
            <CardDescription>
              <p>{data.description}</p>
            </CardDescription>
          </div>
        </CardHeader>
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
