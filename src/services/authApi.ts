import {
  BaseQueryFn,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import {
  UserAuthResponsePayload,
  RegisterUserRequestPayload,
  LoginAuthRequestPayload,
  ErrorResponse,
  IUser,
  IUserData,
} from '../types';
import {
  LoginPasswordPayload,
  LoginPasswordResponsePayload,
  LoginSuccessResponsePayload,
  Tokens,
  UserAuthRequestPayload,
  VerifyOtpRequestPayload,
} from '../types/auth';
// import { reAuthBaseQuery } from '@/utils/reAuth';
import { transformAuthResponse } from '../utils/transformTokens';
import { LocalStorageKeys } from '../configs';

const API_URL: string | undefined = process.env.NEXT_PUBLIC_API_URL;

// const baseQuery = fetchBaseQuery({
//   baseUrl: `${API_URL}/auth`,
// });

export const authApi = createApi({
  reducerPath: 'authApi',
  // baseQuery: reAuthBaseQuery(baseQuery),
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/auth`,
  }) as BaseQueryFn<
    FetchArgs,
    unknown,
    { status: number; data: ErrorResponse }
  >,
  endpoints: builder => ({
    login: builder.mutation<LoginSuccessResponsePayload, LoginAuthRequestPayload>({
      query: body => ({
        url: '/login',
        method: 'POST',
        body,
      }),
      // transformResponse: transformAuthResponse,
      // extraOptions: {
      //   looseCheck: true,
      // },
    }),
    adminLogin: builder.mutation<
      LoginPasswordResponsePayload,
      LoginPasswordPayload
    >({
      query: body => ({
        url: '/login',
        method: 'POST',
        body,
      }),

      // transformResponse: transformAuthResponse,
      // extraOptions: {
      //   looseCheck: true,
      // },
    }),
    verifyOtp: builder.mutation<
      VerifyOtpRequestPayload,
      VerifyOtpRequestPayload
    >({
      query: body => ({
        url: '/verify',
        method: 'POST',
        body,
      }),
      // transformResponse: transformAuthResponse,
      // extraOptions: {
      //   looseCheck: true,
      // },
    }),
    register: builder.mutation<
      Pick<UserAuthRequestPayload, 'name' | 'phone'>,
      Pick<UserAuthRequestPayload, 'name' | 'phone' | 'email'>
    >({
      query: body => ({
        url: '/register',
        method: 'POST',
        body: { ...body },
      }),
      // transformResponse: transformAuthResponse,
      // extraOptions: {
      //   looseCheck: true,
      // },
    }),
    forgotPassword: builder.mutation<void, string>({
      query: email => ({
        url: '/forgot-password',
        method: 'POST',
        body: { email },
      }),
    }),
    resetPassword: builder.mutation<
      void,
      {
        token: string;
        password: string;
      }
    >({
      query: ({ password, token }) => ({
        url: '/reset-password',
        method: 'POST',
        body: { password },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    newAccessToken: builder.mutation<UserAuthResponsePayload, string>({
      query: refreshToken => ({
        url: '/refresh-tokens',
        method: 'POST',
        body: { refreshToken },
      }),
      transformResponse: transformAuthResponse,
    }),

    me: builder.mutation<IUserData, string>({
      query: token => ({
        url: '/me',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          // Authorization: `Bearer ${
          //   (
          //     JSON.parse(
          //       localStorage.getItem(LocalStorageKeys.AUTH_DATA)!
          //     ) as UserAuthResponsePayload
          //   ).tokens.access.token
          // }`,
        },
      }),
    }),
    logout: builder.mutation<void, string>({
      query: refreshToken => ({
        url: '/logout',
        method: 'POST',
        body: { refreshToken },
      }),
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useForgotPasswordMutation,
  useLoginMutation,
  useLogoutMutation,
  useMeMutation,
  useNewAccessTokenMutation,
  useRegisterMutation,
  useResetPasswordMutation,
  useVerifyOtpMutation,
} = authApi;
