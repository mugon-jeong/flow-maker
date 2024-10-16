import React from 'react';
import CircleProgress from '@/components/global/circle-progress';

const Loading = () => {
  return (
    <div className={'absolute -inset-x-0'}>
      <CircleProgress />
    </div>
  );
};

export default Loading;
