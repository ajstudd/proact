import {
  UpdateUserPayload,
  UpdateUserResponse,
  BookmarkResponse,
  BookmarkedProjectsResponse,
} from "../types";
import { getAuthToken } from "../utils/authUtils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL: string = process.env.NEXT_PUBLIC_API_URL!;

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/user`,
    prepareHeaders: (headers) => {
      const token = getAuthToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Bookmarks"],
  endpoints: (builder) => ({
    updateUser: builder.mutation<UpdateUserResponse, UpdateUserPayload>({
      query: (body) => ({
        url: "/update",
        method: "PATCH",
        body,
      }),
    }),
    bookmarkProject: builder.mutation<BookmarkResponse, { projectId: string }>({
      query: (body) => ({
        url: "/bookmarks",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Bookmarks"],
    }),
    removeBookmark: builder.mutation<BookmarkResponse, string>({
      query: (projectId) => ({
        url: `/bookmarks/${projectId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bookmarks"],
    }),
    getBookmarkedProjects: builder.query<BookmarkedProjectsResponse, void>({
      query: () => "/bookmarks",
      providesTags: ["Bookmarks"],
    }),
  }),
});

export const {
  useUpdateUserMutation,
  useBookmarkProjectMutation,
  useRemoveBookmarkMutation,
  useGetBookmarkedProjectsQuery,
} = userApi;
