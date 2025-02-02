import { UpdateUserPayload, UpdateUserResponse } from '../types';
import { getToken } from '../utils/getToken';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL: string = process.env.NEXT_PUBLIC_API_URL!;

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/user`,
  }),
  endpoints: builder => ({
    updateUser: builder.mutation<UpdateUserResponse, UpdateUserPayload>({
      query: body => {
        const token = getToken();
        return {
          url: '/update',
          method: 'PATCH',
          body,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),
  }),
});

export const { useUpdateUserMutation } = userApi;
