"use client";

import { Card } from "@/components/ui/Card";

export function LatestMatchResult() {
    return (
        <Card className="flex flex-col items-center text-center h-full">
            <h3 className="font-bold text-dark-navy mb-4 w-full border-b border-gray-100 pb-2">Latest Result</h3>

            <div className="flex items-center justify-between w-full mb-4">
                <div className="flex flex-col items-center flex-1">
                    <div className="w-12 h-12 bg-primary-red rounded-full flex items-center justify-center text-white font-bold text-xs mb-2">
                        ARS
                    </div>
                    <span className="font-bold text-sm">Arsenal</span>
                </div>

                <div className="flex flex-col items-center px-2">
                    <div className="text-3xl font-bold text-dark-navy font-mono bg-gray-100 px-4 py-1 rounded-lg">
                        3 - 1
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">FT</span>
                </div>

                <div className="flex flex-col items-center flex-1">
                    <div className="w-12 h-12 bg-[#034694] rounded-full flex items-center justify-center text-white font-bold text-xs mb-2">
                        CHE
                    </div>
                    <span className="font-bold text-sm">Chelsea</span>
                </div>
            </div>

            <div className="bg-bg-grey rounded-lg p-3 w-full text-left text-xs space-y-2 mt-auto">
                <div className="flex gap-2">
                    <span className="font-bold text-primary-red">⚽</span>
                    <span>Saka (12'), Martinelli (45'), Ødegaard (52')</span>
                </div>
                <div className="flex gap-2 opacity-60">
                    <span className="font-bold">⚽</span>
                    <span>Palmer (78')</span>
                </div>
            </div>

            <button className="w-full mt-4 bg-dark-navy text-white py-2 rounded-lg text-sm font-bold hover:bg-black transition">
                Match Report
            </button>
        </Card>
    );
}
