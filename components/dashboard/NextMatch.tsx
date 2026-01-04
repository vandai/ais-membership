"use client";

import { Card } from "@/components/ui/Card";
import { Clock } from "lucide-react";

export function NextMatch() {
    return (
        <Card className="flex flex-col items-center text-center">
            <h3 className="font-bold text-dark-navy mb-4 w-full border-b border-gray-100 pb-2">Next Match</h3>

            <div className="flex items-center justify-between w-full mb-6">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-primary-red rounded-full flex items-center justify-center text-white font-bold text-xs mb-2">
                        ARS
                    </div>
                    <span className="font-bold text-sm">Arsenal</span>
                </div>

                <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-400 font-bold mb-1">VS</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">Premier League</span>
                </div>

                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-[#132257] rounded-full flex items-center justify-center text-white font-bold text-xs mb-2">
                        TOT
                    </div>
                    <span className="font-bold text-sm">Tottenham</span>
                </div>
            </div>

            <div className="bg-bg-grey rounded-lg p-3 w-full">
                <div className="flex items-center justify-center gap-2 text-primary-red font-bold text-xl font-mono">
                    <span>06</span>:<span>05</span>:<span>05</span>
                </div>
                <div className="flex items-center justify-center gap-1 text-[10px] text-gray-500 mt-1 uppercase tracking-wider">
                    <Clock className="w-3 h-3" /> Countdown
                </div>
            </div>

            <button className="w-full mt-4 bg-primary-red text-white py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition">
                Match Centre
            </button>
        </Card>
    );
}
