export enum NewsCategory {
    GENERAL = 'GENERAL',
    EVENTS = 'EVENTS',
    UPDATES = 'UPDATES',
    ANNOUNCEMENTS = 'ANNOUNCEMENTS',
    MATCHES = 'MATCHES',
    TRAINING = 'TRAINING'
}

export interface News {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    publishDate: Date;
    author?: string;
    category: NewsCategory;
    tags: string[];
    isImportant: boolean;
}

export interface NewsResponse {
    news: News[];
    totalCount: number;
    hasMore: boolean;
}