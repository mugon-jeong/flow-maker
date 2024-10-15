'use client';
import React from 'react';
import {ModeToggle} from '@/components/global/mode-toggle';
import {menuOptions} from '@/lib/constants';
import Link from 'next/link';
import {clsx} from 'clsx';
import {usePathname} from 'next/navigation';
import {Bell, Package2} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Separator} from '@/components/ui/separator';

type Props = {};
const Sidebar = ({}: Props) => {
  const pathName = usePathname();
  return (
    <nav className="h-screen dark:bg-black flex flex-col">
      <div className="flex items-center border-b px-4 h-14 ">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Package2 className="h-6 w-6" />
          <span className="">Acme Inc</span>
        </Link>
        <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </div>
      <div className={'h-screen flex flex-col justify-between py-4'}>
        <div className={'flex flex-col'}>
          {menuOptions.map(menuItem => (
            <ul key={menuItem.name}>
              <li>
                <Link
                  href={menuItem.href}
                  className={clsx(
                    'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary',
                    {
                      'text-primary': pathName === menuItem.href,
                      'text-muted-foreground': pathName !== menuItem.href,
                      'bg-muted': pathName === menuItem.href,
                    },
                  )}
                >
                  <menuItem.Component className="h-4 w-4" />
                  {menuItem.name}
                </Link>
              </li>
            </ul>
          ))}
        </div>
        <div>
          <Separator />
          <div className={'flex justify-end px-3 py-2'}>
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
