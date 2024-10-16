'use client';
import React from 'react';
import {Plus} from 'lucide-react';
import {useModal} from '@/providers/modal-provider';
import DrawerModal from '@/components/global/drawer-modal';
import {Button} from '@/components/ui/button';
import WorkflowForm from '@/app/(main)/(pages)/workflows/_components/workflow-form';
import WorkFlowList from '@/app/(main)/(pages)/workflows/_components/work-flow-list';
import {useAuthContext} from '@/providers/auth-provider';

type Props = {};
const Page = ({}: Props) => {
  const {setOpen} = useModal();
  const {user} = useAuthContext();
  const handleClick = () => {
    setOpen(
      <DrawerModal
        title="Create a Workflow"
        subheading="Workflows are a powerfull that help you"
      >
        <WorkflowForm />
      </DrawerModal>,
    );
  };
  return (
    <div className="relative flex flex-col">
      <h1 className="sticky top-0 z-[10] flex items-center justify-between border-b bg-background/50 p-6 text-4xl backdrop-blur-lg">
        Workflows
        <Button size={'icon'} onClick={handleClick}>
          <Plus />
        </Button>
      </h1>
      {user && <WorkFlowList user={user.id} />}
    </div>
  );
};

export default Page;
