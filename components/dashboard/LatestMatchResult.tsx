"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { useEffect, useState } from "react";
import * as api from "@/lib/api";
import { Match } from "@/types/football";
import { MapPin } from "lucide-react";

export function LatestMatchResult() {
    const [match, setMatch] = useState<Match | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatch = async () => {
            try {
                const response = await api.getLastMatch();
                if (response.data) {
                    setMatch(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch last match", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMatch();
    }, []);

    if (loading) {
        return (
            <Card className="flex flex-col items-center text-center h-full justify-center animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                </div>
            </Card>
        );
    }

    if (!match) {
        return (
            <Card className="flex flex-col items-center text-center h-full justify-center">
                <h3 className="font-bold text-dark-navy mb-2">Latest Result</h3>
                <p className="text-gray-500 text-sm">No recent match results found.</p>
            </Card>
        );
    }

    return (
        <Card className="flex flex-col items-center text-center h-full">
            <h3 className="font-bold text-dark-navy mb-4 w-full border-b border-gray-100 pb-2">Latest Result</h3>

            <div className="flex items-center justify-between w-full mb-4">
                {/* Home Team */}
                <div className="flex flex-col items-center flex-1">
                    <div className="w-12 h-12 relative flex items-center justify-center mb-2">
                        <img src={match.home.logo} alt={match.home.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="font-bold text-xs line-clamp-1">{match.home.name}</span>
                </div>

                <div className="flex flex-col items-center px-2">
                    <div className="text-3xl font-bold text-dark-navy font-mono bg-gray-100 px-4 py-1 rounded-lg">
                        {match.score?.display || `${match.home.goals} - ${match.away.goals}`}
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">FT</span>
                </div>

                {/* Away Team */}
                <div className="flex flex-col items-center flex-1">
                    <div className="w-12 h-12 relative flex items-center justify-center mb-2">
                        <img src={match.away.logo} alt={match.away.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="font-bold text-xs line-clamp-1">{match.away.name}</span>
                </div>
            </div>

            <div className="bg-bg-grey rounded-lg p-3 w-full text-center text-xs space-y-1 mt-auto">
                <div className="flex items-center justify-center gap-1 text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span>{match.venue.name}, {match.venue.city}</span>
                </div>
                <div className="text-gray-400 text-[10px]">
                    {new Date(match.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            <Link href={`/matches/${match.id}`} className="w-full mt-4">
                <button className="w-full bg-dark-navy text-white py-2 rounded-lg text-sm font-bold hover:bg-black transition">
                    Match Report
                </button>
            </Link>
        </Card>
    );
}
