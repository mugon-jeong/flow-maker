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

type Props = {
  id: string;
  title: string;
  description: string | null;
  publish: boolean | null;
};
const WorkFlow = ({id, title, description, publish}: Props) => {
  const onPublishFlow = async (event: any) => {};
  return (
    <Card className="flex w-full items-center justify-between mb-2">
      <Link className={'w-full'} href={`/workflows/${id}`}>
        <CardHeader className="flex flex-col gap-4">
          <div className="">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
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
