import { Event } from "@/types/event";
import Link from "next/link";
import { Calendar, MapPin, Tag, Lock, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import clsx from "clsx";

interface EventCardProps {
    event: Event;
}

export default function EventCard({ event }: EventCardProps) {
    const startDate = new Date(event.start_datetime);
    const day = startDate.getDate();
    const month = startDate.toLocaleDateString('en-GB', { month: 'short' });
    const time = startDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const isMemberOnly = event.member_only;

    // Fee formatting
    const feeAmount = parseFloat(event.fee);
    const isFree = feeAmount === 0;
    const formattedFee = isFree
        ? "Free"
        : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(feeAmount);

    return (
        <Link href={`/events/${event.id}`} className="group h-full block">
            <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-gray-100 group-hover:border-primary-red/20 flex flex-col relative">
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    {event.image_url ? (
                        <img
                            src={event.image_url}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center text-gray-400 p-6 text-center">
                            <span className="text-4xl font-bold opacity-10 mb-2">EVENT</span>
                            <span className="text-xs uppercase tracking-widest opacity-50 font-semibold">{event.category?.name}</span>
                        </div>
                    )}

                    {/* Date Badge */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden flex flex-col items-center min-w-[3.5rem] border border-gray-100">
                        <div className="bg-primary-red text-white text-[10px] font-bold uppercase py-0.5 w-full text-center tracking-wider px-1">
                            {month}
                        </div>
                        <div className="text-xl font-bold text-dark-navy py-1">
                            {day}
                        </div>
                    </div>

                    {/* Member Only Badge */}
                    {isMemberOnly && (
                        <div className="absolute top-4 right-4 bg-dark-navy/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Member Only
                        </div>
                    )}
                </div>

                <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary-red bg-primary-red/5 px-2 py-0.5 rounded-full">
                            {event.category?.name}
                        </span>
                        <span className={clsx("text-xs font-bold", isFree ? "text-green-600" : "text-gray-600")}>
                            {formattedFee}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold text-dark-navy mb-2 line-clamp-2 leading-tight group-hover:text-primary-red transition-colors">
                        {event.title}
                    </h3>

                    <div className="flex flex-col gap-2 mt-auto text-sm text-gray-500">
                        <div className="flex items-start gap-2">
                            <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gray-400" />
                            <span className="line-clamp-1">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                            <span>{time} WIB</span>
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
