"use client"
import React from 'react';
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {Menu} from "lucide-react";
import Link from "next/link";
import {menuOptions} from "@/lib/constants";
import {clsx} from "clsx";
import {usePathname} from "next/navigation";

type Props = {

};
const MobileSidebar = ({}: Props) => {
    const pathName = usePathname()
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 md:hidden"
                >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
                <nav className="grid gap-2 text-lg font-medium py-5">
                    {menuOptions.map((menuItem) => (
                        <ul key={menuItem.name}>
                            <li>
                                <Link
                                    href="#"
                                    className={clsx("mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground", {
                                        "text-primary": pathName === menuItem.href,
                                        "text-muted-foreground": pathName !== menuItem.href,
                                        "bg-muted": pathName === menuItem.href
                                    })}
                                >
                                    <menuItem.Component className="h-5 w-5"/>
                                    {menuItem.name}
                                </Link>
                            </li>
                        </ul>
                    ))}
                </nav>
            </SheetContent>
        </Sheet>
    );
};

export default MobileSidebar