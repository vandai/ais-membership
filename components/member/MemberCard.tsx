"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { QrCode, Wallet, Award } from "lucide-react";

export function MemberCard({ className }: { className?: string }) {
    const [isFlipped, setIsFlipped] = useState(false);

    // Toggle flip state
    const handleFlip = () => setIsFlipped(!isFlipped);

    return (
        <div className={clsx("perspective-1000 w-full max-w-md mx-auto aspect-[1.586] cursor-pointer group", className)} onClick={handleFlip}>
            <div
                className={clsx(
                    "relative w-full h-full duration-700 transition-all [transform-style:preserve-3d]",
                    isFlipped ? "[transform:rotateY(180deg)]" : ""
                )}
            >
                {/* FRONT */}
                <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary-red to-[#8B0000] text-secondary-white border border-white/10">
                    {/* Glassmorphism Overlay */}
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" />

                    {/* Decorative Elements */}
                    <div className="absolute -right-16 -top-16 w-64 h-64 bg-accent-gold/20 rounded-full blur-3xl p-10" />
                    <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-primary-red/40 rounded-full blur-3xl" />

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-between p-6 z-10">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-sm font-bold opacity-80 uppercase tracking-widest mb-1">Arsenal Member</h2>
                                <div className="text-3xl font-heading font-black tracking-tight uppercase">AIS</div>
                            </div>
                            {/* Hologram Effect Placeholder */}
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gray-300 via-white to-gray-300 opacity-80 grid place-items-center animate-shine overflow-hidden shadow-inner border border-white/40">
                                <Award className="text-primary-red w-6 h-6" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-xs uppercase opacity-70 mb-1 font-bold">Member Name</div>
                                    <div className="font-mono text-lg tracking-wider text-shadow">GOONER NAME</div>
                                </div>
                                <div className="text-right">
                                    <div className="px-3 py-1 bg-accent-gold text-dark-navy font-bold text-xs uppercase rounded-full shadow-lg border border-white/20">
                                        Gold Tier
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between text-xs font-mono opacity-80">
                                <span>EXP: 05/26</span>
                                <span>ID: 8092124</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BACK */}
                <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl overflow-hidden shadow-2xl bg-dark-navy text-secondary-white p-6 border border-white/10 flex flex-col items-center justify-center text-center">

                    <div className="text-lg font-bold mb-4 uppercase tracking-widest">Entry Pass</div>

                    <div className="bg-white p-3 rounded-xl mb-6 shadow-inner">
                        <QrCode className="w-32 h-32 text-black" />
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log("Add to wallet");
                        }}
                        className="flex items-center gap-2 bg-black hover:bg-black/80 text-white px-6 py-3 rounded-full font-bold transition-all shadow-lg border border-gray-800"
                    >
                        <Wallet className="w-5 h-5" />
                        <span>Add to Apple Wallet</span>
                    </button>
                    <p className="mt-4 text-[10px] text-gray-500">Tap card to flip back</p>
                </div>
            </div>
        </div>
    );
}
