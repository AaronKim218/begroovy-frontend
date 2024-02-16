import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const createAuthApi = (baseUrl) => 
  createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
      baseUrl: `${baseUrl}/auth`,
      credentials: "include",
    }),
    endpoints: (builder) => ({
      login: builder.mutation({
        query: (body) => ({
          body,
          method: "POST",
          url: "login",
        }),
      }),
      logout: builder.mutation({
        query: () => ({
          method: "POST",
          url: "logout",
        }),
      }),
    }),
  });