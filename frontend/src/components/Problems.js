import React from 'react';
import { Link } from 'react-router-dom';
import { problems } from '../data/problems';

function Problems() {
  return (
    <div className="max-w-5xl mx-auto mt-8 p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Coding Problems</h2>
      <p className="text-gray-600 mb-6 text-center">
        Choose from 100 coding problems to test and improve your programming skills.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {problems.map(problem => (
              <tr key={problem.id} className="border-b hover:bg-blue-50 transition">
                <td className="p-4 text-gray-700">{problem.id}</td>
                <td className="p-4 text-gray-700">{problem.title}</td>
                <td className="p-4">
                  <Link
                    to={`/problem/${problem.id}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Solve
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Problems;