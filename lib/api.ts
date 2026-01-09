import { Match } from "@/types/football";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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

/**
 * Get next match fixture
 */
export async function getNextMatch() {
    return apiRequest('/api/football/fixtures/next');
}

/**
 * Get last match result
 */
export async function getLastMatch() {
    return apiRequest('/api/football/results/last');
}

/**
 * Get match results with pagination
 */
/**
 * Get match results with pagination
 */
export async function getMatchResults(page = 1, limit = 9, leagueId?: number, season?: number) {
    let url = `/api/football/results?page=${page}&limit=${limit}`;
    if (leagueId) {
        url += `&league_id=${leagueId}`;
    }
    if (season) {
        url += `&season=${season}`;
    }
    return apiRequest(url);
}

/**
 * Get all competitions
 */
export async function getCompetitions(season?: number) {
    const query = season ? `?season=${season}` : '';
    return apiRequest(`/api/football/competitions${query}`);
}

/**
 * Get all standings for Arsenal's competitions
 */
export async function getAllStandings(season = 2025) {
    return apiRequest(`/api/football/standings/all?season=${season}`);
}

/**
 * Get seasons list
 */
export async function getSeasons() {
    return apiRequest('/api/football/seasons');
}

/**
 * Get match by ID
 */
/**
 * Get match by ID
 * Note: Since a direct detail endpoint is not verified, we fetch recent results/fixtures and filter.
 */
export async function getMatchById(id: number | string) {
    // Try results first
    try {
        const results = await apiRequest('/api/football/results?limit=100'); // Fetch last 100
        const match = results.data?.find((m: Match) => String(m.id) === String(id));
        if (match) return { data: match };
    } catch (e) {
        console.warn("Failed to find match in results", e);
    }

    // Try upcoming fixtures
    try {
        const fixtures = await apiRequest('/api/football/fixtures?limit=50');
        const match = fixtures.data?.find((m: Match) => String(m.id) === String(id));
        if (match) return { data: match };
    } catch (e) {
        console.warn("Failed to find match in fixtures", e);
    }

    throw new Error("Match not found");
}

/**
 * Get detailed match report
 */
export async function getMatchReport(fixtureId: number | string) {
    return apiRequest(`/api/football/results/${fixtureId}/report`);
}

/**
 * Get league standings
 */
export async function getLeagueTable(season = 2025, leagueId = 39) {
    return apiRequest(`/api/football/standings?season=${season}&league_id=${leagueId}`);
}


/**
 * Get fixtures with pagination
 */
export async function getFixtures(page = 1, limit = 9, leagueId?: number, season?: number) {
    let url = `/api/football/fixtures?page=${page}&limit=${limit}`;
    if (leagueId) {
        url += `&league_id=${leagueId}`;
    }
    if (season) {
        url += `&season=${season}`;
    }
    return apiRequest(url);
}

/**
 * Get events list
 */
export async function getEvents(page = 1, perPage = 9, categoryId?: number | null) {
    let url = `/api/events?page=${page}&per_page=${perPage}`;
    if (categoryId) {
        url += `&category_id=${categoryId}`;
    }
    return apiRequest(url);
}

/**
 * Get event categories
 */
export async function getEventCategories() {
    return apiRequest('/api/event-categories');
}

/**
 * Get event detail by ID
 */
export async function getEventById(id: number | string) {
    return apiRequest(`/api/events/${id}`);
}
