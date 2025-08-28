import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import store from './store'; 
import { Provider } from 'react-redux';
import App from './App.jsx';
import './index.css';
import HomeScreen from './screens/HomeScreen.jsx';
import LoginScreen from './screens/LoginScreen.jsx';
import RegisterScreen from './screens/RegisterScreen.jsx';
import TopicsScreen from './screens/TopicsScreen.jsx';
import QuizScreen from './screens/QuizScreen.jsx';
import DashboardScreen from './screens/DashboardScreen.jsx';
import LearningPathScreen from './screens/LearningPathScreen.jsx';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      <Route path='/topics' element={<TopicsScreen />} />
      <Route path='/quiz/:topicId' element={<QuizScreen />} /> {/* Corrected to topicId */}
      <Route path='/dashboard' element={<DashboardScreen />} />
      <Route path='/path/:topicId' element={<LearningPathScreen />} /> {/* 👈 This was the missing route */}
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);