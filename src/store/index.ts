import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './authSlice';
import {
  authApi,
  mediaApi,
  userApi,
  imageApi,
  postApi
} from '../services';
import userSlice from './userSlice';
import uiSlice from './uiSlice';
import postsSlice from './postsSlice';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [mediaApi.reducerPath]: mediaApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [imageApi.reducerPath]: imageApi.reducer,
    [postApi.reducerPath]: postApi.reducer,
    userSlice,
    postsSlice,
    uiSlice,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      authApi.middleware,
      mediaApi.middleware,
      userApi.middleware,
      postApi.middleware,
      imageApi.middleware,
    ),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
