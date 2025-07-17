export interface Movies {
    page?: number;
    results?: Result[];
    total_pages?: number;
    total_results?: number;
}

export interface Result {
    adult?: boolean;
    backdrop_path?: string;
    genre_ids?: number[];
    id?: number;
    original_language?: OriginalLanguage;
    original_title?: string;
    overview?: string;
    popularity?: number;
    poster_path?: string;
    release_date?: Date;
    title?: string;
    video?: boolean;
    vote_average?: number;
    vote_count?: number;
}

export enum OriginalLanguage {
    En = "en",
    Nl = "nl",
    Th = "th",
}
export interface Movie {
    id: number;
    title: string;
    overview: string;
    release_date: Date;
    poster_path: string;
    backdrop_path: string;
    vote_average: number;
    genre_ids: number[];
}