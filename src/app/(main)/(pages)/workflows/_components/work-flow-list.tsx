'use client';
import React, {useEffect} from 'react';
import {getWorkflows} from '@/app/(main)/(pages)/workflows/_actions/workflow-action';
import WorkFlow from '@/app/(main)/(pages)/workflows/_components/work-flow';

type Props = {
  user: string;
};

const WorkFlowList = ({user}: Props) => {
  const [workflows, setWorkflows] = React.useState<
    {
      created_at: string;
      description: string | null;
      id: string;
      publish: boolean;
      title: string;
      user_id: string | null;
    }[]
  >([]);
  useEffect(() => {
    getWorkflows(user).then(data => {
      if (data) {
        setWorkflows(data);
      }
    });
  }, [user]);
  console.log('workflows', workflows);
  return (
    <div className="relative flex flex-col gap-4">
      <section className="m-2 flex flex-col">
        {workflows ? (
          workflows.map(flow => <WorkFlow key={flow.id} {...flow} />)
        ) : (
          <div className="mt-28 flex items-center justify-center text-muted-foreground">
            No Workflows
          </div>
        )}
      </section>
    </div>
  );
};
export default WorkFlowList;
