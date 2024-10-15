import React from 'react';

type Props = {
  children: React.ReactNode;
};
const Layout = ({children}: Props) => {
  return (
    <div className={'flex items-center justify-center h-screen'}>
      <div className={'w-2/3'}>{children}</div>
    </div>
  );
};

export default Layout;
