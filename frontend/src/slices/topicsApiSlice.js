import { apiSlice } from './apiSlice.js';
const TOPICS_URL = '/api/topics';
const AI_URL = '/api/ai';

export const topicsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTopics: builder.query({
      query: () => ({
        url: TOPICS_URL,
        method: 'GET',
      }),
      providesTags: ['Topic'],
    }),
    generateQuiz: builder.query({
      query: (topicName) => ({
        url: `${AI_URL}/generate-quiz/${topicName}`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) => [{ type: 'Quiz', id: arg }],
    }),
    submitQuiz: builder.mutation({
      query: (data) => ({
        url: '/api/submit', // 👈 This is the corrected line
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetTopicsQuery,
  useGenerateQuizQuery,
  useSubmitQuizMutation,
} = topicsApiSlice;