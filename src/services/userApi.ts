import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RegisterUser, User,LoginResponse,LoginUser } from '../types/user/userTypes';
export const userBaseQuery = 'http://localhost:8000/api/user/'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api/user/' }),
  endpoints: (builder) => (
  {
    registerUser: builder.mutation<LoginResponse, RegisterUser>({
      query: (user) => ({
        url: 'register',
        method: 'POST',
        body: user,
      }),
    }),
    loginUser:builder.mutation<LoginResponse,LoginUser>({
      query: (credentials) => ({
        url: 'login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),

});

export const { useRegisterUserMutation,useLoginUserMutation } = userApi;
