import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Post, PostCreation } from '../main.types';

export const createPostApi = (baseUrl: string) =>
    createApi({
        reducerPath: 'postApi',
        baseQuery: fetchBaseQuery({
            baseUrl: `${baseUrl}/post`,
            credentials: "include",
        }),
        endpoints: (builder) => ({
            getAllPosts: builder.query<Post[], void>({
                query: () => '',
            }),
            getPostByPid: builder.query<Post, string>({
                query: (pid) => `/${pid}`,
            }),
            likePost: builder.mutation<Post, { pid: string, uid: string }>({
                query: ({ pid, uid }) => ({
                    method: "PUT",
                    url: `/${pid}/like/${uid}`,
                }),
            }),
            dislikePost: builder.mutation<Post, { pid: string, uid: string }>({
                query: ({ pid, uid }) => ({
                    method: "PUT",
                    url: `/${pid}/dislike/${uid}`,
                }),
            }),
            unlikePost: builder.mutation<Post, { pid: string, uid: string }>({
                query: ({ pid, uid }) => ({
                    method: "PUT",
                    url: `/${pid}/unlike/${uid}`,
                }),
            }),
            undislikePost: builder.mutation<Post, { pid: string, uid: string }>({
                query: ({ pid, uid }) => ({
                    method: "PUT",
                    url: `/${pid}/undislike/${uid}`,
                }),
            }),
            createPost: builder.mutation<Post, PostCreation>({
                query: (body) => ({
                    body,
                    method: "POST",
                    url: "",
                }),
            }),
            deletePost: builder.mutation<Post, string>({
                query: (pid) => ({
                    method: "DELETE",
                    url: `/${pid}`,
                }),
            }),
        }),
    });