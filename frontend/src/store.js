// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './slices/authSlice';
// import { apiSlice } from './slices/apiSlice';

// const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     [apiSlice.reducerPath]: apiSlice.reducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(apiSlice.middleware),
//   devTools: true,
// });

// export default store;


import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlice";
import authSliceReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    // Add the RTK-Query reducer to the store
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSliceReducer,
  },
  // The middleware from apiSlice handles data fetching, caching, etc.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;