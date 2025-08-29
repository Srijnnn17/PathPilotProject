import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

// This is the main API slice. It sets up the base URL for all requests.
// Other slices will inject their endpoints into this one.
export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  // Tag types are used for caching and invalidating data
  tagTypes: ["User", "Topic"],
  // Endpoints are defined in other files using `injectEndpoints`
  endpoints: (builder) => ({}),
});