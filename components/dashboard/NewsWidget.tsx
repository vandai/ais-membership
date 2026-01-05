"use client";

import { Card } from "@/components/ui/Card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import * as api from "@/lib/api";
import { NewsItem } from "@/types/news";
import { getImageUrl } from "@/lib/utils";

export function NewsWidget() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                // Fetch page 1, 3 items per page
                const response = await api.getNews(1, 3);
                setNews(response.data);
            } catch (error) {
                console.error("Failed to fetch dashboard news", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    return (
        <Card className="col-span-1 md:col-span-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-dark-navy">Latest News</h3>
                <Link href="/news" className="text-primary-red text-sm font-semibold flex items-center hover:underline">
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
                    news.map((item) => (
                        <Link key={item.id} href={`/news/${item.id}/${item.slug}`} className="group cursor-pointer block">
                            <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-3 shadow-sm bg-slate-100">
                                <img
                                    src={getImageUrl(item.image)}
                                    alt={item.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/images/placeholder.png";
                                    }}
                                />
                                {item.categories && item.categories.length > 0 && (
                                    <div className="absolute top-2 left-2 bg-primary-red text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow-sm">
                                        {item.categories[0].name}
                                    </div>
                                )}
                            </div>
                            <h4 className="font-bold text-base leading-snug text-dark-navy group-hover:text-primary-red transition-colors line-clamp-2">
                                {item.title}
                            </h4>
                        </Link>
                    ))
                )}
            </div>
        </Card>
    );
}
