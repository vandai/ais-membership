"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
    Camera,
    User,
    Phone,
    MapPin,
    Calendar,
    Save,
    Building2,
    Map,
    Settings,
    Globe,
    Trash2
} from "lucide-react";
import { clsx } from 'clsx';
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import * as api from "@/lib/api";
import { useEffect } from "react";

// Utility for class merging
function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

export default function ProfilePage() {
    const { user, loading } = useAuth();
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        gender: "Male" as "Male" | "Female",
        birthdate: "",
        address: "",
        city: "",
        province: "",
        country: "",
        profileImage: "/member-card/arsenal-logo.png"
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isHoveringImage, setIsHoveringImage] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (user?.id) {
                try {
                    const response = await api.getProfileByUserId(user.id);
                    const data = response.data;

                    console.log("[Profile URL Debug] Raw profile_picture:", data.profile_picture);
                    console.log("[Profile URL Debug] Raw profile_picture_url:", data.profile_picture_url);

                    const getFullUrl = (path: string | null | undefined) => {
                        if (!path) return "/member-card/arsenal-logo.png";
                        if (path.startsWith("http") || path.startsWith("https")) return path;
                        // Remove leading slash if exists to avoid double slash if API_URL has one (though usually API_URL doesn't)
                        // Actually better to just ensure clean join
                        const cleanPath = path.startsWith('/') ? path : `/${path}`;
                        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                        return `${baseUrl}${cleanPath}`;
                    };

                    setFormData(prev => ({
                        ...prev,
                        name: data.full_name || user.name || "",
                        email: data.email || user.email || "",
                        phone: data.phone || "",
                        birthdate: data.birthdate || "",
                        address: data.address || "",
                        city: data.city || "",
                        province: data.province || "",
                        country: data.country || "",
                        profileImage: getFullUrl(data.profile_picture_url)
                    }));
                } catch (error) {
                    console.error("Failed to fetch profile:", error);
                    // Fallback to user data if profile fetch fails
                    setFormData(prev => ({
                        ...prev,
                        name: user.name || "",
                        email: user.email || "",
                        profileImage: "/member-card/arsenal-logo.png"
                    }));
                } finally {
                    setIsLoadingData(false);
                }
            } else if (!loading && !user) {
                // Should be redirected by layout, but just in case
                setIsLoadingData(false);
            }
        };

        if (!loading) {
            fetchProfile();
        }
    }, [user, loading]);

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleImageUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, profileImage: imageUrl }));
            setSelectedImage(file);
        }
    };

    const handleDeleteImage = async () => {
        if (!confirm("Are you sure you want to delete your profile picture?")) return;

        try {
            await api.deleteProfilePicture();
            setFormData(prev => ({ ...prev, profileImage: "/member-card/arsenal-logo.png" }));
            setSelectedImage(null);
            showToast("Profile picture deleted successfully.", "success");
        } catch (error) {
            console.error("Failed to delete profile picture:", error);
            showToast("Failed to delete profile picture.", "error");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: Record<string, string> = {};

        if (!validateEmail(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }
        if (!formData.name.trim()) {
            newErrors.name = "Full name is required";
        }
        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoadingData(true);

        try {
            const data = new FormData();
            data.append('full_name', formData.name);
            data.append('phone', formData.phone);
            data.append('gender', formData.gender);
            data.append('birthdate', formData.birthdate);
            data.append('address', formData.address);
            data.append('city', formData.city);
            data.append('province', formData.province);
            data.append('country', formData.country);

            if (selectedImage) {
                data.append('profile_picture', selectedImage);
            }

            // Append other fields if necessary or available in the form
            // e.g. email is usually not updatable via profile endpoint or requires verification

            const response = await api.updateProfile(data);

            // Update local state with returned data if available, or just re-fetch
            // Assuming response.data contains the updated profile
            if (response.data && response.data.profile_picture_url) {
                const newParams = response.data;
                const path = newParams.profile_picture_url;

                console.log("[Profile URL Debug] Update response profile_picture_url:", path);

                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                const fullUrl = (path.startsWith("http") || path.startsWith("https"))
                    ? path
                    : `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;

                setFormData(prev => ({
                    ...prev,
                    profileImage: fullUrl
                }));
            }

            showToast("Profile updated successfully!", "success");
        } catch (error: any) {
            console.error("Failed to update profile:", error);
            if (error.errors) {
                const messages = Object.values(error.errors).flat().join(", ");
                showToast(`Failed to update profile: ${messages}`, "error");
            } else {
                showToast(error.message || "Failed to update profile.", "error");
            }
        } finally {
            setIsLoadingData(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold text-dark-navy">My Profile</h1>
                    <p className="text-slate-500 mt-2">Manage your personal information</p>
                </div>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Profile Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8 relative"
                >
                    <div className="relative group">
                        <div
                            className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 shadow-inner relative"
                            onMouseEnter={() => setIsHoveringImage(true)}
                            onMouseLeave={() => setIsHoveringImage(false)}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={formData.profileImage}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                            {/* Overlay */}
                            <div
                                className={cn(
                                    "absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity cursor-pointer",
                                    isHoveringImage ? "opacity-100" : "opacity-0"
                                )}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Camera className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpdate}
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 bg-primary-red text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-colors z-10"
                            title="Update Profile Picture"
                        >
                            <Camera className="w-4 h-4" />
                        </button>
                        {formData.profileImage !== "/member-card/arsenal-logo.png" && (
                            <button
                                type="button"
                                onClick={handleDeleteImage}
                                className="absolute bottom-0 -left-2 bg-white text-red-600 p-2 rounded-full shadow-lg hover:bg-red-50 transition-colors z-10 border border-slate-200"
                                title="Delete Profile Picture"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div className="absolute top-8 right-8 hidden md:block">
                        <Link
                            href="/account"
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
                        >
                            <Settings className="w-4 h-4" />
                            Edit Account
                        </Link>
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-2">
                        <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start gap-4">
                            <h2 className="text-2xl font-bold text-dark-navy">{formData.name}</h2>
                            {/* Mobile only edit button */}
                            <Link
                                href="/account"
                                className="md:hidden flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg"
                            >
                                <Settings className="w-3 h-3" />
                                Edit Account
                            </Link>
                        </div>
                        <p className="text-slate-500">{formData.email}</p>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                            Standard Member
                        </div>
                    </div>
                </motion.div>

                {/* Form Fields Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100"
                >
                    <h3 className="text-xl font-bold text-dark-navy mb-6 flex items-center gap-2">
                        <User className="w-5 h-5 text-primary-red" />
                        Personal Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Full Name <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={cn(
                                        "w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all",
                                        errors.name
                                            ? "border-red-500 focus:ring-red-200 focus:border-red-500"
                                            : "border-slate-200 focus:ring-primary-red/20 focus:border-primary-red"
                                    )}
                                    placeholder="Enter your name"
                                />
                            </div>
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Phone Number <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={cn(
                                        "w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all",
                                        errors.phone
                                            ? "border-red-500 focus:ring-red-200 focus:border-red-500"
                                            : "border-slate-200 focus:ring-primary-red/20 focus:border-primary-red"
                                    )}
                                    placeholder="Enter phone number"
                                />
                            </div>
                            {errors.phone && (
                                <p className="text-sm text-red-500">{errors.phone}</p>
                            )}
                        </div>

                        {/* Gender */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Gender</label>
                            <div className="relative">
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition-all appearance-none"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        {/* Birthdate */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Birthdate</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="date"
                                    name="birthdate"
                                    value={formData.birthdate}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition-all"
                                />
                            </div>
                        </div>

                        <div className="hidden md:block"></div>

                        {/* Address (Full Width) */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-slate-700">Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-4 w-5 h-5 text-slate-400" />
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition-all resize-none"
                                    placeholder="Enter your street address"
                                />
                            </div>
                        </div>

                        {/* City */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">City</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition-all"
                                    placeholder="Enter city"
                                />
                            </div>
                        </div>

                        {/* Province */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Province</label>
                            <div className="relative">
                                <Map className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    name="province"
                                    value={formData.province}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition-all"
                                    placeholder="Enter province/state"
                                />
                            </div>
                        </div>

                        {/* Country */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Country</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition-all"
                                    placeholder="Enter country"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            className="flex items-center gap-2 bg-primary-red text-white py-3 px-8 rounded-xl font-semibold shadow-lg hover:bg-red-700 active:scale-95 transition-all"
                        >
                            <Save className="w-5 h-5" />
                            Update Profile
                        </button>
                    </div>
                </motion.div>
            </form>
        </div>
    );
}
