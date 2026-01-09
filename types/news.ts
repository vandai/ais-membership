export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Author {
    id: number;
    name: string;
}

export interface NewsItem {
    id: number;
    title: string;
    slug: string;
    image: string | null;
    image_url: string | null;
    excerpt: string;
    description?: string;
    // content can be used as an alias or if API changes
    body?: string;
    contents: string;
    status: 'published' | 'draft' | 'archived';
    author_id: number;
    created_at: string;
    updated_at: string;
    author: Author;
    categories: Category[];
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface Meta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: PaginationLink[];
    path: string;
}

export interface Links {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
}

export interface NewsResponse {
    data: NewsItem[];
    meta: Meta;
    links: Links;
}

export interface NewsDetailResponse {
    data: NewsItem;
}

export interface CategoryListResponse {
    data: Category[];
}
