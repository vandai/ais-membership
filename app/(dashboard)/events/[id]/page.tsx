"use client";

import { useEffect, useState } from "react";
import * as api from "@/lib/api";
import { Event } from "@/types/event";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag, MapPin, Clock, Lock } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";
import clsx from "clsx";

export default function EventDetailPage() {
    const params = useParams();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!params.id) return;
            try {
                const res = await api.getEventById(String(params.id));
                if (res.data) {
                    setEvent(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch event detail", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [params.id]);

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse max-w-4xl mx-auto">
                <div className="h-4 w-24 bg-slate-200 rounded"></div>
                <div className="h-64 bg-slate-200 rounded-2xl"></div>
                <div className="h-8 w-3/4 bg-slate-200 rounded"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded"></div>
                    <div className="h-4 bg-slate-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <h2 className="text-xl font-bold text-gray-700">Event not found</h2>
                <Link href="/events" className="mt-4 text-primary-red hover:underline">
                    Back to Events
                </Link>
            </div>
        );
    }

    const startDate = new Date(event.start_datetime);
    const endDate = new Date(event.end_datetime);

    const formattedDate = startDate.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const startTime = startDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const endTime = endDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    // Fee formatting
    const feeAmount = parseFloat(event.fee);
    const isFree = feeAmount === 0;
    const formattedFee = isFree
        ? "Free"
        : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(feeAmount);

    return (
        <div className="max-w-4xl mx-auto">
            <Link
                href="/events"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-dark-navy transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Events
            </Link>

            <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="relative h-64 md:h-96 w-full bg-gray-100">
                    {event.image_url ? (
                        <img
                            src={event.image_url}
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center text-gray-400">
                            <span className="text-6xl font-bold opacity-10">EVENT</span>
                        </div>
                    )}

                    {event.member_only && (
                        <div className="absolute top-6 right-6 bg-dark-navy/90 backdrop-blur-sm text-white text-sm font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-2">
                            <Lock className="w-4 h-4" /> Member Only Event
                        </div>
                    )}
                </div>

                <div className="p-8 md:p-12">
                    <div className="flex flex-wrap gap-3 mb-8">
                        <span className="bg-primary-red/10 text-primary-red py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 self-start">
                            <Tag className="w-3 h-3" /> {event.category.name}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold text-dark-navy mb-8 leading-tight">
                        {event.title}
                    </h1>

                    {/* Event Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100 mb-10">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-primary-red flex-shrink-0">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-dark-navy text-sm uppercase tracking-wide mb-1">Date & Time</h3>
                                <p className="text-gray-700 font-medium">{formattedDate}</p>
                                <div className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {startTime} - {endTime} WIB
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-primary-red flex-shrink-0">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-dark-navy text-sm uppercase tracking-wide mb-1">Location</h3>
                                <p className="text-gray-700 font-medium">{event.location}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-primary-red flex-shrink-0">
                                <Tag className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-dark-navy text-sm uppercase tracking-wide mb-1">Entry Fee</h3>
                                <p className={clsx("font-bold text-lg", isFree ? "text-green-600" : "text-dark-navy")}>
                                    {formattedFee}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-primary-red flex-shrink-0">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-dark-navy text-sm uppercase tracking-wide mb-1">Organizer</h3>
                                <p className="text-gray-700 font-medium">{event.author.name}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-dark-navy mb-4 border-b border-gray-100 pb-2">Description</h3>
                        <div
                            className="prose prose-lg max-w-none text-gray-600 prose-headings:text-dark-navy prose-a:text-primary-red"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(event.description || "") }}
                        />
                    </div>
                </div>
            </article>
        </div>
    );
}
