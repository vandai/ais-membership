export interface EventCategory {
    id: number;
    name: string;
    slug: string;
    description?: string;
}

export interface EventAuthor {
    id: number;
    name: string;
}

export interface Event {
    id: number;
    title: string;
    description: string;
    slug: string;
    location: string;
    fee: string; // API returns "50000.00" string
    start_datetime: string;
    end_datetime: string;
    member_only: boolean;
    status: 'published' | 'draft' | 'archived';
    image: string | null;
    image_url: string | null;
    author_id: number;
    category_id: number;
    created_at: string;
    updated_at: string;
    author: EventAuthor;
    category: EventCategory;
}

export interface EventResponse {
    data: Event[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
}

export interface EventCategoryResponse {
    data: EventCategory[];
}

export interface EventDetailResponse {
    data: Event;
}
