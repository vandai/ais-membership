"use client";

import { useEffect, useState } from "react";
import * as api from "@/lib/api";
import { Competition } from "@/types/football";
import clsx from "clsx";

interface CompetitionFilterProps {
    competitions: Competition[];
    selectedId: number | null;
    onSelect: (id: number | null) => void;
    showAllOption?: boolean;
    showCounts?: boolean;
}

export default function CompetitionFilter({
    competitions,
    selectedId,
    onSelect,
    showAllOption = true,
    showCounts = true
}: CompetitionFilterProps) {
    if (competitions.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-3 pb-4 mb-6">
            {showAllOption && (
                <button
                    onClick={() => onSelect(null)}
                    className={clsx(
                        "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                        selectedId === null
                            ? "bg-primary-red text-white shadow-md"
                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
                    )}
                >
                    All Competitions
                </button>
            )}

            {competitions.map((comp) => (
                <button
                    key={comp.id}
                    onClick={() => onSelect(comp.id)}
                    className={clsx(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                        selectedId === comp.id
                            ? "bg-primary-red text-white shadow-md"
                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
                    )}
                >
                    <img src={comp.logo} alt={comp.name} className="w-5 h-5 object-contain" />
                    {comp.name}
                    {showCounts && (
                        <span className={clsx(
                            "text-xs px-1.5 py-0.5 rounded ml-1",
                            selectedId === comp.id ? "bg-white/20" : "bg-gray-100 text-gray-500"
                        )}>
                            {comp.match_count}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
}
