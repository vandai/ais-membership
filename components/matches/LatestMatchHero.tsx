import { Match } from "@/types/football";
import { Trophy, Calendar, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

interface LatestMatchHeroProps {
    match: Match;
}

export function LatestMatchHero({ match }: LatestMatchHeroProps) {
    return (
        <div className="w-full bg-gradient-to-br from-[#0C1222] to-[#1A2540] rounded-2xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden mb-8 group">
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

                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-sm text-gray-300 mb-8">
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

                <Link
                    href={`/matches/${match.id}`}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-red hover:bg-red-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-red-900/20"
                >
                    View Match Report <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
