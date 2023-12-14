import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { userApi, authApi, songApi, postApi, groupApi } from '../api/api';
import userReducer from './userSlice';

const combinedReducers = combineReducers({
    user: userReducer,
    [userApi.reducerPath]: userApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [songApi.reducerPath]: songApi.reducer,
    [postApi.reducerPath]: postApi.reducer,
    [groupApi.reducerPath]: groupApi.reducer,
});

export const store = configureStore({
    reducer: combinedReducers,
    // Adding the api middleware enables caching, invalidation, polling, and other features of RTK Query
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(userApi.middleware)
        .concat(authApi.middleware)
        .concat(songApi.middleware)
        .concat(postApi.middleware)
        .concat(groupApi.middleware),
});