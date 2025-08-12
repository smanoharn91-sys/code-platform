import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        const response = await axios.get(`${apiUrl}/api/leaderboard`);
        setLeaderboard(response.data);
      } catch (err) {
        setError('Failed to load leaderboard');
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="container mx-auto mt-8 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Leaderboard</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
            <th className="p-3 text-left">Rank</th>
            <th className="p-3 text-left">Username</th>
            <th className="p-3 text-left">Problems Solved</th>
            <th className="p-3 text-left">Streak (Days)</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry) => (
            <tr key={entry.rank} className="border-b hover:bg-gray-50 transition">
              <td className="p-3">{entry.rank}</td>
              <td className="p-3">{entry.username}</td>
              <td className="p-3">{entry.solvedProblems}</td>
              <td className="p-3">{entry.streak}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;