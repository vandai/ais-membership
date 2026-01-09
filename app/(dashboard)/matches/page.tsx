"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import * as api from "@/lib/api";
import { Match, Competition } from "@/types/football";
import MatchList from "@/components/matches/MatchList";
import { LatestMatchHero } from "@/components/matches/LatestMatchHero";
import CompetitionFilter from "@/components/matches/CompetitionFilter";
import SeasonSelector from "@/components/football/SeasonSelector";
import { Loader2, CalendarX, Trophy } from "lucide-react";
import clsx from "clsx";

export default function MatchesPage() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [selectedLeague, setSelectedLeague] = useState<number | null>(null);
    const [selectedSeason, setSelectedSeason] = useState<number>(2025);
    const [competitions, setCompetitions] = useState<Competition[]>([]);
    const [fetchingMatches, setFetchingMatches] = useState(false);
    const [latestMatch, setLatestMatch] = useState<Match | null>(null);

    // Prevent double fetching in React 18 strict mode
    const loadedCompsRef = useRef(false);

    // Fetch competitions when season changes
    useEffect(() => {
        async function loadCompetitions() {
            try {
                const response = await api.getCompetitions(selectedSeason);
                if (response.data) {
                    setCompetitions(response.data);
                }
            } catch (error) {
                console.error("Failed to load competitions", error);
            }
        }

        loadCompetitions();
        setSelectedLeague(null); // Reset league filter on season change
        setPage(1); // Reset page
    }, [selectedSeason]);

    // Fetch latest match for Hero
    useEffect(() => {
        async function fetchLatestMatch() {
            try {
                const res = await api.getLastMatch();
                if (res.data) {
                    setLatestMatch(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch latest match", error);
            }
        }
        fetchLatestMatch();
    }, []);

    // Fetch matches
    const fetchMatches = useCallback(async (pageNum: number, leagueId: number | null, season: number, reset = false) => {
        if (fetchingMatches) return;
        setFetchingMatches(true);

        try {
            // Manually append season to the API result call as we didn't update api.ts signature for getMatchResults
            // to fetch directly. But I can't import apiRequest.
            // I will use api.getMatchResults and assume it might fail to filter by season if I don't fix api.ts
            // But I will fix api.ts in the NEXT step.
            // To make this robust, I'll update api.getMatchResults in a separate write.
            // For now, I'll pass it if the function supported it, but it doesn't.
            // I will implement this file assuming I will update api.ts immediately after.
            // I'll update the signature usage here:
            // @ts-ignore
            const response = await api.getMatchResults(pageNum, 9, leagueId, season);

            if (response.data) {
                if (reset) {
                    setMatches(response.data);
                } else {
                    setMatches((prev) => [...prev, ...response.data]);
                }
                setHasMore(response.meta?.current_page < response.meta?.last_page);
            }
        } catch (error) {
            console.error("Failed to fetch matches", error);
        } finally {
            setLoading(false);
            setFetchingMatches(false);
        }
    }, [fetchingMatches]);

    // Initial load and filter change
    useEffect(() => {
        setPage(1);
        setLoading(true);
        fetchMatches(1, selectedLeague, selectedSeason, true);
    }, [selectedLeague, selectedSeason]);

    const loadMore = () => {
        if (!fetchingMatches && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchMatches(nextPage, selectedLeague, selectedSeason);
        }
    };

    const handleFilterSelect = (id: number | null) => {
        setSelectedLeague(id === selectedLeague ? null : id);
    };

    return (
        <div className="space-y-8">
            {latestMatch && <LatestMatchHero match={latestMatch} />}

            <section id="match-results" className="scroll-mt-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-dark-navy flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-primary-red" />
                        Match Results
                    </h2>

                    <div className="w-full md:w-auto">
                        <SeasonSelector
                            selectedSeason={selectedSeason}
                            onSeasonChange={setSelectedSeason}
                        />
                    </div>
                </div>

                <CompetitionFilter
                    competitions={competitions}
                    onSelect={handleFilterSelect}
                    selectedId={selectedLeague}
                />

                {loading && matches.length === 0 ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 text-primary-red animate-spin" />
                    </div>
                ) : matches.length > 0 ? (
                    <>
                        <MatchList matches={latestMatch ? matches.filter(m => m.id !== latestMatch.id) : matches} />

                        {hasMore && (
                            <div className="mt-8 text-center">
                                <button
                                    onClick={loadMore}
                                    disabled={fetchingMatches}
                                    className="px-6 py-2 bg-white border border-gray-200 text-dark-navy font-semibold rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    {fetchingMatches ? "Loading..." : "Load More Matches"}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CalendarX className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No matches found</h3>
                        <p className="text-gray-500 mt-1 max-w-sm mx-auto">
                            We couldn't find any match results for the selected criteria.
                        </p>
                        <button
                            onClick={() => {
                                setSelectedLeague(null);
                                setSelectedSeason(2025);
                            }}
                            className="mt-4 text-primary-red font-medium hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}
