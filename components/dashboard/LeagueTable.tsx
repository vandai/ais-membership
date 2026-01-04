"use client";

import { Card } from "@/components/ui/Card";
import { ChevronRight } from "lucide-react";
import { clsx } from "clsx";

const standings = [
    { pos: 1, team: "Liverpool", p: 19, pts: 42 },
    { pos: 2, team: "Arsenal", p: 19, pts: 40 },
    { pos: 3, team: "Man City", p: 18, pts: 38 },
    { pos: 4, team: "Aston Villa", p: 19, pts: 36 },
    { pos: 5, team: "Tottenham", p: 19, pts: 33 },
];

export function LeagueTable() {
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
                            <tr key={row.team} className={clsx("border-b border-gray-50/50 last:border-0", row.team === "Arsenal" ? "bg-red-50" : "")}>
                                <td className="py-2 pl-1 font-bold text-gray-500">{row.pos}</td>
                                <td className="py-2 font-semibold text-dark-navy flex items-center gap-2">
                                    {row.team === "Arsenal" && <div className="w-1.5 h-1.5 rounded-full bg-primary-red" />}
                                    {row.team}
                                </td>
                                <td className="py-2 text-center text-gray-600">{row.p}</td>
                                <td className="py-2 text-center font-bold text-dark-navy">{row.pts}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
