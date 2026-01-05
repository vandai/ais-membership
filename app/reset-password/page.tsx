"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Lock, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { clsx } from 'clsx';
import { twMerge } from "tailwind-merge";
import { useSearchParams } from "next/navigation";
import * as api from "@/lib/api";

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token') || "";
    const email = searchParams.get('email') || "";

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Initial check for missing token/email
    useEffect(() => {
        if (!token || !email) {
            setErrors({ general: ["Invalid password reset link. Please check your email and try again."] });
        }
    }, [token, email]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        if (formData.password.length < 8) {
            setErrors({ password: ["Password must be at least 8 characters"] });
            setIsLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrors({ confirmPassword: ["Passwords do not match"] });
            setIsLoading(false);
            return;
        }

        try {
            await api.resetPassword(token, email, formData.password, formData.confirmPassword);
            setIsSuccess(true);
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
        <>
            {isSuccess ? (
                <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-dark-navy">Password Reset Complete</h3>
                        <p className="text-slate-500 mt-2">
                            Your password has been successfully updated. You can now log in with your new password.
                        </p>
                    </div>
                    <Link
                        href="/login"
                        className="block w-full py-3 px-4 bg-primary-red text-white font-bold rounded-xl shadow-lg hover:bg-red-700 transition-colors"
                    >
                        Or Go to Login
                    </Link>
                </div>
            ) : (
                <>
                    <div className="text-center mb-8">
                        <div className="w-full relative mb-2 px-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/images/logo-ais-min.png"
                                alt="Arsenal Indonesia Supporter"
                                className="w-full h-auto object-contain"
                            />
                        </div>
                        <h1 className="text-2xl font-bold text-dark-navy">Set New Password</h1>
                        <p className="text-slate-500 mt-2">
                            Please enter your new password below.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {errors.general && (
                            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                                {errors.general[0]}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                    className={cn(
                                        "w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all",
                                        errors.password
                                            ? "border-red-500 focus:ring-red-200 focus:border-red-500"
                                            : "border-slate-200 focus:ring-primary-red/20 focus:border-primary-red"
                                    )}
                                    placeholder="Min 8 characters"
                                />
                            </div>
                            {errors.password && <p className="text-sm text-red-500">{errors.password[0]}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    className={cn(
                                        "w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all",
                                        errors.confirmPassword
                                            ? "border-red-500 focus:ring-red-200 focus:border-red-500"
                                            : "border-slate-200 focus:ring-primary-red/20 focus:border-primary-red"
                                    )}
                                    placeholder="Confirm new password"
                                />
                            </div>
                            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword[0]}</p>}
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
                            {isLoading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                </>
            )}
        </>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-8 shadow-xl">
                <Suspense fallback={<div>Loading...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </Card>
        </div>
    );
}
