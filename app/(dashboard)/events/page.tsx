"use client";

import { useEffect, useState, useCallback } from "react";
import * as api from "@/lib/api";
import { Event, EventCategory } from "@/types/event";
import EventList from "@/components/events/EventList";
import CategoryFilter from "@/components/events/CategoryFilter";
import { Loader2, CalendarDays } from "lucide-react";

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [categories, setCategories] = useState<EventCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [fetchingEvents, setFetchingEvents] = useState(false);

    // Fetch categories
    useEffect(() => {
        async function loadCategories() {
            try {
                const response = await api.getEventCategories();
                if (response.data) {
                    setCategories(response.data);
                }
            } catch (error) {
                console.error("Failed to load categories", error);
            }
        }
        loadCategories();
    }, []);

    // Fetch events
    const fetchEvents = useCallback(async (pageNum: number, categoryId: number | null, reset = false) => {
        if (fetchingEvents) return;
        setFetchingEvents(true);

        try {
            const response = await api.getEvents(pageNum, 9, categoryId);

            if (response.data) {
                if (reset) {
                    setEvents(response.data);
                } else {
                    setEvents((prev) => [...prev, ...response.data]);
                }
                setHasMore(response.meta?.current_page < response.meta?.last_page);
            }
        } catch (error) {
            console.error("Failed to fetch events", error);
        } finally {
            setLoading(false);
            setFetchingEvents(false);
        }
    }, [fetchingEvents]);

    // Initial load and filter change
    useEffect(() => {
        setPage(1);
        setLoading(true);
        fetchEvents(1, selectedCategory, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategory]);

    const loadMore = () => {
        if (!fetchingEvents && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchEvents(nextPage, selectedCategory);
        }
    };

    const handleCategorySelect = (id: number | null) => {
        if (id === selectedCategory) return;
        setSelectedCategory(id);
    };

    return (
        <div className="space-y-8">
            <section id="events">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-dark-navy flex items-center gap-2 mb-6">
                        <CalendarDays className="w-6 h-6 text-primary-red" />
                        Club Events
                    </h2>

                    <CategoryFilter
                        categories={categories}
                        selectedId={selectedCategory}
                        onSelect={handleCategorySelect}
                    />
                </div>

                {loading && events.length === 0 ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 text-primary-red animate-spin" />
                    </div>
                ) : events.length > 0 ? (
                    <>
                        <EventList events={events} />

                        {hasMore && (
                            <div className="mt-8 text-center">
                                <button
                                    onClick={loadMore}
                                    disabled={fetchingEvents}
                                    className="px-6 py-2 bg-white border border-gray-200 text-dark-navy font-semibold rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    {fetchingEvents ? "Loading..." : "Load More Events"}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CalendarDays className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No events found</h3>
                        <p className="text-gray-500 mt-1 max-w-sm mx-auto">
                            We couldn't find any events matching your selection.
                        </p>
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className="mt-4 text-primary-red font-medium hover:underline"
                        >
                            View all events
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}
