import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { problems } from '../data/problems';

function ProblemList({ setSelectedProblem }) {
  const [solvedProblems, setSolvedProblems] = useState([]);

  useEffect(() => {
    const fetchSolvedProblems = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(`${apiUrl}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setSolvedProblems(response.data.solvedProblems || []);
        }
      } catch (err) {
        console.error('Failed to fetch solved problems:', err);
      }
    };
    fetchSolvedProblems();
  }, []);

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Problems</h3>
      <ul>
        {problems.map(problem => (
          <li
            key={problem.id}
            className="problem-list-item flex justify-between items-center"
            onClick={() => setSelectedProblem(problem)}
          >
            <Link to={`/problem/${problem.id}`}>{problem.title}</Link>
            {solvedProblems.includes(problem.id) && (
              <span className="text-green-500 text-sm">✅</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProblemList;