export interface Credentials {
    username: string;
    password: string;
}

export interface SearchSongsParams {
    title: string;
    artist: string;
    limit: number;
    offset: number;
}