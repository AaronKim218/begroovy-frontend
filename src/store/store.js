import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../api/api';
import userReducer from './userSlice';

export const store = configureStore({
    reducer: {
      user: userReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    // Adding the api middleware enables caching, invalidation, polling, and other features of RTK Query
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
});