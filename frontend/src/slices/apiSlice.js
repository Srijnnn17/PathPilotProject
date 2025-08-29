// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// const baseQuery = fetchBaseQuery({ baseUrl: '' });

// export const apiSlice = createApi({
//   baseQuery,
//   tagTypes: ['User', 'Topic', 'Quiz'], // 👈 Add 'Quiz' here
//   endpoints: (builder) => ({}),
// });

// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// const baseQuery = fetchBaseQuery({ baseUrl: '' });

// export const apiSlice = createApi({
//   baseQuery,
//   tagTypes: ['User', 'Topic', 'Quiz', 'QuizAttempt', 'LearningPath'], // 👈 Ensure 'Quiz' & 'QuizAttempt' are here
//   endpoints: (builder) => ({}),
// });


import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// In development, this will be an empty string, using the proxy.
// In production, this will be your Render backend URL.
const BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL });

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User', 'Topic', 'Quiz', 'QuizAttempt', 'LearningPath'],
  endpoints: (builder) => ({}),
});