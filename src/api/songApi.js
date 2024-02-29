import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const createSongApi = (baseUrl) => 
  createApi({
    reducerPath: 'songApi',
    baseQuery: fetchBaseQuery({
      baseUrl: `${baseUrl}/song`,
      credentials: "include",
    }),
    endpoints: (builder) => ({
      getSongBySpotifyId: builder.query({
        query: (spotifyId) => `/${spotifyId}`,
      }),
      searchSongs: builder.query({
        query: ({title, artist, limit, offset}) => `/search?title=${title}&artist=${artist}&limit=${limit}&offset=${offset}`,
      }),
    }),
  });