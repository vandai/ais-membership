"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    User,
    CreditCard,
    Newspaper,
    Menu,
    Trophy
} from "lucide-react";
import { clsx } from "clsx";

const mobileItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Matches", href: "/matches", icon: Trophy },
    { name: "News", href: "/news", icon: Newspaper },
];

export function BottomNav({ onMenuClick }: { onMenuClick?: () => void }) {
    const pathname = usePathname();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50">
            <div className="flex justify-around items-center h-16">
                {mobileItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex flex-col items-center justify-center w-full h-full space-y-1"
                        >
                            <item.icon
                                className={clsx(
                                    "w-6 h-6 transition-colors",
                                    isActive ? "text-primary-red" : "text-gray-400"
                                )}
                            />
                            <span
                                className={clsx(
                                    "text-[10px] font-medium transition-colors",
                                    isActive ? "text-primary-red" : "text-gray-400"
                                )}
                            >
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
                <button
                    onClick={onMenuClick}
                    className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-400"
                >
                    <Menu className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Menu</span>
                </button>
            </div>
        </nav>
    );
}
