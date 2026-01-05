"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    User,
    CreditCard,
    Newspaper,
    Calendar,
    Trophy,
    ShoppingCart,
    LogOut
} from "lucide-react";
import { clsx } from "clsx";
import { useAuth } from "@/context/AuthContext";

const menuItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Member Card", href: "/member-card", icon: CreditCard },
    { name: "News", href: "/news", icon: Newspaper },
    { name: "Fixtures", href: "/fixtures", icon: Calendar },
    { name: "Matches/Results", href: "/results", icon: Trophy },
    { name: "Online Store", href: "/store", icon: ShoppingCart },
];

export function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <aside className="hidden md:flex flex-col w-64 bg-primary-red h-screen fixed left-0 top-0 overflow-y-auto text-secondary-white shadow-xl z-50">
            <div className="p-6 flex flex-col items-center border-b border-primary-red/20">
                <div className="w-full relative mb-2 px-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/images/logo-ais-min.png"
                        alt="Arsenal Indonesia Supporter"
                        className="w-full h-auto object-contain"
                    />
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-secondary-white text-primary-red font-bold shadow-md"
                                    : "hover:bg-black/10 text-secondary-white"
                            )}
                        >
                            <item.icon className={clsx("w-5 h-5", isActive ? "text-primary-red" : "text-secondary-white")} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-primary-red/20">
                <button
                    onClick={() => logout()}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-secondary-white hover:bg-black/10 transition-colors cursor-pointer"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
