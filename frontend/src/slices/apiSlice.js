// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// const baseQuery = fetchBaseQuery({ baseUrl: '' });

// export const apiSlice = createApi({
//   baseQuery,
//   tagTypes: ['User', 'Topic', 'Quiz'], // 👈 Add 'Quiz' here
//   endpoints: (builder) => ({}),
// });

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({ baseUrl: '' });

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User', 'Topic', 'Quiz', 'QuizAttempt'], // 👈 Ensure 'Quiz' & 'QuizAttempt' are here
  endpoints: (builder) => ({}),
});