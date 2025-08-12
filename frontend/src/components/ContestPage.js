import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { problems } from '../data/problems';

function ContestPage() {
  const { id } = useParams();
  const [contest, setContest] = useState(null);
  const [unlockedProblems, setUnlockedProblems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        const [contestResponse, unlockedResponse] = await Promise.all([
          axios.get(`${apiUrl}/api/contests/${id}`),
          axios.get(`${apiUrl}/api/code/unlocked/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
        ]);
        setContest(contestResponse.data);
        setUnlockedProblems(unlockedResponse.data.unlockedProblems || []);
      } catch (err) {
        setError('Failed to load contest or unlocked problems');
      }
    };
    fetchContest();
  }, [id]);

  if (!contest) return <div className="container mx-auto mt-8 p-6 text-center">{error || 'Loading...'}</div>;

  const contestProblems = problems.filter(p => contest.problemIds.includes(p.id));

  return (
    <div className="container mx-auto mt-8 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold mb-4 text-blue-600">{contest.title}</h2>
      <p className="mb-4 text-gray-700">{contest.description}</p>
      <p className="mb-2"><strong>Start:</strong> {new Date(contest.startTime).toLocaleString()}</p>
      <p className="mb-2"><strong>End:</strong> {new Date(contest.endTime).toLocaleString()}</p>
      <p className="mb-4"><strong>Created By:</strong> {contest.createdBy.username}</p>
      <h3 className="text-2xl font-bold mb-4">Problems</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {contestProblems.map((problem, index) => (
          <div key={problem.id} className="relative">
            {unlockedProblems.includes(problem.id) ? (
              <Link
                to={`/problem/${problem.id}?contestId=${contest._id}`}
                className="card p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition"
              >
                <h4 className="font-bold text-lg text-blue-600">{problem.title}</h4>
                <p className="text-gray-600">{problem.description.substring(0, 100)}...</p>
              </Link>
            ) : (
              <div className="card p-4 bg-gray-100 rounded-lg opacity-50 cursor-not-allowed">
                <h4 className="font-bold text-lg text-gray-500">{problem.title}</h4>
                <p className="text-gray-600">{problem.description.substring(0, 100)}...</p>
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Locked 🔒
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContestPage;