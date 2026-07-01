import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import { Login, Register } from './pages/Auth/AuthPages';
import Feed from './pages/Feed/Feed';
import Profile from './pages/Profile/Profile';
import Jobs from './pages/Jobs/Jobs';
import Messages from './pages/Messages/Messages';
import Groups from './pages/Groups/Groups';
import Events from './pages/Events/Events';
import AdminDashboard from './pages/Admin/AdminDashboard';
import './App.css';

const PrivateRoute = ({ component: Component }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? Component : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/feed" element={<PrivateRoute component={<Feed />} />} />
        <Route path="/profile/:userId" element={<PrivateRoute component={<Profile />} />} />
        <Route path="/jobs" element={<PrivateRoute component={<Jobs />} />} />
        <Route path="/messages" element={<PrivateRoute component={<Messages />} />} />
        <Route path="/groups" element={<PrivateRoute component={<Groups />} />} />
        <Route path="/events" element={<PrivateRoute component={<Events />} />} />
        <Route path="/admin" element={<PrivateRoute component={<AdminDashboard />} />} />
        <Route path="/" element={<Navigate to="/feed" />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
