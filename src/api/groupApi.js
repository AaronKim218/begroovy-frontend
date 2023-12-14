import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const createGroupApi = (baseUrl) => 
  createApi({
    reducerPath: 'groupApi',
    baseQuery: fetchBaseQuery({
      baseUrl: `${baseUrl}/group`,
      credentials: "include",
    }),
    endpoints: (builder) => ({
      getArtistGroup: builder.query({
        query: (artistId) => `/artist/${artistId}`,
      }),
      getMemberGroups: builder.query({
        query: (uid) => `/member/${uid}`,
      }),
        getGroupById: builder.query({
            query: (gid) => `/${gid}`,
        }),
        addComment: builder.mutation({
            query: ({gid, body}) => ({
                body,
                method: "PUT",
                url: `/comment/${gid}`,
            }),
        }),
        removeMember: builder.mutation({
            query: ({gid, uid}) => ({
                method: "PUT",
                url: `/member/remove/${gid}/${uid}`,
            }),
        }),
    }),
  });