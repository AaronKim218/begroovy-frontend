import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Song } from '../main.types';

export const createSongApi = (baseUrl: string) =>
    createApi({
        reducerPath: 'songApi',
        baseQuery: fetchBaseQuery({
            baseUrl: `${baseUrl}/song`,
            credentials: "include",
        }),
        endpoints: (builder) => ({
            getSongBySpotifyId: builder.query<Song, string>({
                query: (spotifyId) => `/${spotifyId}`,
            }),
            searchSongs: builder.query<Song[], { title: string, artist: string, limit: number, offset: number }>({
                query: ({ title, artist, limit, offset }) => `/search?title=${title}&artist=${artist}&limit=${limit}&offset=${offset}`,
            }),
        }),
    });