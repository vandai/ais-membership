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
    { name: "Matches", href: "/matches", icon: Trophy },
    { name: "Fixtures", href: "/fixtures", icon: Calendar },
    { name: "Standings", href: "/standings", icon: Trophy },
    { name: "News", href: "/news", icon: Newspaper },
    { name: "Events", href: "/events", icon: CalendarDays },
    { name: "Membership", href: "/member-card", icon: CreditCard },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Online Store", href: "/store", icon: ShoppingCart },
];

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={clsx(
                "flex flex-col w-64 bg-primary-red h-[100dvh] fixed left-0 top-0 text-secondary-white shadow-xl z-[60] transition-transform duration-300 ease-in-out md:translate-x-0 overflow-hidden",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-4 flex flex-col items-center border-b border-primary-red/20 shrink-0">
                    <div className="w-full relative px-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/images/logo-ais-min.png"
                            alt="Arsenal Indonesia Supporter"
                            className="w-full h-auto object-contain"
                        />
                    </div>
                </div>

                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {menuItems.filter(item => {
                        if (item.name === "Membership") {
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
                                onClick={onClose}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 font-medium",
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

                <div className="p-4 border-t border-primary-red/20 shrink-0 pb-safe">
                    <div className="flex justify-center gap-4 mb-3">
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
                        className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-secondary-white hover:bg-black/10 transition-colors cursor-pointer"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
