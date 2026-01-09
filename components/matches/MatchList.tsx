import Link from "next/link";
import { Match } from "@/types/football";
import { Card } from "@/components/ui/Card";
import { Calendar, MapPin } from "lucide-react";

interface MatchListProps {
    matches: Match[];
    isFixture?: boolean;
}

export default function MatchList({ matches, isFixture = false }: MatchListProps) {
    if (matches.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => {
                const Content = (
                    <Card className="h-full hover:shadow-lg transition-all duration-300 border-gray-100 group-hover:border-primary-red/20 overflow-hidden">
                        <div className="p-6">
                            <div className={`flex items-center mb-6 text-xs font-semibold text-gray-400 uppercase tracking-wider ${isFixture ? 'justify-center' : 'justify-between'}`}>
                                <span className="bg-gray-50 px-2 py-1 rounded">{match.league.name}</span>
                                {!isFixture && (
                                    <span className={
                                        match.arsenal?.result === 'W' ? 'text-green-600' :
                                            match.arsenal?.result === 'D' ? 'text-gray-600' : 'text-red-600'
                                    }>
                                        {match.arsenal?.result === 'W' ? 'Win' :
                                            match.arsenal?.result === 'D' ? 'Draw' : 'Loss'}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center justify-between mb-8">
                                <div className="flex flex-col items-center gap-3 w-1/3">
                                    <div className="w-12 h-12 relative p-2 bg-gray-50 rounded-full">
                                        <img src={match.home.logo} alt={match.home.name} className="w-full h-full object-contain" />
                                    </div>
                                    <span className="text-sm font-bold text-center leading-tight">{match.home.name}</span>
                                </div>

                                <div className="flex flex-col items-center">
                                    <div className="text-3xl font-black text-dark-navy tracking-tighter">
                                        {match.score?.display}
                                    </div>
                                    <span className="text-xs text-gray-400 font-bold mt-1">FT</span>
                                </div>

                                <div className="flex flex-col items-center gap-3 w-1/3">
                                    <div className="w-12 h-12 relative p-2 bg-gray-50 rounded-full">
                                        <img src={match.away.logo} alt={match.away.name} className="w-full h-full object-contain" />
                                    </div>
                                    <span className="text-sm font-bold text-center leading-tight">{match.away.name}</span>
                                </div>
                            </div>

                            <div className={`pt-4 border-t border-gray-100 ${isFixture ? 'flex flex-col items-center gap-2 text-center' : 'flex items-center justify-between'} text-xs text-gray-500`}>
                                <div className={`flex items-center gap-1.5 ${isFixture ? 'text-sm font-bold text-dark-navy' : ''}`}>
                                    <Calendar className="w-3.5 h-3.5" />
                                    {isFixture ? (
                                        new Date(match.date).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                                    ) : (
                                        new Date(match.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                                    )}
                                </div>
                                <div className={`flex items-center gap-1.5 ${isFixture ? '' : 'max-w-[50%] text-right truncate'}`}>
                                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span className={isFixture ? "" : "truncate"}>
                                        {isFixture ? `${match.venue.name}, ${match.venue.city}` : match.venue.city}
                                    </span>
                                </div>
                            </div>

                            {!isFixture && (
                                <div className="mt-4 pt-4 border-t border-gray-50 text-center text-xs font-bold text-primary-red opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                    View Match Report →
                                </div>
                            )}
                        </div>
                    </Card>
                );

                if (isFixture) {
                    return (
                        <div key={match.id} className="group cursor-default">
                            {Content}
                        </div>
                    );
                }

                return (
                    <Link href={`/matches/${match.id}`} key={match.id} className="group">
                        {Content}
                    </Link>
                );
            })}
        </div>
    );
}
