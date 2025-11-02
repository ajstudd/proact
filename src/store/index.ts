import { configureStore } from "@reduxjs/toolkit";
import {
  authApi,
  mediaApi,
  userApi,
  imageApi,
  postApi,
  otpApi,
  api,
  projectApi,
  notificationsApi,
  analysisApi,
  reportApi,
} from "../services";
import userSlice from "./userSlice";
import uiSlice from "./uiSlice";
import notificationsSlice from "./notificationsSlice";
import postsSlice from "./postsSlice";
import commentsSlice from "./commentsSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [mediaApi.reducerPath]: mediaApi.reducer,
    [api.reducerPath]: api.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [imageApi.reducerPath]: imageApi.reducer,
    [postApi.reducerPath]: postApi.reducer,
    [otpApi.reducerPath]: otpApi.reducer,
    [analysisApi.reducerPath]: analysisApi.reducer,
    [reportApi.reducerPath]: reportApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
    userSlice,
    notificationsSlice,
    postsSlice,
    uiSlice,
    commentsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      authApi.middleware,
      mediaApi.middleware,
      api.middleware,
      userApi.middleware,
      postApi.middleware,
      imageApi.middleware,
      notificationsApi.middleware,
      projectApi.middleware,
      analysisApi.middleware,
      otpApi.middleware,
      reportApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
