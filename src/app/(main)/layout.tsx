import React from 'react';
import Sidebar from '@/components/sidebar';
import HeaderBar from '@/components/hedaer';
import {ProfileProvider} from '@/providers/profile-provider';

type Props = {
  children: React.ReactNode;
};

const Layout = (props: Props) => {
  return (
    <ProfileProvider>
      <div className="grid w-full md:grid-cols-[200px_1fr] lg:grid-cols-[220px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <aside className="flex flex-col gap-2 border-r bg-background sm:flex">
            <Sidebar />
          </aside>
        </div>
        <div className="w-full">
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-4">
            <HeaderBar />
            {props.children}
          </div>
        </div>
      </div>
    </ProfileProvider>
  );
};

export default Layout;
