import { apiSlice } from './apiSlice.js';
const TOPICS_URL = '/api/topics';
const AI_URL = '/api/ai';
const QUIZZES_URL = '/api/quizzes';

export const topicsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTopics: builder.query({
      query: () => ({ url: TOPICS_URL }),
      providesTags: ['Topic'],
    }),
    generateQuiz: builder.query({
      query: (topicName) => ({
        url: `${AI_URL}/generate-quiz/${topicName}`,
      }),
      providesTags: (result, error, arg) => [{ type: 'Quiz', id: arg }],
    }),
    submitQuiz: builder.mutation({
      query: (data) => ({
        url: `${QUIZZES_URL}/submit`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['QuizAttempt'],
    }),
    getMyQuizAttempts: builder.query({
      query: () => ({
        url: `${QUIZZES_URL}/my-attempts`, // Correctly builds /api/quizzes/my-attempts
      }),
      providesTags: ['QuizAttempt'],
    }),
  }),
});

export const {
  useGetTopicsQuery,
  useGenerateQuizQuery,
  useSubmitQuizMutation,
  useGetMyQuizAttemptsQuery,
} = topicsApiSlice;