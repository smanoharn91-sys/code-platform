import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { problems } from '../data/problems';

function Home() {
  const [contests, setContests] = useState([]);
  const [error, setError] = useState('');
  const [solvedProblems, setSolvedProblems] = useState([]);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        const response = await axios.get(`${apiUrl}/api/contests`);
        setContests(response.data);

        // Fetch user's solved problems
        const token = localStorage.getItem('token');
        if (token) {
          const userResponse = await axios.get(`${apiUrl}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setSolvedProblems(userResponse.data.solvedProblems || []);
        }
      } catch (err) {
        setError('Failed to load data');
      }
    };
    fetchContests();
  }, []);

  return (
    <div className="container mx-auto mt-8 p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Welcome to LeetCode Clone</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      
      <h3 className="text-2xl font-bold mb-4">Problems</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {problems.map(problem => (
          <Link key={problem.id} to={`/problem/${problem.id}`} className="card relative">
            <h4 className="font-bold text-lg text-blue-600">{problem.title}</h4>
            <p className="text-gray-600">{problem.description.substring(0, 100)}...</p>
            {solvedProblems.includes(problem.id) && (
              <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                Completed ✅
              </span>
            )}
          </Link>
        ))}
      </div>

      <h3 className="text-2xl font-bold mb-4">Contests</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {contests.map(contest => (
          <Link key={contest._id} to={`/contest/${contest._id}`} className="card">
            <h4 className="font-bold text-lg text-blue-600">{contest.title}</h4>
            <p className="text-gray-600">{contest.description.substring(0, 100)}...</p>
            <p><strong>Problems:</strong> {contest.problemIds.join(', ')}</p>
            <p><strong>Start:</strong> {new Date(contest.startTime).toLocaleString()}</p>
            <p><strong>End:</strong> {new Date(contest.endTime).toLocaleString()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;