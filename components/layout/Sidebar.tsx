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
    LogOut,
    CalendarDays,
    Twitter,
    Instagram,
    Send
} from "lucide-react";
import { clsx } from "clsx";
import { useAuth } from "@/context/AuthContext";

const menuItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Member Card", href: "/member-card", icon: CreditCard },
    { name: "News", href: "/news", icon: Newspaper },
    { name: "Matches", href: "/matches", icon: Trophy },
    { name: "Fixtures", href: "/fixtures", icon: Calendar },
    { name: "Events", href: "/events", icon: CalendarDays },
    { name: "Standings", href: "/standings", icon: Trophy },
    { name: "Online Store", href: "/store", icon: ShoppingCart },
];

export function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

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
                {menuItems.filter(item => {
                    if (item.name === "Member Card") {
                        if (!user?.member_number || user?.role?.includes('guest')) {
                            return false;
                        }
                    }
                    return true;
                }).map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium",
                                isActive
                                    ? "bg-white text-primary-red shadow-lg shadow-black/10"
                                    : "text-secondary-white hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className={clsx("w-5 h-5", isActive ? "text-primary-red" : "text-secondary-white")} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-primary-red/20">
                <div className="flex justify-center gap-4 mb-4">
                    <a href="https://x.com/id_arsenal" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 hover:bg-white text-white hover:text-primary-red rounded-full transition-all duration-300 transform hover:scale-110">
                        <Twitter className="w-5 h-5" />
                    </a>
                    <a href="https://www.instagram.com/id_arsenal" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 hover:bg-white text-white hover:text-primary-red rounded-full transition-all duration-300 transform hover:scale-110">
                        <Instagram className="w-5 h-5" />
                    </a>
                    <a href="https://t.me/IDARSENAL" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 hover:bg-white text-white hover:text-primary-red rounded-full transition-all duration-300 transform hover:scale-110">
                        <Send className="w-5 h-5" />
                    </a>
                </div>
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
