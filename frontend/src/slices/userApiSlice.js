import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";

// This slice injects user-specific endpoints into the main apiSlice.
export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: USERS_URL,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
  }),
});

// Export the auto-generated hooks for use in your components
export const { useLoginMutation, useRegisterMutation, useLogoutMutation } =
  usersApiSlice;