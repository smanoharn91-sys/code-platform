import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { problems } from '../data/problems';
import CodeEditor from './CodeEditor';

function ProblemDetails() {
  const { id } = useParams();
  const problem = problems.find(p => p.id === parseInt(id));
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    const checkSolved = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(`${apiUrl}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsSolved(response.data.solvedProblems?.includes(parseInt(id)));
        }
      } catch (err) {
        console.error('Failed to check solved status:', err);
      }
    };
    checkSolved();
  }, [id]);

  if (!problem) return <div>Problem not found</div>;

  return (
    <div className="problem-container">
      <div className="problem-details">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          {problem.title}
          {isSolved && (
            <span className="ml-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              Completed ✅
            </span>
          )}
        </h2>
        <p className="mb-4">{problem.description}</p>
        <h3 className="text-lg font-bold mb-2">Test Cases</h3>
        {problem.testCases.map((test, index) => (
          <div key={index} className="test-case">
            <p><strong>Input:</strong> {test.input}</p>
            <p><strong>Output:</strong> {test.output}</p>
          </div>
        ))}
      </div>
      <div className="code-editor">
        <CodeEditor problem={problem} />
      </div>
    </div>
  );
}

export default ProblemDetails;