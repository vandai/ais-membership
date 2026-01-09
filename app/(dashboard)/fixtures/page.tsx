"use client";

import { useEffect, useState, useCallback } from "react";
import * as api from "@/lib/api";
import { Match, Competition } from "@/types/football";
import MatchList from "@/components/matches/MatchList";
import { NextMatchBanner } from "@/components/matches/NextMatchBanner";
import { Loader2, Calendar, Filter } from "lucide-react";
import clsx from "clsx";

export default function FixturesPage() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'home' | 'away'>('all');
    const [fetchingMatches, setFetchingMatches] = useState(false);
    const [nextMatchId, setNextMatchId] = useState<number | null>(null);

    // Fetch next match ID to exclude it
    useEffect(() => {
        const fetchNextMatch = async () => {
            try {
                const res = await api.getNextMatch();
                if (res.data) {
                    setNextMatchId(res.data.id);
                }
            } catch (e) {
                // ignore
            }
        };
        fetchNextMatch();
    }, []);

    // Fetch matches
    const fetchMatches = useCallback(async (pageNum: number, filter: 'all' | 'home' | 'away', reset = false) => {
        if (fetchingMatches) return;
        setFetchingMatches(true);

        try {
            // We fetch fixtures. NOTE: The API might filters based on status 'NS' (Not Started)
            // Sorting: Typically API returns nearest upcoming first.
            const response = await api.getFixtures(pageNum, 9);

            if (response.data) {
                let fetchedMatches = response.data;

                // Client-side filtering for Home/Away if API doesn't support it directly in this endpoint yet
                // Assuming 'Arsenal' is the team we care about. 
                // We need to know which team is "us". Usually usually hardcoded or known ID.
                // For now, let's filter based on names containing "Arsenal".
                if (filter !== 'all') {
                    fetchedMatches = fetchedMatches.filter((m: Match) => {
                        const isHome = m.home.name.toLowerCase().includes('arsenal');
                        const isAway = m.away.name.toLowerCase().includes('arsenal');
                        if (filter === 'home') return isHome;
                        if (filter === 'away') return isAway;
                        return true;
                    });
                }

                if (reset) {
                    setMatches(fetchedMatches);
                } else {
                    setMatches((prev) => [...prev, ...fetchedMatches]);
                }

                // Pagination logic might be tricky with client-side filtering, 
                // ideally backend handles this. For now, we respect the API's pagination meta
                // but visually we might show fewer if filtered out.
                setHasMore(response.meta?.current_page < response.meta?.last_page);
            }
        } catch (error) {
            console.error("Failed to fetch fixtures", error);
        } finally {
            setLoading(false);
            setFetchingMatches(false);
        }
    }, [fetchingMatches]);

    // Initial load and filter change
    useEffect(() => {
        setPage(1);
        setLoading(true);
        // We pass true to reset the list
        fetchMatches(1, selectedFilter, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFilter]);

    const loadMore = () => {
        if (!fetchingMatches && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchMatches(nextPage, selectedFilter);
        }
    };

    // Filter out the banner match if we have it
    const displayMatches = nextMatchId
        ? matches.filter(m => m.id !== nextMatchId)
        : matches;

    return (
        <div className="space-y-8">
            <NextMatchBanner />
            <section id="fixtures">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-dark-navy flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-primary-red" />
                        Upcoming Fixtures
                    </h2>

                    {/* Filter Buttons */}
                    <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-100">
                        <button
                            onClick={() => setSelectedFilter('all')}
                            className={clsx(
                                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                                selectedFilter === 'all'
                                    ? "bg-primary-red text-white"
                                    : "text-gray-600 hover:bg-gray-50 bg-transparent"
                            )}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setSelectedFilter('home')}
                            className={clsx(
                                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                                selectedFilter === 'home'
                                    ? "bg-primary-red text-white"
                                    : "text-gray-600 hover:bg-gray-50 bg-transparent"
                            )}
                        >
                            Home
                        </button>
                        <button
                            onClick={() => setSelectedFilter('away')}
                            className={clsx(
                                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                                selectedFilter === 'away'
                                    ? "bg-primary-red text-white"
                                    : "text-gray-600 hover:bg-gray-50 bg-transparent"
                            )}
                        >
                            Away
                        </button>
                    </div>
                </div>

                {loading && matches.length === 0 ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 text-primary-red animate-spin" />
                    </div>
                ) : displayMatches.length > 0 ? (
                    <>
                        {/* Reuse MatchList - it displays matches nicely */}
                        <MatchList matches={displayMatches} isFixture={true} />

                        {hasMore && (
                            <div className="mt-8 text-center">
                                <button
                                    onClick={loadMore}
                                    disabled={fetchingMatches}
                                    className="px-6 py-2 bg-white border border-gray-200 text-dark-navy font-semibold rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    {fetchingMatches ? "Loading..." : "Load More Fixtures"}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No upcoming fixtures</h3>
                        <p className="text-gray-500 mt-1 max-w-sm mx-auto">
                            We couldn't find any upcoming matches for the selected criteria.
                        </p>
                        <button
                            onClick={() => setSelectedFilter('all')}
                            className="mt-4 text-primary-red font-medium hover:underline"
                        >
                            View all fixtures
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}
