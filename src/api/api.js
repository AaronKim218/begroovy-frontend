import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api', // Optional: Define the slice's name
  baseQuery: fetchBaseQuery({ baseUrl: '/your/api/url' }),
  endpoints: (builder) => ({
    // Define your endpoints here
    getExample: builder.query({
      query: (id) => `example/${id}`,
    }),
    // You can add more queries and mutations
  }),
});

export const { useGetExampleQuery } = apiSlice;