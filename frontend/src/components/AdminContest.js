import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { problems } from '../data/problems';

function AdminContest() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    problemIds: [],
    startTime: '',
    endTime: '',
  });
  const [contests, setContests] = useState([]);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProblemToggle = (problemId) => {
    setFormData({
      ...formData,
      problemIds: formData.problemIds.includes(problemId)
        ? formData.problemIds.filter(id => id !== problemId)
        : [...formData.problemIds, problemId],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      await axios.post(`${apiUrl}/api/contests/create`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setIsModalOpen(false);
      setFormData({ title: '', description: '', problemIds: [], startTime: '', endTime: '' });
      // Refresh contests
      const response = await axios.get(`${apiUrl}/api/contests`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setContests(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create contest');
    }
  };

  return (
    <div className="container mx-auto mt-8 p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Manage Contests</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition-all duration-300"
      >
        Create New Contest
      </button>

      {/* Modal for Contest Creation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl transform transition-all duration-300 scale-95">
            <h3 className="text-2xl font-bold mb-4 text-blue-600">Create Contest</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  rows="4"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">Problems</label>
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto p-2 border rounded-lg">
                  {problems.map(problem => (
                    <div key={problem.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.problemIds.includes(problem.id)}
                        onChange={() => handleProblemToggle(problem.id)}
                        className="mr-2 h-5 w-5 text-blue-600"
                      />
                      <span className="text-gray-700">{problem.title}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">Start Time</label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">End Time</label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:from-blue-600 hover:to-blue-800 transition"
                >
                  Create Contest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <h3 className="text-2xl font-bold mb-4">Existing Contests</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {contests.map(contest => (
          <div key={contest._id} className="card p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition">
            <h4 className="font-bold text-lg text-blue-600">{contest.title}</h4>
            <p className="text-gray-600">{contest.description.substring(0, 100)}...</p>
            <p><strong>Problems:</strong> {contest.problemIds.join(', ')}</p>
            <p><strong>Start:</strong> {new Date(contest.startTime).toLocaleString()}</p>
            <p><strong>End:</strong> {new Date(contest.endTime).toLocaleString()}</p>
            <p><strong>Created By:</strong> {contest.createdBy.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminContest;