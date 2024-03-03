import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Credentials } from './types';
import { User } from '../main.types';

export const createAuthApi = (baseUrl: string) => 
  createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
      baseUrl: `${baseUrl}/auth`,
      credentials: "include",
    }),
    endpoints: (builder) => ({
      login: builder.mutation<User, Credentials>({
        query: (body) => ({
          body,
          method: "POST",
          url: "login",
        }),
      }),
      logout: builder.mutation<void, void>({
        query: () => ({
          method: "POST",
          url: "logout",
        }),
      }),
    }),
  });