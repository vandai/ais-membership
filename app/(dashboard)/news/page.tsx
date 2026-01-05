"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, Calendar, ChevronLeft, ChevronRight, Newspaper } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import * as api from "@/lib/api";
import { NewsItem, Category, Meta } from "@/types/news";
import { useToast } from "@/context/ToastContext";
import { getImageUrl } from "@/lib/utils";

export default function NewsPage() {
    const { showToast } = useToast();
    const [news, setNews] = useState<NewsItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [loading, setLoading] = useState(true);

    // Filters
    const [keyword, setKeyword] = useState("");
    const [categoryId, setCategoryId] = useState<string>("");
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState("latest"); // 'latest' | 'oldest' - API doc implies default is latest, we can handle sort logic or assume API default

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchNews();
        }, 300); // Debounce search

        return () => clearTimeout(timer);
    }, [keyword, categoryId, page]);

    const fetchCategories = async () => {
        try {
            const response = await api.getCategories();
            setCategories(response.data);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    const fetchNews = async () => {
        setLoading(true);
        try {
            const params = {
                keyword: keyword,
                category_id: categoryId,
                page: page,
                per_page: 9,
                // Add sort if API supports it, for now we will assume API sorts by Latest.
                // If client-side sort is needed, we'd do it here, but pagination makes that tricky.
            };
            const response = await api.searchNews(params);

            let fetchedNews = response.data;

            // Client-side sorting if API doesn't support 'sort' param explicitly in search
            // (Docs mention search is by keyword/date/category, list is sorted by latest)
            if (sort === 'oldest') {
                fetchedNews = [...fetchedNews].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
            } else {
                fetchedNews = [...fetchedNews].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            }

            setNews(fetchedNews);
            setMeta(response.meta);
        } catch (error) {
            console.error("Failed to fetch news:", error);
            showToast("Failed to load news articles.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && meta && newPage <= meta.last_page) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-dark-navy">News & Updates</h1>
                    <p className="text-slate-500 mt-2">Latest updates from Arsenal Indonesia Supporters</p>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search news..."
                        value={keyword}
                        onChange={(e) => {
                            setKeyword(e.target.value);
                            setPage(1); // Reset to page 1 on search
                        }}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red"
                    />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative w-1/2 md:w-48">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                            value={categoryId}
                            onChange={(e) => {
                                setCategoryId(e.target.value);
                                setPage(1);
                            }}
                            className="w-full pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red appearance-none"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="relative w-1/2 md:w-48">
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red appearance-none"
                        >
                            <option value="latest">Latest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* News Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-4 shadow-sm h-80 animate-pulse">
                            <div className="bg-slate-200 h-40 rounded-xl mb-4"></div>
                            <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            ) : news.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                    <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-dark-navy">No news found</h3>
                    <p className="text-slate-500">Try adjusting your search or filters</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full"
                        >
                            <Link href={`/news/${item.id}/${item.slug}`} className="block h-48 overflow-hidden relative bg-slate-100">
                                <img
                                    src={getImageUrl(item.image)}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/images/placeholder.png";
                                    }}
                                />
                                {item.categories && item.categories.length > 0 && (
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary-red shadow-sm">
                                        {item.categories[0].name}
                                    </div>
                                )}
                            </Link>
                            <div className="p-5 flex flex-col flex-1">
                                <Link href={`/news/${item.id}/${item.slug}`} className="block">
                                    <h3 className="font-bold text-lg text-dark-navy mb-2 line-clamp-2 hover:text-primary-red transition-colors">
                                        {item.title}
                                    </h3>
                                </Link>
                                <div className="text-slate-500 text-sm mb-4 line-clamp-3 flex-1">
                                    {item.excerpt}
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-400 mt-auto">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {formatDate(item.created_at)}
                                    </div>
                                    <span>{item.author?.name}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {meta && meta.last_page > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <span className="text-sm font-medium text-slate-600">
                        Page {meta.current_page} of {meta.last_page}
                    </span>
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === meta.last_page}
                        className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 text-slate-600" />
                    </button>
                </div>
            )}
        </div>
    );
}
