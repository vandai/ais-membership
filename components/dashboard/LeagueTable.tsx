"use client";

import { Card } from "@/components/ui/Card";
import { ChevronRight } from "lucide-react";
import { clsx } from "clsx";
import { useEffect, useState } from "react";
import * as api from "@/lib/api";
import { LeagueStanding } from "@/types/football";

export function LeagueTable() {
    const [standings, setStandings] = useState<LeagueStanding[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStandings = async () => {
            try {
                // Fetch Premier League (id 39) for current season (2025)
                const response = await api.getLeagueTable();
                if (response.data && Array.isArray(response.data)) {
                    // Take top 5
                    setStandings(response.data.slice(0, 5));
                }
            } catch (error) {
                console.error("Failed to fetch league table", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStandings();
    }, []);

    if (loading) {
        return (
            <Card className="flex flex-col h-full animate-pulse">
                <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-8 bg-gray-100 rounded w-full"></div>
                    ))}
                </div>
            </Card>
        );
    }

    return (
        <Card className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                <h3 className="font-bold text-dark-navy">Premier League</h3>
                <button className="text-primary-red text-xs font-bold flex items-center hover:underline">
                    Full Table <ChevronRight className="w-3 h-3 ml-1" />
                </button>
            </div>

            <div className="flex-1 overflow-visible">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-gray-400 text-[10px] uppercase border-b border-gray-100">
                            <th className="text-left pb-2 pl-1">Pos</th>
                            <th className="text-left pb-2">Club</th>
                            <th className="text-center pb-2">P</th>
                            <th className="text-center pb-2">Pts</th>
                        </tr>
                    </thead>
                    <tbody>
                        {standings.map((row) => (
                            <tr key={row.team.id} className={clsx("border-b border-gray-50/50 last:border-0", row.team.name === "Arsenal" ? "bg-red-50" : "")}>
                                <td className="py-2 pl-1 font-bold text-gray-500">{row.rank}</td>
                                <td className="py-2 font-semibold text-dark-navy flex items-center gap-2">
                                    {row.team.name === "Arsenal" && <div className="w-1.5 h-1.5 rounded-full bg-primary-red" />}
                                    <div className="w-5 h-5 relative flex-shrink-0">
                                        <img src={row.team.logo} alt={row.team.name} className="w-full h-full object-contain" />
                                    </div>
                                    <span className="line-clamp-1">{row.team.name}</span>
                                </td>
                                <td className="py-2 text-center text-gray-600">{row.stats.played}</td>
                                <td className="py-2 text-center font-bold text-dark-navy">{row.points}</td>
                            </tr>
                        ))}
                        {standings.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-4 text-gray-500 text-xs">
                                    No standings available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
