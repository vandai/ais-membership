"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../lib/api';
import { useRouter } from 'next/navigation';

interface User {
    id: number;
    name: string;
    email: string;
    role: string[];
    member_number?: string;
    status?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string, remember?: boolean) => Promise<any>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    async function checkAuth() {
        try {
            const userData = await api.getUser();
            let currentUser = userData.user;

            if (currentUser && currentUser.id) {
                try {
                    const profileResponse = await api.getProfileByUserId(currentUser.id);
                    // Merge profile data (member_number, status) into user object
                    currentUser = {
                        ...currentUser,
                        member_number: profileResponse.data.member_number,
                        status: profileResponse.data.status
                    };
                } catch (error) {
                    console.log("No profile found for user, treating as inactive");
                }
            }

            setUser(currentUser);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        checkAuth();
    }, []);

    async function login(email: string, password: string, remember = false) {
        const data = await api.login(email, password, remember);
        await checkAuth(); // Refresh user data
        return data;
    }

    async function logout() {
        try {
            await api.logout();
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setUser(null);
            router.push('/login');
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            checkAuth,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
