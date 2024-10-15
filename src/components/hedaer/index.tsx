'use client';
import React from 'react';
import MobileSidebar from '@/components/sidebar/mobile-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import {Search} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Button} from '@/components/ui/button';
import Image from 'next/image';
import {usePathname, useRouter} from 'next/navigation';
import {useProfileContext} from '@/providers/profile-provider';
import {supabaseClient} from '@/lib/supabase-client';

type Props = {};
const HeaderBar = ({}: Props) => {
  const {avatar_url} = useProfileContext();
  const supabase = supabaseClient();
  const router = useRouter();
  const pathname = usePathname();
  const pathnames = pathname
    .split('/')
    .filter(value => value.length > 0)
    .map(value => value.concat()[0].toUpperCase() + value.slice(1));

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <MobileSidebar />
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          {pathnames.slice(0, -1).map((path, index) => (
            <>
              <BreadcrumbItem key={path}>
                <BreadcrumbLink>
                  <Link
                    href={`/${pathnames
                      .slice(0, index + 1)
                      .join('/')
                      .toLowerCase()}`}
                  >
                    {path}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index !== pathnames.length - 1 && <BreadcrumbSeparator />}
            </>
          ))}
          <BreadcrumbItem>
            <BreadcrumbPage>{pathnames[pathnames.length - 1]}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <Image
              alt=""
              src={avatar_url ?? ''}
              width={36}
              height={36}
              className="overflow-hidden rounded-full"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <form action="/api/auth/signout" method="post">
              <button type="submit">Sign out</button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default HeaderBar;
