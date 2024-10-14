'use client';
import React from 'react';
import {useRouter} from 'next/navigation';

type Props = {};
const Page = ({}: Props) => {
  const router = useRouter();
  return (
    <div className="relative flex flex-col">
      <h1 className="sticky top-0 z-[10] flex items-center justify-between border-b bg-background/50 p-6 text-4xl backdrop-blur-lg">
        Workflows
        <button onClick={() => router.push('/workflows/editor')}>make</button>
      </h1>
    </div>
  );
};

export default Page;
