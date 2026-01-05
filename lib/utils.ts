import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getImageUrl(path: string | null | undefined): string {
    if (!path) return "/images/placeholder.png";
    if (path.startsWith('http')) return path;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    // Remove leading slash
    let cleanPath = path.startsWith('/') ? path.substring(1) : path;

    // If path is just "posts/...", it likely needs "storage/" prefix for Laravel public disk
    if (!cleanPath.startsWith('storage') && (cleanPath.startsWith('posts') || cleanPath.startsWith('images'))) {
        cleanPath = `storage/${cleanPath}`;
    }

    return `${baseUrl}/${cleanPath}`;
}
