import React from 'react';

type Props = {};
const Page = ({}: Props) => {
  return (
    <div className="relative flex flex-col">
      <h1 className="sticky top-0 z-[10] flex items-center justify-between border-b bg-background/50 p-6 text-4xl backdrop-blur-lg">
        Dashboard
      </h1>
    </div>
  );
};

export default Page;
