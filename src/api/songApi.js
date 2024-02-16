import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const createSongApi = (baseUrl) => 
  createApi({
    reducerPath: 'songApi',
    baseQuery: fetchBaseQuery({
      baseUrl: `${baseUrl}/song`,
      credentials: "include",
    }),
    endpoints: (builder) => ({
      getSongDataBySid: builder.query({
        query: (sid) => `/data/${sid}`,
      }),
      searchSongs: builder.query({
        query: ({song, artist, limit, offset}) => `/search?song=${song}&artist=${artist}&limit=${limit}&offset=${offset}`,
      }),
    }),
  });