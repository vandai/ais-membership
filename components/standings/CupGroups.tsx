"use client";

import { StandingTeam } from "@/types/football";
import StandingsTable from "./StandingsTable";

interface CupGroupsProps {
    groups: {
        name: string;
        standings: StandingTeam[];
    }[];
}

export default function CupGroups({ groups }: CupGroupsProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {groups.map((group) => (
                <div key={group.name} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="font-bold text-dark-navy">{group.name}</h3>
                    </div>
                    <StandingsTable standings={group.standings} />
                </div>
            ))}
        </div>
    );
}
