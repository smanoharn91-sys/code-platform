import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ContestList() {
  const [contests, setContests] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        const response = await axios.get(`${apiUrl}/api/contests`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setContests(response.data);
      } catch (err) {
        setError('Failed to load contests');
      }
    };
    fetchContests();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-8 p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Contests</h2>
      {error && <p className="text-red-500 mb-6 text-center">{error}</p>}
      {contests.length === 0 ? (
        <p className="text-gray-600 text-center">No contests available.</p>
      ) : (
        <div className="grid gap-6">
          {contests.map(contest => (
            <div key={contest._id} className="p-6 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition">
              <h3 className="text-xl font-bold mb-2 text-gray-800">{contest.title}</h3>
              <p className="text-gray-600 mb-2">{contest.description}</p>
              <p className="text-gray-600 mb-1"><strong>Problems:</strong> {contest.problemIds.join(', ')}</p>
              <p className="text-gray-600 mb-1"><strong>Start:</strong> {new Date(contest.startTime).toLocaleString()}</p>
              <p className="text-gray-600 mb-2"><strong>End:</strong> {new Date(contest.endTime).toLocaleString()}</p>
              <p className="text-gray-600 mb-3"><strong>Created By:</strong> {contest.createdBy.username}</p>
              <Link
                to={`/problem/${contest.problemIds[0]}`}
                className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Start Contest
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ContestList;