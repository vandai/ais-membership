"use client";

import React, { useState, useEffect } from "react";

export default function DebugEnvPage() {
    const [apiUrl, setApiUrl] = useState<string>("");
    const [fetchResult, setFetchResult] = useState<any>(null);
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Read env var on client side
        setApiUrl(process.env.NEXT_PUBLIC_API_URL || "Middleware/Server Value Missing? (Fallback to code default if any)");
    }, []);

    const testConnection = async () => {
        setLoading(true);
        setError(null);
        setFetchResult(null);
        try {
            const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const res = await fetch(`${url}/sanctum/csrf-cookie`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });

            const status = res.status;
            const statusText = res.statusText;

            setFetchResult({
                status,
                statusText,
                ok: res.ok
            });

        } catch (err: any) {
            setError(err.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto font-mono">
            <h1 className="text-2xl font-bold mb-4">Environment Debugger</h1>

            <div className="mb-6 p-4 bg-gray-100 rounded border">
                <h2 className="font-bold mb-2">process.env.NEXT_PUBLIC_API_URL</h2>
                <code className="block bg-black text-green-400 p-2 rounded break-all">
                    {apiUrl}
                </code>
                {apiUrl === 'undefined' && <p className="text-red-500 mt-2">WARNING: Variable is explicitly "undefined" string</p>}
                {!apiUrl && <p className="text-red-500 mt-2">WARNING: Variable is empty/falsy</p>}
            </div>

            <button
                onClick={testConnection}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? "Testing..." : "Test Connection to Backend"}
            </button>

            {fetchResult && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
                    <h3 className="font-bold text-green-800">Connection Result:</h3>
                    <pre className="mt-2 text-sm">{JSON.stringify(fetchResult, null, 2)}</pre>
                </div>
            )}

            {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded">
                    <h3 className="font-bold text-red-800">Connection Error:</h3>
                    <pre className="mt-2 text-sm text-red-600">{error}</pre>
                </div>
            )}

            <div className="mt-8 text-xs text-gray-500">
                Rendered at: {new Date().toISOString()}
            </div>
        </div>
    );
}
