"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { clsx } from 'clsx';
import { twMerge } from "tailwind-merge";
import * as api from "@/lib/api";

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            await api.forgotPassword(email);
            setIsSent(true);
        } catch (error: any) {
            if (error.errors) {
                setErrors(error.errors);
            } else {
                setErrors({ general: [error.message || "An unexpected error occurred"] });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-8 shadow-xl border-t-4 border-primary-red">
                <div className="text-center mb-8">
                    <div className="w-full relative mb-2 px-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/images/logo-ais-min.png"
                            alt="Arsenal Indonesia Supporter"
                            className="w-full h-auto object-contain"
                        />
                    </div>
                    <Link
                        href="/login"
                        className="inline-flex items-center text-slate-500 hover:text-dark-navy transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Login
                    </Link>
                    <h1 className="text-2xl font-bold text-dark-navy">Forgot Password?</h1>
                    <p className="text-slate-500 mt-2">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                {isSent ? (
                    <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <Send className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-dark-navy">Check your inbox</h3>
                            <p className="text-slate-500 mt-2">
                                We have sent a password reset link to <br />
                                <span className="font-semibold text-dark-navy">{email}</span>
                            </p>
                        </div>
                        <button
                            onClick={() => setIsSent(false)}
                            className="text-primary-red font-medium hover:text-red-700"
                        >
                            Try another email
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {errors.general && (
                            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                                {errors.general[0]}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={cn(
                                        "w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all",
                                        errors.email
                                            ? "border-red-500 focus:ring-red-200 focus:border-red-500"
                                            : "border-slate-200 focus:ring-primary-red/20 focus:border-primary-red"
                                    )}
                                    placeholder="name@example.com"
                                />
                            </div>
                            {errors.email && <p className="text-sm text-red-500">{errors.email[0]}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={cn(
                                "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white shadow-lg transition-all",
                                isLoading
                                    ? "bg-slate-400 cursor-not-allowed"
                                    : "bg-primary-red hover:bg-red-700 active:scale-95"
                            )}
                        >
                            {isLoading ? "Sending Link..." : "Send Reset Link"}
                        </button>
                    </form>
                )}
            </Card>
        </div>
    );
}
