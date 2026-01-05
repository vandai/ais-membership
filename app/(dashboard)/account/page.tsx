"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Key,
    Save,
    Mail,
    ArrowLeft,
    ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { clsx } from 'clsx';
import { twMerge } from "tailwind-merge";
import * as api from "@/lib/api";

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

export default function AccountPage() {
    const [formData, setFormData] = useState({
        email: "john.doe@example.com",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous states
        setError("");
        setSuccess("");

        // Basic validation
        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError("New password and confirmation do not match");
            return;
        }

        if (formData.newPassword.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        setIsLoading(true);

        try {
            await api.updatePassword({
                current_password: formData.currentPassword,
                password: formData.newPassword,
                password_confirmation: formData.confirmPassword
            });

            setSuccess("Password updated successfully!");
            setFormData(prev => ({
                ...prev,
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            }));
        } catch (err: any) {
            console.error(err);
            if (err.errors) {
                // Join array errors or take first one
                const messages = Object.values(err.errors).flat().join(", ");
                setError(messages || "Failed to update password.");
            } else {
                setError(err.message || "An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4"
            >
                <Link
                    href="/profile"
                    className="inline-flex items-center text-slate-500 hover:text-primary-red transition-colors w-fit"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Profile
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-dark-navy">Account Settings</h1>
                    <p className="text-slate-500 mt-2">Manage your login and security preferences</p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email (Read Only) */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="email"
                                value={formData.email}
                                disabled
                                className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 bg-slate-200 px-2 py-1 rounded">
                                Read Only
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 my-6"></div>

                    <h3 className="text-lg font-bold text-dark-navy flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-primary-red" />
                        Change Password
                    </h3>

                    {/* Current Password */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Current Password</label>
                        <div className="relative">
                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="password"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition-all"
                                placeholder="Enter current password"
                            />
                        </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">New Password</label>
                        <div className="relative">
                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition-all"
                                placeholder="Enter new password"
                            />
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Confirm New Password</label>
                        <div className="relative">
                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition-all"
                                placeholder="Confirm new password"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-4 bg-green-50 text-green-600 rounded-xl text-sm font-medium border border-green-100">
                            {success}
                        </div>
                    )}

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={cn(
                                "flex items-center gap-2 bg-dark-navy text-white py-3 px-8 rounded-xl font-semibold shadow-lg transition-all",
                                isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-slate-800 active:scale-95"
                            )}
                        >
                            <Save className="w-5 h-5" />
                            {isLoading ? "Updating..." : "Update Password"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
