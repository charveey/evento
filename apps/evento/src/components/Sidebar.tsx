"use client";

import Link from "next/link";
import { CalendarFold, House, Scan, Users, Lock } from "lucide-react";
import { Separator } from "./ui/separator";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Account from "./Account";
import { ModeToggle } from "./ModeToggle";
import { useAuth } from "@/hooks/useAuth";


export default function Sidebar() {

    const pathname = usePathname();
    const [activeLink, setActiveLink] = useState("");

    const { currentUserRole } = useAuth()

    useEffect(() => {
        if (pathname) {
            if (pathname === "/") {
                setActiveLink("home");
            } else if (pathname === "/scan") {
                setActiveLink("scan");
            } else if (pathname === "/qr-generator") {
                setActiveLink("qr-generator");
            }
        }
    }, [pathname]);

    const linkClasses = (link: string) => `
        ${activeLink === link ? "bg-neutral-500 bg-opacity-20 opacity-100" : "opacity-70"}
       p-3 rounded-lg hover:bg-neutral-500 hover:bg-opacity-20 transition-all font-semibold w-full flex gap-3 items-center text-md
    `;


    if (pathname !== "/sign-in") {
        return (
            <nav className="border-r p-3 flex-col flex gap-1 h-full w-72">
                <div className="flex items-center gap-1">
                    <p className="font-bold text-2xl py-3 pl-2 ">
                        evento
                    </p>

                    <div className="opacity-50">
                        <ModeToggle compactMode={true} />
                    </div>
                </div>


                <div className="p-3 rounded-lg items-center hover:bg-neutral-500 hover:bg-opacity-20 flex">
                    <Account />
                </div>


                {currentUserRole === "ADMIN" &&
                    <>
                        <Link href="/admin" className={linkClasses("admin")}>
                            <Lock className="size-5" />Manage Access
                        </Link>

                        {/* <Separator className="" /> */}
                    </>
                }



                {/* <Link href="/" className={linkClasses("home")}>
                    <House className="size-5" />Home
                </Link> */}
                <Link href="/scan" className={linkClasses("scan")}>
                    <Scan className="size-5" />Scan
                </Link>
                <Link href="/qr-generator" className={linkClasses("qr-generator")}>
                    <Users className="size-5" />Badge List
                </Link>
                



                {/* 
                <Link href="/scan" className="p-3 rounded-lg hover:bg-neutral-500 hover:bg-opacity-20 transition-all font-semibold w-full flex gap-2">
                    <Scan />Departments
                </Link> */}
            </nav>
        )
    }

    return (<nav></nav>)

}