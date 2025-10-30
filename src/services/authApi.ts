import {
  BaseQueryFn,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import {
  UserAuthResponsePayload,
  RegisterUserRequestPayload,
  LoginAuthRequestPayload,
  ErrorResponse,
  IUserData,
} from "../types";
import {
  LoginPasswordPayload,
  LoginPasswordResponsePayload,
  LoginSuccessResponsePayload,
} from "../types/auth";
import { clearAuthData } from "../utils/authUtils";

const API_URL: string | undefined = process.env.NEXT_PUBLIC_API_URL;

const saveAuthDataToLocalStorage = (data: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("authData", JSON.stringify(data.resp));
  }
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/auth`,
  }) as BaseQueryFn<
    FetchArgs,
    unknown,
    { status: number; data: ErrorResponse }
  >,
  endpoints: (builder) => ({
    login: builder.mutation<
      LoginSuccessResponsePayload,
      LoginAuthRequestPayload
    >({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        try {
          const result = await queryFulfilled;
          saveAuthDataToLocalStorage(result.data);
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),

    register: builder.mutation<void, RegisterUserRequestPayload>({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
    }),

    forgotPassword: builder.mutation<void, string>({
      query: (email) => ({
        url: "/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),

    me: builder.query<
      {
        user: IUserData;
      },
      string
    >({
      query: (token) => ({
        url: "/me",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        try {
          await queryFulfilled;
          clearAuthData();
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useMeQuery,
  useLogoutMutation,
} = authApi;
