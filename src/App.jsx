import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import './css/style.css';
import './charts/ChartjsConfig';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import ActivityDashboard from './pages/ActivityDashboard';
import TeamDashboard from './pages/TeamDashboard';
import EditActivity from './pages/EditActivity';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto';
    window.scroll({ top: 0 });
    document.querySelector('html').style.scrollBehavior = '';
  }, [location.pathname]);

  useEffect(() => {
    const token = Cookies.get('token');
    const role = Cookies.get('role');
    if (token && (location.pathname === '/' || location.pathname === '/login')) {
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/user', { replace: true });
      }
    }
  }, [location.pathname, navigate]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/activity" element={<ActivityDashboard />} />
        <Route path="/team" element={<TeamDashboard />} />
        <Route path="/edit" element={<EditActivity />} />
      </Routes>
    </>
  );
}

export default App;
