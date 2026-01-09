"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { Wallet, Award } from "lucide-react";
import QRCode from "react-qr-code";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/lib/api";

export function MemberCard({ className }: { className?: string }) {
    const { user } = useAuth();

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
                            <div className="w-24">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="/images/logo-ais-min.png"
                                    alt="AIS Logo"
                                    className="w-full h-auto object-contain drop-shadow-md"
                                />
                            </div>
                            {/* Crest based on status */}
                            {user?.status === 'active' ? (
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-gold to-[#B8860B] grid place-items-center shadow-gold border-2 border-white/30 animate-pulse-slow">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src="/images/canon-white-trans-sm.png"
                                        alt="Arsenal Canon"
                                        className="w-14 h-auto drop-shadow-sm"
                                    />
                                </div>
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 grid place-items-center shadow-inner border-2 border-white/20 relative overflow-hidden grayscale opacity-90">
                                    {/* Strike line */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="w-[140%] h-1 bg-red-500/60 rotate-45 transform"></div>
                                    </div>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src="/images/canon-white-trans-sm.png"
                                        alt="Arsenal Canon"
                                        className="w-14 h-auto opacity-50 grayscale"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Profile Picture */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="w-32 h-32 rounded-full border-[5px] border-white/20 shadow-2xl overflow-hidden bg-slate-100/90 relative z-20 backdrop-blur-sm">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={
                                        user?.profile_picture_url
                                            ? (user.profile_picture_url.startsWith("http")
                                                ? user.profile_picture_url
                                                : `${API_URL}${user.profile_picture_url.startsWith('/') ? user.profile_picture_url : `/${user.profile_picture_url}`}`)
                                            : "/images/profile-picture.png"
                                    }
                                    alt="Profile"
                                    className="w-full h-full object-cover opacity-95 hover:opacity-100 transition-opacity duration-300"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        // Prevent infinite loop by checking if we're already trying to load the default
                                        if (target.src.includes("/images/profile-picture.png")) {
                                            return;
                                        }
                                        target.src = "/images/profile-picture.png";
                                    }}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-xs uppercase opacity-70 mb-1 font-bold">Member Name</div>
                                    <div className="font-mono text-lg tracking-wider text-shadow uppercase truncate max-w-[200px]">{user?.name || "Member Name"}</div>
                                </div>
                                <div className="text-right">
                                    <div className="px-3 py-1 bg-accent-gold text-dark-navy font-bold text-lg font-mono uppercase rounded-full shadow-lg border border-white/20">
                                        {user?.member_number || "Guest"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>


                {/* BACK */}
                <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl overflow-hidden shadow-2xl bg-dark-navy text-secondary-white p-6 border border-white/10 flex flex-col items-center justify-center text-center relative">


                    <div className="bg-white p-3 rounded-xl shadow-inner">
                        <QRCode
                            value={`${API_URL}/card/${user?.member_number}`}
                            size={200}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            viewBox={`0 0 256 256`}
                        />
                    </div>


                </div>
            </div>
        </div >
    );
}
