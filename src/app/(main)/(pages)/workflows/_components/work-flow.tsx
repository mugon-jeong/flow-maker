import React from 'react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import {Label} from '@/components/ui/label';
import {Switch} from '@/components/ui/switch';
import {Trash} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {useToast} from '@/hooks/use-toast';
import {deleteWorkflow} from '@/app/(main)/(pages)/workflows/_actions/workflow-action';
import {useModal} from '@/providers/modal-provider';
import AlertModal from '@/components/global/alert-modal';

type Props = {
  id: string;
  title: string;
  description: string | null;
  publish: boolean | null;
};
const WorkFlow = ({id, title, description, publish}: Props) => {
  const {toast} = useToast();
  const {setOpen} = useModal();
  const onPublishFlow = async (event: any) => {};
  const onDeleteFlow = async () => {
    alert('Are you sure you want to delete this flow?');
    const status = await deleteWorkflow(id);
    if (status === 204) {
      toast({
        title: 'Flow deleted successfully',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed to delete flow',
      });
    }
  };
  const handleRemove = () => {
    setOpen(<AlertModal title={'delete workflow'} onConfirm={onDeleteFlow} />);
  };
  return (
    <Card className="flex w-full items-center justify-between mb-2">
      <Link className={'w-full'} href={`/workflows/${title}?id=${id}`}>
        <CardHeader className="flex flex-row justify-between">
          <div className="flex flex-col gap-4">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Button
            size={'icon'}
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              handleRemove();
            }}
          >
            <Trash />
          </Button>
        </CardHeader>
        <div className="flex flex-col items-end justify-center gap-2 p-4">
          <Label htmlFor="airplane-mode" className="text-muted-foreground">
            {publish! ? 'On' : 'Off'}
          </Label>
          <Switch
            id="airplane-mode"
            onClick={onPublishFlow}
            defaultChecked={publish!}
          />
        </div>
      </Link>
    </Card>
  );
};
export default WorkFlow;
