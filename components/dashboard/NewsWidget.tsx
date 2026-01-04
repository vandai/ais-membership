"use client";

import { Card } from "@/components/ui/Card";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const newsItems = [
    {
        id: 1,
        title: "Exclusive Interview with the Captain",
        category: "Team News",
        image: "https://placehold.co/600x400/DC0404/FFFFFF/png?text=Captain+Interview", // Placeholder
    },
    {
        id: 2,
        title: "Arsenal vs Tottenham: Match Preview",
        category: "Match Preview",
        image: "https://placehold.co/600x400/061922/FFFFFF/png?text=Match+Preview", // Placeholder
    },
    {
        id: 3,
        title: "New Training Kit Released",
        category: "Merch",
        image: "https://placehold.co/600x400/DBA111/FFFFFF/png?text=New+Kit", // Placeholder
    },
];

export function NewsWidget() {
    return (
        <Card className="col-span-1 md:col-span-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-dark-navy">Latest News</h3>
                <button className="text-primary-red text-sm font-semibold flex items-center hover:underline">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {newsItems.map((item) => (
                    <div key={item.id} className="group cursor-pointer">
                        <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-3 shadow-sm">
                            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                            {/* In a real app, use next/image with real src */}
                            <img
                                src={item.image}
                                alt={item.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute top-2 left-2 bg-primary-red text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow-sm">
                                {item.category}
                            </div>
                        </div>
                        <h4 className="font-bold text-base leading-snug text-dark-navy group-hover:text-primary-red transition-colors line-clamp-2">
                            {item.title}
                        </h4>
                    </div>
                ))}
            </div>
        </Card>
    );
}
