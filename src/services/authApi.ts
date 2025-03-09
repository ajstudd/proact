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
import { transformAuthResponse } from "../utils/transformTokens";

const API_URL: string | undefined = process.env["NEXT_PUBLIC_API_URL"];
//add env.local file in root folder and add NEXT_PUBLIC_API_URL=your api url

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
    /** 🔐 User Login */
    login: builder.mutation<
      LoginSuccessResponsePayload,
      LoginAuthRequestPayload
    >({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),

    /** 📝 Register User */
    register: builder.mutation<void, RegisterUserRequestPayload>({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
    }),

    /** 🔑 Forgot Password */
    forgotPassword: builder.mutation<void, string>({
      query: (email) => ({
        url: "/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),

    /** 🔄 Reset Password */
    resetPassword: builder.mutation<void, { token: string; password: string }>({
      query: ({ password, token }) => ({
        url: "/reset-password",
        method: "POST",
        body: { password },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    /** 👤 Get User Info */
    me: builder.query<IUserData, string>({
      query: (token) => ({
        url: "/me",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    /** 🚪 Logout */
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useMeQuery,
  useLogoutMutation,
} = authApi;
