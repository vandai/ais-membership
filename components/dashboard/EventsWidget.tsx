"use client";

import { Card } from "@/components/ui/Card";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import * as api from "@/lib/api";
import { Event } from "@/types/event";
import clsx from "clsx";

export function EventsWidget() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Fetch page 1, 3 items per page
                const response = await api.getEvents(1, 3);
                setEvents(response.data);
            } catch (error) {
                console.error("Failed to fetch dashboard events", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // Helper for fee display
    const formatFee = (feeString: string) => {
        const fee = parseFloat(feeString);
        if (fee === 0) return "Free";
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(fee);
    };

    return (
        <Card className="col-span-1 md:col-span-full mt-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-dark-navy">Upcoming Events</h3>
                <Link href="/events" className="text-primary-red text-sm font-semibold flex items-center hover:underline">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {loading ? (
                    // Loading Skeletons
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-slate-200 aspect-video rounded-lg mb-3"></div>
                            <div className="bg-slate-200 h-4 w-3/4 rounded mb-2"></div>
                            <div className="bg-slate-200 h-4 w-1/2 rounded"></div>
                        </div>
                    ))
                ) : (
                    events.map((event) => {
                        const startDate = new Date(event.start_datetime);
                        const day = startDate.getDate();
                        const month = startDate.toLocaleDateString('en-GB', { month: 'short' });

                        return (
                            <Link key={event.id} href={`/events/${event.id}`} className="group cursor-pointer block">
                                <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-3 shadow-sm bg-slate-100">
                                    {event.image_url ? (
                                        <img
                                            src={event.image_url}
                                            alt={event.title}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center text-gray-400">
                                            <span className="text-2xl font-bold opacity-10">EVENT</span>
                                        </div>
                                    )}

                                    {/* Date Badge */}
                                    <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-sm overflow-hidden flex flex-col items-center min-w-[2.5rem] border border-gray-100">
                                        <div className="bg-primary-red text-white text-[9px] font-bold uppercase py-0.5 w-full text-center tracking-wider px-1">
                                            {month}
                                        </div>
                                        <div className="text-sm font-bold text-dark-navy py-0.5">
                                            {day}
                                        </div>
                                    </div>

                                    {/* Fee Badge */}
                                    <div className={clsx(
                                        "absolute bottom-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm",
                                        parseFloat(event.fee) === 0 ? "bg-green-500 text-white" : "bg-white text-dark-navy"
                                    )}>
                                        {formatFee(event.fee)}
                                    </div>
                                </div>
                                <h4 className="font-bold text-base leading-snug text-dark-navy group-hover:text-primary-red transition-colors line-clamp-2 mb-1">
                                    {event.title}
                                </h4>
                                <div className="flex items-center text-xs text-gray-500">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    <span className="truncate">{event.location}</span>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
        </Card>
    );
}
