import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "@/constants";
import { AuthResponse } from "@/types/api";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    signup: builder.mutation<
      AuthResponse,
      { name: string; email: string; password: string; confirmPassword: string }
    >({
      query: (credentials) => ({
        url: API_ENDPOINTS.SIGNUP,
        method: "POST",
        body: credentials,
      }),
    }),
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (credentials) => ({
        url: API_ENDPOINTS.LOGIN,
        method: "POST",
        body: credentials,
      }),
    }),
    forgotPassword: builder.mutation<void, { email: string }>({
      query: ({ email }) => ({
        url: API_ENDPOINTS.FORGOT_PASSWORD,
        method: "POST",
        body: { email },
      }),
    }),
    resetPassword: builder.mutation<
      void,
      { token: string; newPassword: string }
    >({
      query: (credentials) => ({
        url: API_ENDPOINTS.RESET_PASSWORD,
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
