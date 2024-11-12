import React, { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Profile from './pages/profile'
import Auth from './pages/auth'
import Chat from './pages/chat'
import { useAppStore } from './store'
import { apiClient } from './lib/api-client'
import { GET_USER_INFO } from './utils/constants'

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

const Main = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, {
          withCredentials: true,
        });
        if (response.status === 200 && response.data.id) {
          setUserInfo(response.data);
        } else {
          setUserInfo(undefined);
          navigate('/auth'); // Redirect to /auth on error
        }
      } catch (error) {
        console.error({ error });
        navigate('/auth'); // Redirect to /auth on error
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo, navigate]);

  if (loading) {
    return <div className=' text-center font-bold'>Loading....</div>;
  }

  return (
    <Routes>
      <Route path="/auth" element={
        <AuthRoute>
          <Auth />
        </AuthRoute>
      } />
      <Route path="/chat" element={
        <PrivateRoute>
          <Chat />
        </PrivateRoute>
      } />
      <Route path="/profile" element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      } />
      <Route path="*" element={<Navigate to="/auth" />} />
    </Routes>
  );
}

const App = () => (
  <BrowserRouter>
    <Main />
  </BrowserRouter>
);

export default App;
