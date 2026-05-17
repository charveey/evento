"use client";

import { CalendarFold, House, Focus, Scan, UsersRound, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { unknown } from "zod";
import { ModeToggle } from "./ModeToggle";
import { useAuth } from "@/hooks/useAuth";
import useNavStore from "@/store/useNavStore";

export default function BottomNav() {
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
        flex flex-col items-center  p-2
        ${activeLink === link ? "opacity-100 bg-neutral-500 rounded-full p-2 px-8 bg-opacity-20" : "opacity-50"}
        transition-all duration-125 ease-in-out hover:opacity-100
    `;

	const { isNavHidden } = useNavStore();

	if (isNavHidden) {
		return null
	}

	if (pathname !== "/sign-in") {
		return (
			<nav className="w-full z-50">
				{/* <nav className="fixed bottom-0 w-full bg-background border-t z-50"> */}
				<div className="max-w-lg mx-auto flex justify-around items-center p-2 ">

					<Link href="/scan" className={linkClasses("scan")}>
						<Focus size={24} />
						{/* <span className="text-xs scale-75 tracking-wider font-semibold">Scan</span> */}
					</Link>

					<Link href="/qr-generator" className={linkClasses("qr-generator")}>
						<Users size={24} />
					</Link>
				</div>
			</nav>
		);
	}
}
