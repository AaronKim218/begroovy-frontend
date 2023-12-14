import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const createPostApi = (baseUrl) => 
  createApi({
    reducerPath: 'postApi',
    baseQuery: fetchBaseQuery({
      baseUrl: `${baseUrl}/post`,
      credentials: "include",
    }),
    endpoints: (builder) => ({
      getAllPosts: builder.query({
        query: () => '',
      }),
      getPostByPid: builder.query({
        query: (pid) => `/${pid}`,
      }),
      likePost: builder.mutation({
        query: ({pid, uid}) => ({
          method: "PUT",
          url: `/${pid}/like/${uid}`,
        }),
      }),
      dislikePost: builder.mutation({
        query: ({pid, uid}) => ({
          method: "PUT",
          url: `/${pid}/dislike/${uid}`,
        }),
      }),
    }),
  });