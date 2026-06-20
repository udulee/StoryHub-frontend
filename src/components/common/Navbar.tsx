import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { logout } from '../../redux/slices/authSlice';

const Navbar: React.FC = () => {
  const { user } = useAppSelector(s => s.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => { dispatch(logout()); navigate('/'); };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link to="/" className="text-2xl font-bold text-primary tracking-tight">StoryHub</Link>
        <div className="hidden md:flex gap-8 items-center">
          <Link to="/" className="text-gray-600 hover:text-primary font-medium transition">Home</Link>
          {user?.role === 'writer' && (
            <Link to="/writer" className="text-gray-600 hover:text-primary font-medium transition">Dashboard</Link>
          )}
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="text-gray-600 hover:text-primary font-medium">{user.username}</Link>
              <button onClick={handleLogout} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 transition text-sm font-semibold">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link to="/login"    className="text-gray-600 hover:text-primary font-medium transition">Login</Link>
              <Link to="/register" className="bg-primary text-white px-5 py-2 rounded-full hover:bg-indigo-700 shadow-md hover:shadow-lg transition text-sm font-semibold">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
