"use client";

import { Card } from "@/components/ui/Card";
import { useEffect, useState } from "react";
import * as api from "@/lib/api";
import { Match } from "@/types/football";

export function NextMatchBanner() {
    const [match, setMatch] = useState<Match | null>(null);
    const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number }>({ d: 0, h: 0, m: 0, s: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatch = async () => {
            try {
                const response = await api.getNextMatch();
                if (response.data) {
                    setMatch(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch next match", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMatch();
    }, []);

    useEffect(() => {
        if (!match) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const matchTime = new Date(match.date).getTime();
            const distance = matchTime - now;

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
                return;
            }

            const d = Math.floor(distance / (1000 * 60 * 60 * 24));
            const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft({ d, h, m, s });
        }, 1000);

        return () => clearInterval(interval);
    }, [match]);

    if (loading) {
        return (
            <div className="w-full h-64 bg-slate-200 rounded-2xl animate-pulse mb-8"></div>
        );
    }

    if (!match) {
        return null; // Don't show if no upcoming match
    }

    return (
        <div className="w-full bg-gradient-to-r from-[#0C1222] to-[#1A2540] rounded-2xl p-6 md:p-10 text-white shadow-xl mb-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-red/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-red/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

            <div className="relative z-10 flex flex-col items-center">
                <h2 className="text-xl md:text-2xl font-bold mb-8 tracking-wider uppercase text-center">
                    <span className="text-primary-red">Next</span> Match
                </h2>

                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 w-full">
                    {/* Home Team */}
                    <div className="flex flex-col items-center gap-4 w-1/3">
                        <div className="w-20 h-20 md:w-32 md:h-32 bg-white/5 rounded-full p-4 backdrop-blur-sm border border-white/10 shadow-lg">
                            <img src={match.home.logo} alt={match.home.name} className="w-full h-full object-contain drop-shadow-md" />
                        </div>
                        <h3 className="text-lg md:text-2xl font-bold tracking-tight text-center">{match.home.name}</h3>
                    </div>

                    {/* VS & Info */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="text-4xl md:text-6xl font-black text-white/20 font-sans italic">VS</div>
                        <div className="flex flex-col items-center gap-1">
                            <span className="bg-primary-red px-3 py-1 rounded text-xs font-bold tracking-wider uppercase shadow-sm">
                                {match.league.name}
                            </span>
                            <span className="text-sm md:text-base text-gray-300 font-medium mt-1">
                                {new Date(match.date).toLocaleDateString(undefined, {
                                    weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
                                })}
                            </span>
                            <span className="text-xs text-gray-400">
                                {match.venue.name}
                            </span>
                        </div>
                    </div>

                    {/* Away Team */}
                    <div className="flex flex-col items-center gap-4 w-1/3">
                        <div className="w-20 h-20 md:w-32 md:h-32 bg-white/5 rounded-full p-4 backdrop-blur-sm border border-white/10 shadow-lg">
                            <img src={match.away.logo} alt={match.away.name} className="w-full h-full object-contain drop-shadow-md" />
                        </div>
                        <h3 className="text-lg md:text-2xl font-bold tracking-tight text-center">{match.away.name}</h3>
                    </div>
                </div>

                {/* Countdown */}
                <div className="mt-10 md:mt-12 flex gap-4 md:gap-8">
                    <div className="flex flex-col items-center">
                        <span className="text-3xl md:text-5xl font-bold font-mono text-primary-red">{String(timeLeft.d).padStart(2, '0')}</span>
                        <span className="text-xs text-gray-400 tracking-widest uppercase mt-1">Days</span>
                    </div>
                    <span className="text-3xl md:text-5xl font-bold text-white/20 -mt-2">:</span>
                    <div className="flex flex-col items-center">
                        <span className="text-3xl md:text-5xl font-bold font-mono text-primary-red">{String(timeLeft.h).padStart(2, '0')}</span>
                        <span className="text-xs text-gray-400 tracking-widest uppercase mt-1">Hours</span>
                    </div>
                    <span className="text-3xl md:text-5xl font-bold text-white/20 -mt-2">:</span>
                    <div className="flex flex-col items-center">
                        <span className="text-3xl md:text-5xl font-bold font-mono text-primary-red">{String(timeLeft.m).padStart(2, '0')}</span>
                        <span className="text-xs text-gray-400 tracking-widest uppercase mt-1">Mins</span>
                    </div>
                    <span className="text-3xl md:text-5xl font-bold text-white/20 -mt-2">:</span>
                    <div className="flex flex-col items-center">
                        <span className="text-3xl md:text-5xl font-bold font-mono text-primary-red">{String(timeLeft.s).padStart(2, '0')}</span>
                        <span className="text-xs text-gray-400 tracking-widest uppercase mt-1">Secs</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
