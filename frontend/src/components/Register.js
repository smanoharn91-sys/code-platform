import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const response = await axios.post(`${apiUrl}/api/auth/register`, formData);
      localStorage.setItem('token', response.data.token);
      const user = JSON.parse(atob(response.data.token.split('.')[1]));
      navigate(user.role === 'admin' ? '/admin/contest' : '/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="container mx-auto mt-8 p-6 max-w-md bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Register</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white p-3 rounded-lg hover:from-blue-600 hover:to-blue-800 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;