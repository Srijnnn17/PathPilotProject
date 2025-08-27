// import { apiSlice } from './apiSlice.js';
// const TOPICS_URL = '/api/topics';
// const AI_URL = '/api/ai';
// const QUIZZES_URL = '/api/quizzes';

// export const topicsApiSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     getTopics: builder.query({
//       query: () => ({ url: TOPICS_URL }),
//       providesTags: ['Topic'],
//     }),


//     // generateQuiz: builder.query({
//     //   query: (topicName) => ({
//     //     url: `${AI_URL}/generate-quiz/${topicName}`,
//     //   }),
//     //   // 👇 This line makes each quiz cache unique and solves the bug
//     //   providesTags: (result, error, arg) => [{ type: 'Quiz', id: arg }],
//     // })

//     generateQuiz: builder.query({
//       query: topicName => ({ url: `${AI_URL}/generate-quiz/${topicName}` }),
//       // Drop cache as soon as the query is unused
//       keepUnusedDataFor: 0,
//     })

    
//     ,
//     submitQuiz: builder.mutation({
//       query: (data) => ({
//         url: `${QUIZZES_URL}/submit`,
//         method: 'POST',
//         body: data,
//       }),
//       invalidatesTags: ['QuizAttempt'], // This will be used for the dashboard later
//     }),
//      getMyQuizAttempts: builder.query({
//         query: () => ({
//             url: `${QUIZZES_URL}/my-attempts`
//         }),
//         providesTags: ['QuizAttempt'],
//     }),
//   }),
// });

// export const {
//   useGetTopicsQuery,
//   useGenerateQuizQuery,
//   useSubmitQuizMutation,
//   useGetMyQuizAttemptsQuery,
// } = topicsApiSlice;


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
      query: (topicId) => ({
        url: `${AI_URL}/generate-quiz/${topicId}`,
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
        url: `${QUIZZES_URL}/my-attempts`
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