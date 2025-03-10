import { UpdateUserPayload, UpdateUserResponse } from "../types";
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
  endpoints: (builder) => ({
    updateUser: builder.mutation<UpdateUserResponse, UpdateUserPayload>({
      query: (body) => ({
        url: "/update",
        method: "PATCH",
        body,
      }),
    }),
  }),
});

export const { useUpdateUserMutation } = userApi;
