import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import {Clipboard, SquarePen, Trash} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {useToast} from '@/hooks/use-toast';
import {deleteWorkflow} from '@/app/(main)/(pages)/workflows/_actions/workflow-action';
import {useModal} from '@/providers/modal-provider';
import AlertModal from '@/components/global/alert-modal';
import DrawerModal from '@/components/global/drawer-modal';
import WorkflowForm from '@/app/(main)/(pages)/workflows/_components/workflow-form';
import {BlockCopyButton} from '@/components/global/block-copy-button';
import {TooltipProvider} from '@/components/ui/tooltip';

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
  const onUpdateFlow = () => {
    setOpen(
      <DrawerModal
        title="Update WorkFlow"
        subheading="Workflows are a powerfull that help you"
      >
        <WorkflowForm
          id={id}
          defaultValues={{title: title, description: description}}
        />
      </DrawerModal>,
    );
  };
  const handleRemove = () => {
    setOpen(<AlertModal title={'delete workflow'} onConfirm={onDeleteFlow} />);
  };
  return (
    <Card className="flex flex-col w-full items-center justify-between mb-2">
      <Link className={'w-full'} href={`/workflows/${title}?id=${id}`}>
        <CardHeader className="flex flex-row justify-between">
          <div className="flex flex-col gap-4">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className={'flex flex-row gap-2'}>
            <Button
              size={'icon'}
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                onUpdateFlow();
              }}
            >
              <SquarePen />
            </Button>
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
          </div>
        </CardHeader>
      </Link>
      <CardContent className="w-full flex flex-col items-end justify-center gap-2">
        <div
          className={
            'w-full flex flex-row mb-4 mt-4 overflow-x-auto rounded-lg border bg-zinc-950 py-4 px-2 dark:bg-zinc-900'
          }
        >
          <div
            className={
              'flex flex-row w-full justify-center items-center rounded bg-muted px-[0.3rem] py-[0.2rem] text-sm'
            }
          >
            <div className={'inline-block min-h-1 w-full p-1'}>
              http://localhost:3000/workflows/{title}/{id}
            </div>
            <TooltipProvider>
              <BlockCopyButton
                copyValue={`http://localhost:3000/workflows/${title}/${id}`}
              />
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default WorkFlow;
