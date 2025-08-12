import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateUser = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = JSON.parse(atob(token.split('.')[1]));
          // Verify token isn't expired
          const currentTime = Math.floor(Date.now() / 1000);
          if (userData.exp > currentTime) {
            setUser(userData);
          } else {
            localStorage.removeItem('token');
            setUser(null);
          }
        } catch (err) {
          console.error('Error parsing token:', err);
          localStorage.removeItem('token');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    updateUser();
    // Re-run on route changes or token updates
    window.addEventListener('storage', updateUser);
    return () => window.removeEventListener('storage', updateUser);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-blue-700 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to={user?.role === 'admin' ? '/admin/contest' : '/'}
          className="text-2xl font-bold"
        >
          LeetCode Clone
        </Link>
        <div className="space-x-4">
          {user ? (
            <>
              <span className="text-sm">{user.username}</span>
              {user.role === 'admin' ? (
                <>
                  <Link to="/admin/contest" className="hover:underline">Create Contest</Link>
                  <button onClick={logout} className="hover:underline">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/" className="hover:underline">Home</Link>
                  <Link to="/leaderboard" className="hover:underline">Leaderboard</Link>
                  <button onClick={logout} className="hover:underline">Logout</button>
                </>
              )}
            </>
          ) : (
            <>
              <Link to="/register" className="hover:underline">Register</Link>
              <Link to="/login" className="hover:underline">Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;