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
import PathGenerationScreen from './screens/PathGenerationScreen.jsx';
import AiPathScreen from './screens/AiPathScreen.jsx'; // 👈 Import the new screen


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      <Route path='/topics' element={<TopicsScreen />} />
      <Route path='/quiz/:topicId' element={<QuizScreen />} />
      <Route path='/dashboard' element={<DashboardScreen />} />
      <Route path='/generate-path/:topicName' element={<PathGenerationScreen />} /> {/* 👈 This route is now active */}
      <Route path='/ai-path/:topicName' element={<AiPathScreen />} /> {/* 👈 Add this new route */}

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