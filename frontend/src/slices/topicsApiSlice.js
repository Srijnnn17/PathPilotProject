import { apiSlice } from './apiSlice.js';

const TOPICS_URL = '/api/topics';
const QUIZZES_URL = '/api/quizzes';

export const topicsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTopics: builder.query({
      query: () => ({ url: TOPICS_URL }),
      providesTags: ['Topic'],
    }),

    // ✅ FIXED: Changed to Mutation (POST) to match backend route
    generateQuiz: builder.mutation({
      query: (topicName) => ({
        url: `${TOPICS_URL}/generate-quiz/${topicName}`,
        method: 'POST', // Now matches router.post()
      }),
      // Invalidating tags here is optional depending on if you store quizzes immediately
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
        url: `${QUIZZES_URL}/my-attempts`, 
      }),
      providesTags: ['QuizAttempt'],
    }),

    // ✅ FIXED: Already correct (POST), ensures body data (score) is sent
    generateAiPath: builder.mutation({
      query: ({ topicName, score, total }) => ({
        url: `${TOPICS_URL}/generate-path/${topicName}`,
        method: 'POST', 
        body: { score, total },
      }),
    }),
  }),
});

// ✅ EXPORT UPDATED HOOKS
// Note: useGenerateQuizQuery changed to useGenerateQuizMutation
export const {
  useGetTopicsQuery,
  useGenerateQuizMutation, // <--- Updated Name
  useSubmitQuizMutation,
  useGetMyQuizAttemptsQuery,
  useGenerateAiPathMutation,
} = topicsApiSlice;