import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from '../main.types';

export const createUserApi = (baseUrl: string) => 
  createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
      baseUrl: `${baseUrl}/user`,
      credentials: "include",
    }),
    endpoints: (builder) => ({
      getUserById: builder.query<User, string>({
        query: (_id) => `/${_id}`,
      }),
      createUser: builder.mutation<User, User>({
        query: (body) => ({
          body,
          method: "POST",
          url: "",
        }),
      }),
      updateUser: builder.mutation<User, { _id: string, body: User }>({
        query: ({_id, body}) => ({
          body,
          method: "PUT",
          url: `/${_id}`,
        }),
      }),
      deleteUser: builder.mutation<User, string>({
        query: (_id) => ({
          method: "DELETE",
          url: `/${_id}`,
        }),
      }),
    }),
  });