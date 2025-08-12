import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ProblemList from './components/ProblemList';
import ProblemDetails from './components/ProblemDetails';
import Register from './components/Register';
import Login from './components/Login';
import Leaderboard from './components/Leaderboard';
import AdminContest from './components/AdminContest';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ContestPage from './components/ContestPage';
import './App.css';

function App() {
  const [selectedProblem, setSelectedProblem] = useState(null);

  const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/login" />;

    try {
      const user = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      if (user.exp < currentTime) {
        localStorage.removeItem('token');
        return <Navigate to="/login" />;
      }
      if (user.role === 'admin' && window.location.pathname !== '/admin/contest') {
        return <Navigate to="/admin/contest" />;
      }
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to={user.role === 'admin' ? '/admin/contest' : '/'} />;
      }
      return children;
    } catch (err) {
      localStorage.removeItem('token');
      return <Navigate to="/login" />;
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        
          <div className="main w-3/4 p-4">
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/leaderboard" element={<ProtectedRoute allowedRoles={['student']}><Leaderboard /></ProtectedRoute>} />
              <Route path="/admin/contest" element={<ProtectedRoute allowedRoles={['admin']}><AdminContest /></ProtectedRoute>} />
              <Route path="/problem/:id" element={<ProtectedRoute allowedRoles={['student']}><ProblemDetails /></ProtectedRoute>} />
              <Route path="/contest/:id" element={<ProtectedRoute allowedRoles={['student']}><ContestPage /></ProtectedRoute>} />
              <Route path="/" element={<ProtectedRoute allowedRoles={['student']}><Home /></ProtectedRoute>} />
            </Routes>
          </div>
        </div>
      
    </Router>
  );
}

export default App;