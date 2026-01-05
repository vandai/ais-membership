"use client";

import { useEffect, useState } from "react";
import * as api from "@/lib/api";
import { CompetitionStanding, Competition } from "@/types/football";
import CompetitionFilter from "@/components/matches/CompetitionFilter";
import StandingsTable from "@/components/standings/StandingsTable";
import CupGroups from "@/components/standings/CupGroups";
import SeasonSelector from "@/components/football/SeasonSelector";
import { Info, Loader2, Trophy } from "lucide-react";

export default function StandingsPage() {
    const [standingsData, setStandingsData] = useState<CompetitionStanding[]>([]);
    const [loading, setLoading] = useState(true);
    // Default to Premier League (39)
    const [selectedLeague, setSelectedLeague] = useState<number | null>(39);
    const [selectedSeason, setSelectedSeason] = useState<number>(2025);
    const [derivedCompetitions, setDerivedCompetitions] = useState<Competition[]>([]);

    useEffect(() => {
        async function fetchStandings() {
            setLoading(true);
            try {
                const response = await api.getAllStandings(selectedSeason);
                if (response.data) {
                    setStandingsData(response.data);

                    // Derive valid competitions from the standings response
                    // Only show competitions that we have data for
                    const comps = response.data.map(item => item.competition);
                    setDerivedCompetitions(comps);

                    // Check if selected league is still valid for this season
                    const hasSelected = comps.find(c => c.id === selectedLeague);
                    if (!hasSelected) {
                        const pl = comps.find(c => c.id === 39);
                        setSelectedLeague(pl ? 39 : comps[0]?.id || null);
                    }
                } else {
                    setStandingsData([]);
                    setDerivedCompetitions([]);
                }
            } catch (error) {
                console.error("Failed to fetch standings", error);
                setStandingsData([]);
            } finally {
                setLoading(false);
            }
        }

        fetchStandings();
    }, [selectedSeason]);

    const currentCompetition = standingsData.find(c => c.competition.id === selectedLeague);

    const handleFilterSelect = (id: number | null) => {
        if (!id) return;
        setSelectedLeague(id);
    };

    return (
        <div className="space-y-8">
            <section>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h2 className="text-3xl font-bold text-dark-navy border-l-4 border-primary-red pl-4 flex items-center gap-2">
                        Standings
                    </h2>

                    <div className="w-full md:w-auto">
                        <SeasonSelector
                            selectedSeason={selectedSeason}
                            onSeasonChange={setSelectedSeason}
                        />
                    </div>
                </div>

                {/* Only render filter if we have competitions */}
                {derivedCompetitions.length > 0 && (
                    <div className="mb-8">
                        <CompetitionFilter
                            competitions={derivedCompetitions}
                            onSelect={handleFilterSelect}
                            selectedId={selectedLeague}
                            showAllOption={false}
                            showCounts={false} // User requested to remove number in filter
                        />
                    </div>
                )}

                {loading ? (
                    <div className="space-y-4">
                        <div className="h-12 bg-slate-200 rounded-t-xl animate-pulse"></div>
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="h-12 bg-slate-100 rounded animate-pulse"></div>
                        ))}
                    </div>
                ) : currentCompetition ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-4">
                                <img
                                    src={currentCompetition.competition.logo}
                                    alt={currentCompetition.competition.name}
                                    className="w-12 h-12 object-contain"
                                />
                                <div>
                                    <h3 className="text-xl font-bold text-dark-navy">{currentCompetition.competition.name}</h3>
                                    <p className="text-sm text-gray-500">Season {currentCompetition.competition.season.year}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-0">
                            {currentCompetition.competition.type === 'League' && currentCompetition.standings && (
                                <StandingsTable standings={currentCompetition.standings} />
                            )}

                            {/* Handle Cup with groups */}
                            {currentCompetition.competition.type === 'Cup' && currentCompetition.groups && (
                                <div className="p-6">
                                    <CupGroups groups={currentCompetition.groups} />
                                </div>
                            )}

                            {/* Handle Cup with single table/phase (like new UCL sometimes represented without groups array if flattened) */}
                            {currentCompetition.competition.type === 'Cup' && !currentCompetition.groups && currentCompetition.standings && (
                                <StandingsTable standings={currentCompetition.standings} />
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                        <Info className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No standings available</h3>
                        <p className="text-gray-500 mt-1">Standings for this competition are not available or it hasn't started yet.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
