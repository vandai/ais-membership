"use client";

import { Card } from "@/components/ui/Card";
import Link from "next/link";

export function MemberCardPreview() {
    return (
        <Card className="flex flex-col">
            <h3 className="font-bold text-dark-navy mb-4 border-b border-gray-100 pb-2">Your Member Card</h3>

            <div className="relative w-full aspect-[1.586] bg-gradient-to-br from-primary-red to-[#800000] rounded-xl shadow-lg p-4 text-white overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl transform -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-[10px] opacity-80 uppercase tracking-widest">Arsenal Member</span>
                            <div className="font-bold text-lg font-heading tracking-wide uppercase">AIS</div>
                        </div>
                        {/* Logo Placeholder */}
                        <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center font-bold text-[8px]">
                            AFC
                        </div>
                    </div>
                    <div>
                        <div className="text-xs opacity-70 mb-1">Preview</div>
                        <div className="text-sm font-bold tracking-widest">•••• 4821</div>
                    </div>
                </div>
            </div>

            <Link href="/member-card" className="mt-auto pt-4">
                <button className="w-full bg-dark-navy text-white py-2 rounded-lg text-sm font-bold hover:bg-black transition">
                    View Full Card
                </button>
            </Link>
        </Card>
    );
}
