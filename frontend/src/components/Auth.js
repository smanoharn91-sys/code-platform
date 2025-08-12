import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const getUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');
  const response = await axios.get(`${apiUrl}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};