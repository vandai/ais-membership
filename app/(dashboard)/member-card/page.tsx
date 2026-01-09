"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MemberCard } from "@/components/member/MemberCard";

export default function MemberCardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user || !user.member_number || user.role?.includes('guest')) {
                router.push('/');
            }
        }
    }, [user, loading, router]);


    if (loading) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    if (!user || !user.member_number || user.role?.includes('guest')) {
        return null;
    }


    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="mb-8 text-center md:text-left">
                <h1 className="text-3xl font-bold text-dark-navy mb-2">Digital Member Card</h1>
                <p className="text-gray-600">Access the stadium and redeem rewards with your digital ID.</p>
            </div>

            <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl p-8 shadow-sm">
                <MemberCard />
                <div className="mt-8 text-center text-sm text-gray-400">
                    <p>Tap the card to view the QR code.</p>
                    <p className="mt-2">Screen brightness will increase automatically when scanning.</p>
                </div>
            </div>
        </div>
    );
}
