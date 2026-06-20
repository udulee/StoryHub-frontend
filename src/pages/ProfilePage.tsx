import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { logout } from '../redux/slices/authSlice';
import { updateProfile } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user }  = useAppSelector(s => s.auth);
  const dispatch  = useAppDispatch();
  const navigate  = useNavigate();
  const [form,    setForm]    = useState({ username: user?.username || '', bio: user?.bio || '' });
  const [success, setSuccess] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(form);
    setSuccess('Profile updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-3xl text-white font-bold">
            {user?.username[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-dark">{user?.username}</h1>
            <span className="text-sm font-medium bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full capitalize">{user?.role}</span>
          </div>
        </div>
        {success && <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 mb-4 text-sm">{success}</div>}
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value})}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} rows={4}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none resize-none"
              placeholder="Tell readers about yourself..." />
          </div>
          <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
            Save Changes
          </button>
        </form>
        <button onClick={() => { dispatch(logout()); navigate('/'); }}
          className="w-full mt-4 border-2 border-red-300 text-red-500 py-3 rounded-xl font-semibold hover:bg-red-50 transition">
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
