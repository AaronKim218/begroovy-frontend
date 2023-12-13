import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const createUserApi = (baseUrl) => 
  createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
      baseUrl: `${baseUrl}/user`,
      credentials: "include",
    }),
    endpoints: (builder) => ({
      getUserById: builder.query({
        query: (uid) => `/${uid}`,
      }),
      createUser: builder.mutation({
        query: (body) => ({
          body,
          method: "POST",
          url: "",
        }),
      }),
    }),
  });