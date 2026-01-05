const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Get XSRF token from cookies
 */
function getXsrfToken() {
    if (typeof document === 'undefined') return '';
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

/**
 * Initialize CSRF protection
 */
export async function initCsrf() {
    await fetch(`${API_URL}/sanctum/csrf-cookie`, {
        credentials: 'include',
    });
}

/**
 * Make authenticated API request
 */
async function apiRequest(endpoint: string, options: RequestInit = {}) {
    // Ensure headers object exists
    const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': getXsrfToken(),
        ...(options.headers as Record<string, string>),
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: 'include',
        headers,
    });

    // Handle 204 No Content (e.g. from logout)
    if (response.status === 204) {
        return {};
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        // Create a custom error object that matches the structure expected by the app
        const error: any = new Error(data.message || 'API Error');
        error.status = response.status;
        error.errors = data.errors || {};
        throw error;
    }

    return data;
}

/**
 * Login user
 */
export async function login(email: string, password: string, remember = false) {
    await initCsrf();
    return apiRequest('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, remember }),
    });
}

/**
 * Logout user
 */
export async function logout() {
    return apiRequest('/api/logout', {
        method: 'POST',
    });
}

/**
 * Get current user
 */
export async function getUser() {
    return apiRequest('/api/user');
}

/**
 * Request password reset
 */
export async function forgotPassword(email: string) {
    await initCsrf();
    return apiRequest('/api/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
    });
}

/**
 * Reset password
 */
export async function resetPassword(token: string, email: string, password: string, passwordConfirmation: string) {
    await initCsrf();
    return apiRequest('/api/reset-password', {
        method: 'POST',
        body: JSON.stringify({
            token,
            email,
            password,
            password_confirmation: passwordConfirmation,
        }),
    });
}

/**
 * Get user profile by user ID
 */
export async function getProfileByUserId(userId: number) {
    return apiRequest(`/api/profile/user/${userId}`);
}

/**
 * Update user profile
 */
/**
 * Update user profile
 */
export async function updateProfile(data: FormData) {
    await initCsrf();
    // We cannot set Content-Type header manually for FormData, fetch does it automatically with boundary
    // So we need a separate request logic or modified apiRequest
    const endpoint = '/api/profile';
    const headers: Record<string, string> = {
        'Accept': 'application/json',
        'X-XSRF-TOKEN': getXsrfToken(),
    };

    // apiRequest forces Content-Type: application/json, so we bypass it for FormData
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: data,
        credentials: 'include',
    });

    if (response.status === 204) return {};

    const resData = await response.json().catch(() => ({}));

    if (!response.ok) {
        const error: any = new Error(resData.message || 'API Error');
        error.status = response.status;
        error.errors = resData.errors || {};
        throw error;
    }

    return resData;
}

/**
 * Delete profile picture
 */
export async function deleteProfilePicture() {
    await initCsrf();
    return apiRequest('/api/profile/picture', {
        method: 'DELETE',
    });
}

/**
 * Update password
 */
export async function updatePassword(data: any) {
    await initCsrf();
    return apiRequest('/api/password', {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

/**
 * Get news list
 */
export async function getNews(page = 1, perPage = 9) {
    return apiRequest(`/api/news?page=${page}&per_page=${perPage}`);
}

/**
 * Get news detail by ID
 */
export async function getNewsById(newsId: number | string) {
    return apiRequest(`/api/news/${newsId}`);
}

/**
 * Search news
 */
interface SearchParams {
    keyword?: string;
    start_date?: string;
    end_date?: string;
    category_id?: number | string;
    page?: number;
    per_page?: number;
}

export async function searchNews(params: SearchParams = {}) {
    const queryParams = new URLSearchParams();
    if (params.keyword) queryParams.append('keyword', params.keyword);
    if (params.start_date) queryParams.append('start_date', params.start_date);
    if (params.end_date) queryParams.append('end_date', params.end_date);
    if (params.category_id) queryParams.append('category_id', params.category_id.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.per_page) queryParams.append('per_page', params.per_page.toString());

    return apiRequest(`/api/news/search?${queryParams.toString()}`);
}

/**
 * Get all categories
 */
export async function getCategories() {
    return apiRequest('/api/categories');
}
