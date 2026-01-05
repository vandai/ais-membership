"use client";

import { useEffect, useState } from "react";
import * as api from "@/lib/api";
import { Match, MatchEvent, Lineup, TeamStatistics, MatchReportResponse } from "@/types/football";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, Calendar, MapPin, Trophy, LayoutList, Activity, Users } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

export default function MatchDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [report, setReport] = useState<MatchReportResponse['data'] | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'lineups' | 'stats'>('overview');

    // Helper to extract goal scorers
    const getGoalScorers = (teamId: number) => {
        if (!report || !report.events) return [];
        return report.events
            .filter(e => e.type === 'Goal' && e.team.id === teamId)
            .map(e => {
                const isPen = e.detail === 'Penalty';
                return {
                    id: e.player.id,
                    name: e.player.name,
                    time: `${e.time.elapsed}${e.time.extra ? '+' + e.time.extra : ''}'`,
                    isPen
                };
            });
    };

    useEffect(() => {
        const fetchMatch = async () => {
            if (!params.id) return;
            try {
                // Try new report endpoint
                const response = await api.getMatchReport(String(params.id));
                if (response.data) {
                    setReport(response.data);
                } else {
                    // Fallback to basic match details if report fails or is waiting for implementation
                    const basicMatch = await api.getMatchById(String(params.id));
                    if (basicMatch.data) {
                        setReport({
                            match: basicMatch.data,
                            events: [],
                            lineups: [],
                            statistics: []
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to fetch match", error);

                // Final fallback trial
                try {
                    const basicMatch = await api.getMatchById(String(params.id));
                    if (basicMatch.data) {
                        setReport({
                            match: basicMatch.data,
                            events: [],
                            lineups: [],
                            statistics: []
                        });
                    }
                } catch (e) {
                    // Truly failed
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMatch();
    }, [params.id]);

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-4 w-24 bg-slate-200 rounded"></div>
                <div className="h-64 bg-slate-200 rounded-2xl"></div>
                <div className="h-32 bg-slate-200 rounded-2xl"></div>
            </div>
        );
    }

    if (!report || !report.match) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <h2 className="text-xl font-bold text-gray-700">Match not found</h2>
                <Link href="/matches" className="mt-4 text-primary-red hover:underline">
                    Back to Matches
                </Link>
            </div>
        );
    }

    const { match, events, lineups, statistics } = report;

    const homeScorers = getGoalScorers(match.home.id);
    const awayScorers = getGoalScorers(match.away.id);

    return (
        <div className="space-y-6">
            <Link
                href="/matches"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-dark-navy transition-colors mb-4"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Matches
            </Link>

            {/* Match Header */}
            <div className="w-full bg-gradient-to-br from-[#0C1222] to-[#1A2540] rounded-2xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-8 bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm">
                        <Trophy className="w-4 h-4 text-primary-red" />
                        <span className="text-sm font-bold tracking-wide uppercase">{match.league.name}</span>
                        {match.league.round && <span className="text-xs text-gray-300 border-l border-white/20 pl-2 ml-1">{match.league.round}</span>}
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20 w-full mb-8">
                        {/* Home Team */}
                        <div className="flex flex-col items-center gap-4 w-1/3">
                            <div className="w-20 h-20 md:w-32 md:h-32 bg-white/5 rounded-full p-4 backdrop-blur-sm border border-white/10 shadow-lg">
                                <img src={match.home.logo} alt={match.home.name} className="w-full h-full object-contain" />
                            </div>
                            <h3 className="text-xl md:text-3xl font-bold tracking-tight text-center">{match.home.name}</h3>
                        </div>

                        {/* Score */}
                        <div className="flex flex-col items-center z-10">
                            <div className="text-5xl md:text-7xl font-black font-mono tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                                {match.score?.display || "VS"}
                            </div>
                            {match.status?.short === 'FT' || match.score?.display ? (
                                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2 bg-black/20 px-2 py-0.5 rounded">
                                    Full Time
                                </span>
                            ) : (
                                <div className="text-xs text-primary-red font-bold uppercase tracking-widest mt-2 bg-primary-red/10 px-2 py-0.5 rounded animate-pulse">
                                    {match.status?.long || "Upcoming"}
                                </div>
                            )}
                        </div>

                        {/* Away Team */}
                        <div className="flex flex-col items-center gap-4 w-1/3">
                            <div className="w-20 h-20 md:w-32 md:h-32 bg-white/5 rounded-full p-4 backdrop-blur-sm border border-white/10 shadow-lg">
                                <img src={match.away.logo} alt={match.away.name} className="w-full h-full object-contain" />
                            </div>
                            <h3 className="text-xl md:text-3xl font-bold tracking-tight text-center">{match.away.name}</h3>
                        </div>
                    </div>

                    {/* Goal Scorers */}
                    {(homeScorers.length > 0 || awayScorers.length > 0) && (
                        <div className="flex justify-center w-full max-w-2xl mb-8 text-sm text-gray-300">
                            <div className="w-1/2 text-right pr-12 border-r border-white/10 space-y-1">
                                {homeScorers.map((scorer, idx) => (
                                    <div key={idx}>
                                        <span className="font-medium text-white">{scorer.name}</span> <span className="text-gray-400 text-xs">{scorer.time}{scorer.isPen && ' (P)'}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="w-1/2 pl-12 space-y-1">
                                {awayScorers.map((scorer, idx) => (
                                    <div key={idx}>
                                        <span className="font-medium text-white">{scorer.name}</span> <span className="text-gray-400 text-xs">{scorer.time}{scorer.isPen && ' (P)'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-sm text-gray-300">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary-red" />
                            <span>{new Date(match.date).toLocaleDateString(undefined, {
                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}</span>
                        </div>
                        <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary-red" />
                            <span>{match.venue.name}, {match.venue.city}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={clsx(
                        "flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors",
                        activeTab === 'overview'
                            ? "border-primary-red text-primary-red"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                    )}
                >
                    <LayoutList className="w-4 h-4" /> Overview
                </button>
                <button
                    onClick={() => setActiveTab('stats')}
                    className={clsx(
                        "flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors",
                        activeTab === 'stats'
                            ? "border-primary-red text-primary-red"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                    )}
                >
                    <Activity className="w-4 h-4" /> Stats
                </button>
                <button
                    onClick={() => setActiveTab('lineups')}
                    className={clsx(
                        "flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors",
                        activeTab === 'lineups'
                            ? "border-primary-red text-primary-red"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                    )}
                >
                    <Users className="w-4 h-4" /> Lineups
                </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Match Events */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-dark-navy mb-6 flex items-center gap-2">
                                <LayoutList className="w-4 h-4 text-primary-red" /> Match Events
                            </h3>
                            {events && events.length > 0 ? (
                                <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                                    {events.map((event, i) => (
                                        <div key={i} className="relative pl-10 flex items-start group">
                                            <div className="absolute left-0 top-0 w-10 h-10 flex items-center justify-center">
                                                <div className="w-2.5 h-2.5 rounded-full bg-gray-300 ring-4 ring-white group-hover:bg-primary-red transition-colors"></div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-baseline gap-2 mb-1">
                                                    <span className="font-mono text-xs font-bold text-gray-400">
                                                        {event.time.elapsed}&apos;{event.time.extra ? `+${event.time.extra}` : ''}
                                                    </span>
                                                    <span className="font-bold text-sm text-dark-navy">{event.type}</span>
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    <span className="font-medium text-gray-900">{event.player.name}</span>
                                                    {event.detail && <span className="text-xs text-gray-400 ml-2">({event.detail})</span>}
                                                </div>
                                                {event.assist?.name && (
                                                    <div className="text-xs text-gray-400 mt-0.5">Assist: {event.assist.name}</div>
                                                )}
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 p-1 ml-4" title={event.team.name}>
                                                <img src={event.team.logo} alt={event.team.name} className="w-full h-full object-contain" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-400 py-10">No events available.</p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'stats' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-3xl mx-auto">
                        <h3 className="font-bold text-dark-navy mb-6 text-center">Team Statistics</h3>
                        {statistics && statistics.length === 2 ? (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-8 px-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 mb-2 p-1 bg-gray-50 rounded-full"><img src={statistics[0].team.logo} className="w-full h-full object-contain" /></div>
                                        <span className="font-bold text-sm">{statistics[0].team.name}</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 mb-2 p-1 bg-gray-50 rounded-full"><img src={statistics[1].team.logo} className="w-full h-full object-contain" /></div>
                                        <span className="font-bold text-sm">{statistics[1].team.name}</span>
                                    </div>
                                </div>
                                {[
                                    { key: 'ball_possession', label: 'Possession' },
                                    { key: 'total_shots', label: 'Total Shots' },
                                    { key: 'shots_on_goal', label: 'Shots on Target' },
                                    { key: 'corner_kicks', label: 'Corners' },
                                    { key: 'fouls', label: 'Fouls' },
                                    { key: 'total_passes', label: 'Passes' },
                                    { key: 'passes_accurate', label: 'Accurate Passes' },
                                ].map((stat) => {
                                    // Use type assertion or lookup logic based on API response structure
                                    const val1 = statistics[0].statistics[stat.key] || statistics[0].statistics[stat.label] || 0;
                                    const val2 = statistics[1].statistics[stat.key] || statistics[1].statistics[stat.label] || 0;

                                    // Parse if string (e.g., "50%")
                                    const num1 = typeof val1 === 'string' ? parseInt(val1.replace('%', '')) : Number(val1);
                                    const num2 = typeof val2 === 'string' ? parseInt(val2.replace('%', '')) : Number(val2);
                                    const total = num1 + num2 || 1;

                                    return (
                                        <div key={stat.label} className="space-y-1">
                                            <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wide">
                                                <span>{val1}</span>
                                                <span>{stat.label}</span>
                                                <span>{val2}</span>
                                            </div>
                                            <div className="flex h-2 rounded-full overflow-hidden bg-gray-100">
                                                <div className="bg-primary-red h-full" style={{ width: `${(num1 / total) * 100}%` }}></div>
                                                <div className="bg-dark-navy h-full" style={{ width: `${(num2 / total) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <p className="text-center text-gray-400 py-10">Detailed statistics not available.</p>
                        )}
                    </div>
                )}

                {activeTab === 'lineups' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {lineups && lineups.map((lineup, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                    <div className="w-10 h-10 p-1 bg-gray-50 rounded-full border border-gray-100">
                                        <img src={lineup.team.logo} alt={lineup.team.name} className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-dark-navy">{lineup.team.name}</h3>
                                        <p className="text-xs text-gray-500 font-mono">{lineup.formation}</p>
                                    </div>
                                    <div className="ml-auto text-right">
                                        <div className="text-xs text-gray-400">Coach</div>
                                        <div className="font-medium text-sm">{lineup.coach.name}</div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Starting XI</h4>
                                        <div className="space-y-2">
                                            {lineup.startXI.map(player => (
                                                <div key={player.id} className="flex items-center gap-3 text-sm">
                                                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-xs font-mono font-bold text-gray-600">
                                                        {player.number}
                                                    </span>
                                                    <span className="font-medium text-gray-700">{player.name}</span>
                                                    <span className="text-xs text-gray-400 ml-auto uppercase">{player.pos}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Substitutes</h4>
                                        <div className="space-y-2">
                                            {lineup.substitutes.map(player => (
                                                <div key={player.id} className="flex items-center gap-3 text-sm opacity-75 hover:opacity-100 transition-opacity">
                                                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-50 text-xs font-mono text-gray-500 border border-gray-100">
                                                        {player.number}
                                                    </span>
                                                    <span className="text-gray-600">{player.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {(!lineups || lineups.length === 0) && (
                            <p className="text-center text-gray-400 py-10 col-span-2">Lineup information not available.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
