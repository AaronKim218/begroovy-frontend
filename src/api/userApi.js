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
        query: (_id) => `/${_id}`,
      }),
      createUser: builder.mutation({
        query: (body) => ({
          body,
          method: "POST",
          url: "",
        }),
      }),
      updateUser: builder.mutation({
        query: ({_id, body}) => ({
          body,
          method: "PUT",
          url: `/${_id}`,
        }),
      }),
    }),
  });