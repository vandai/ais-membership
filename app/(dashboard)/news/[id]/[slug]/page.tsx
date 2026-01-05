"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import * as api from "@/lib/api";
import { NewsItem } from "@/types/news";
import { useToast } from "@/context/ToastContext";
import { getImageUrl } from "@/lib/utils";

export default function NewsDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { showToast } = useToast();
    const [news, setNews] = useState<NewsItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchNewsDetail(params.id as string);
        }
    }, [params.id]);

    const fetchNewsDetail = async (id: string) => {
        setLoading(true);
        try {
            const response = await api.getNewsById(id);
            console.log("DEBUG: News Data", response.data);
            setNews(response.data);
        } catch (error: any) {
            console.error("Failed to fetch news detail:", error);
            showToast("Failed to load news article.", "error");
            if (error.status === 404) {
                router.push("/news");
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4 animate-pulse">
                <div className="h-8 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div className="h-64 bg-slate-200 rounded-2xl mb-8"></div>
                <div className="space-y-4">
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                </div>
            </div>
        );
    }

    if (!news) return null;

    return (
        <article className="max-w-4xl mx-auto pb-20">
            <Link
                href="/news"
                className="inline-flex items-center text-slate-500 hover:text-primary-red transition-colors mb-8 group"
            >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to News
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12"
            >
                <div className="mb-6">
                    {news.categories && news.categories.length > 0 && (
                        <div className="flex gap-2 mb-4">
                            {news.categories.map((cat) => (
                                <span key={cat.id} className="bg-red-50 text-primary-red px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                    <Tag className="w-3 h-3" />
                                    {cat.name}
                                </span>
                            ))}
                        </div>
                    )}
                    <h1 className="text-3xl md:text-4xl font-bold text-dark-navy leading-tight mb-6">
                        {news.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-slate-500 border-b border-slate-100 pb-8 mb-8">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatDate(news.created_at)}
                        </div>
                        {news.author && (
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                {news.author.name}
                            </div>
                        )}
                    </div>
                </div>

                <div className="rounded-xl overflow-hidden mb-10 shadow-md">
                    <img
                        src={getImageUrl(news.image)}
                        alt={news.title}
                        className="w-full h-auto object-cover max-h-[500px]"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "/images/placeholder.png";
                        }}
                    />
                </div>

                <div
                    className="max-w-none text-slate-600 leading-relaxed
                    [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-dark-navy [&>h2]:mb-4 [&>h2]:mt-8
                    [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-dark-navy [&>h3]:mb-3 [&>h3]:mt-6
                    [&>p]:mb-6
                    [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-6
                    [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-6
                    [&>li]:mb-2
                    [&>a]:text-primary-red [&>a]:font-medium hover:[&>a]:underline
                    [&>img]:rounded-xl [&>img]:my-8 [&>img]:w-full"
                    dangerouslySetInnerHTML={{ __html: news.contents }}
                />
            </motion.div>
        </article>
    );
}
