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
    <div style={{ background: '#1C1C28', minHeight: '100vh', padding: '40px 20px', color: '#fff' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', background: '#2A2A3D', borderRadius: '14px', padding: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ width: '64px', height: '64px', background: '#FF6740', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700 }}>
            {user?.username[0].toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, margin: '0' }}>{user?.username}</h1>
            <span style={{ fontSize: '12px', background: 'rgba(255,103,64,0.2)', color: '#FF6740', padding: '4px 10px', borderRadius: '20px', textTransform: 'capitalize' }}>{user?.role}</span>
          </div>
        </div>
        {success && <div style={{ background: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>{success}</div>}
        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#aaa' }}>Username</label>
            <input type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value})}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: '#1C1C28', border: '1.5px solid #3A3A55',
                borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none'
              }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#aaa' }}>Bio</label>
            <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} rows={4}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: '#1C1C28', border: '1.5px solid #3A3A55',
                borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none', resize: 'none'
              }}
              placeholder="Tell readers about yourself..." />
          </div>
          <button type="submit" style={{ padding: '12px', background: '#FF6740', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>
            Save Changes
          </button>
        </form>
        <button onClick={() => { dispatch(logout()); navigate('/'); }}
          style={{ width: '100%', marginTop: '16px', background: 'transparent', border: '1.5px solid #FF6740', color: '#FF6740', padding: '12px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
