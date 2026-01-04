"use client";

import { Card } from "@/components/ui/Card";
import { Award } from "lucide-react";

export function HeroSection() {
    return (
        <div className="bg-gradient-to-r from-primary-red to-[#B00303] rounded-[12px] p-6 text-white shadow-lg relative overflow-hidden">
            {/* Background Pattern Element */}
            <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 transform origin-bottom-right" />

            <div className="flex flex-col md:flex-row justify-between items-center relative z-10">
                <div className="mb-4 md:mb-0 text-center md:text-left">
                    <h2 className="text-3xl font-bold font-heading uppercase tracking-wide">
                        Welcome back, Gooner!
                    </h2>
                    <p className="text-white/80 mt-2 text-sm max-w-md">
                        Your dedication makes us stronger. Check your exclusive member benefits and latest club news.
                    </p>
                    <button className="mt-4 bg-white text-primary-red font-bold py-2 px-6 rounded-full hover:bg-gray-100 transition-colors shadow-sm">
                        Member Area
                    </button>
                </div>

                <div className="flex flex-col items-center justify-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-accent-gold to-[#B8860B] rounded-full flex items-center justify-center shadow-gold border-4 border-white/20">
                        <div className="text-center">
                            <Award className="w-8 h-8 text-white mx-auto mb-1" />
                            <span className="text-[10px] font-bold text-white uppercase block leading-tight">Gold<br />Member</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
