"use client";

import { useState, useEffect } from "react";
import * as api from "@/lib/api";
import { Season } from "@/types/football";
import { clsx } from "clsx";
import { ChevronDown } from "lucide-react";

interface SeasonSelectorProps {
    selectedSeason: number;
    onSeasonChange: (season: number) => void;
}

export default function SeasonSelector({ selectedSeason, onSeasonChange }: SeasonSelectorProps) {
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadSeasons() {
            try {
                const response = await api.getSeasons();
                if (response.data) {
                    setSeasons(response.data);
                }
            } catch (error) {
                console.error("Failed to load seasons", error);
            } finally {
                setLoading(false);
            }
        }

        loadSeasons();
    }, []);

    if (loading) {
        return <div className="h-10 w-32 bg-slate-200 rounded-lg animate-pulse"></div>;
    }

    if (seasons.length === 0) return null;

    return (
        <div className="relative">
            <select
                value={selectedSeason}
                onChange={(e) => onSeasonChange(Number(e.target.value))}
                className="appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-xl leading-tight focus:outline-none focus:bg-white focus:border-primary-red transition-all font-medium cursor-pointer shadow-sm hover:border-gray-300"
            >
                {seasons.map((season) => (
                    <option key={season.year} value={season.year}>
                        Season {season.label}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <ChevronDown className="w-4 h-4" />
            </div>
        </div>
    );
}
