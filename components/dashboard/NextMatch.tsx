"use client";

import { Card } from "@/components/ui/Card";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import * as api from "@/lib/api";
import Link from "next/link";
import { Match } from "@/types/football";

export function NextMatch() {
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
            <Card className="flex flex-col items-center text-center animate-pulse h-64 justify-center">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="flex gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                </div>
            </Card>
        );
    }

    if (!match) {
        return (
            <Card className="flex flex-col items-center text-center justify-center p-6">
                <h3 className="font-bold text-dark-navy mb-2">Next Match</h3>
                <p className="text-gray-500 text-sm">No upcoming matches scheduled.</p>
            </Card>
        );
    }

    return (
        <Card className="flex flex-col items-center text-center">
            <h3 className="font-bold text-dark-navy mb-4 w-full border-b border-gray-100 pb-2">Next Match</h3>

            <div className="flex items-center justify-between w-full mb-6 relative">
                {/* Home Team */}
                <div className="flex flex-col items-center w-24">
                    <div className="w-12 h-12 relative flex items-center justify-center mb-2">
                        <img src={match.home.logo} alt={match.home.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="font-bold text-xs line-clamp-1">{match.home.name}</span>
                </div>

                <div className="flex flex-col items-center px-2">
                    <span className="text-xs text-gray-400 font-bold mb-1">VS</span>
                    <span className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-600 line-clamp-1 max-w-[80px]">
                        {match.league.name}
                    </span>
                    <span className="text-[10px] text-gray-400 mt-1">
                        {new Date(match.date).toLocaleDateString(undefined, {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                    </span>
                </div>

                {/* Away Team */}
                <div className="flex flex-col items-center w-24">
                    <div className="w-12 h-12 relative flex items-center justify-center mb-2">
                        <img src={match.away.logo} alt={match.away.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="font-bold text-xs line-clamp-1">{match.away.name}</span>
                </div>
            </div>

            <div className="bg-bg-grey rounded-lg p-3 w-full">
                <div className="flex items-center justify-center gap-2 text-primary-red font-bold text-xl font-mono">
                    {/* Days */}
                    <div className="flex flex-col items-center">
                        <span>{String(timeLeft.d).padStart(2, '0')}</span>
                        <span className="text-[8px] font-sans text-gray-500 font-normal">DAYS</span>
                    </div>
                    :
                    <div className="flex flex-col items-center">
                        <span>{String(timeLeft.h).padStart(2, '0')}</span>
                        <span className="text-[8px] font-sans text-gray-500 font-normal">HRS</span>
                    </div>
                    :
                    <div className="flex flex-col items-center">
                        <span>{String(timeLeft.m).padStart(2, '0')}</span>
                        <span className="text-[8px] font-sans text-gray-500 font-normal">MIN</span>
                    </div>
                    :
                    <div className="flex flex-col items-center">
                        <span>{String(timeLeft.s).padStart(2, '0')}</span>
                        <span className="text-[8px] font-sans text-gray-500 font-normal">SEC</span>
                    </div>
                </div>
            </div>

            <Link href="/fixtures" className="w-full mt-4">
                <button className="w-full bg-primary-red text-white py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition">
                    Match Centre
                </button>
            </Link>
        </Card>
    );
}
