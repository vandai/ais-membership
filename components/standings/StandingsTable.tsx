"use client";

import { StandingTeam } from "@/types/football";
import clsx from "clsx";

interface StandingsTableProps {
    standings: StandingTeam[];
}

export default function StandingsTable({ standings }: StandingsTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                    <tr>
                        <th className="px-4 py-3 text-center w-12">Pos</th>
                        <th className="px-4 py-3">Team</th>
                        <th className="px-4 py-3 text-center">P</th>
                        <th className="px-4 py-3 text-center hidden md:table-cell">W</th>
                        <th className="px-4 py-3 text-center hidden md:table-cell">D</th>
                        <th className="px-4 py-3 text-center hidden md:table-cell">L</th>
                        <th className="px-4 py-3 text-center hidden md:table-cell">GF</th>
                        <th className="px-4 py-3 text-center hidden md:table-cell">GA</th>
                        <th className="px-4 py-3 text-center">GD</th>
                        <th className="px-4 py-3 text-center font-bold">Pts</th>
                        <th className="px-4 py-3 text-center hidden lg:table-cell">Form</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {standings.map((row) => {
                        const isArsenal = row.team.name === "Arsenal";
                        return (
                            <tr
                                key={row.team.id}
                                className={clsx(
                                    "hover:bg-gray-50 transition-colors",
                                    isArsenal && "bg-red-50 hover:bg-red-100"
                                )}
                            >
                                <td className="px-4 py-3 text-center font-medium text-gray-900">
                                    <span className={clsx(
                                        "w-6 h-6 inline-flex items-center justify-center rounded-full text-xs",
                                        row.rank <= 4 ? "bg-green-100 text-green-700" :
                                            row.rank >= 18 ? "bg-red-100 text-red-700" :
                                                "bg-gray-100 text-gray-600"
                                    )}>
                                        {row.rank}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <img src={row.team.logo} alt={row.team.name} className="w-6 h-6 object-contain" />
                                        <span className={clsx("font-medium", isArsenal ? "text-primary-red font-bold" : "text-gray-900")}>
                                            {row.team.name}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-center text-gray-900">{row.stats.played}</td>
                                <td className="px-4 py-3 text-center text-gray-600 hidden md:table-cell">{row.stats.won}</td>
                                <td className="px-4 py-3 text-center text-gray-600 hidden md:table-cell">{row.stats.drawn}</td>
                                <td className="px-4 py-3 text-center text-gray-600 hidden md:table-cell">{row.stats.lost}</td>
                                <td className="px-4 py-3 text-center text-gray-600 hidden md:table-cell">{row.stats.goals_for}</td>
                                <td className="px-4 py-3 text-center text-gray-600 hidden md:table-cell">{row.stats.goals_against}</td>
                                <td className="px-4 py-3 text-center font-medium text-gray-900">
                                    {row.goals_diff > 0 ? `+${row.goals_diff}` : row.goals_diff}
                                </td>
                                <td className="px-4 py-3 text-center font-bold text-dark-navy text-base">{row.points}</td>
                                <td className="px-4 py-3 hidden lg:table-cell">
                                    <div className="flex items-center justify-center gap-1">
                                        {row.form?.split('').map((char, i) => (
                                            <span
                                                key={i}
                                                className={clsx(
                                                    "w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold text-white",
                                                    char === 'W' ? "bg-green-500" :
                                                        char === 'D' ? "bg-gray-400" : "bg-red-500"
                                                )}
                                            >
                                                {char}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
