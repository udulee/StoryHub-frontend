import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { login, clearError } from '../redux/slices/authSlice';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, token } = useAppSelector(s => s.auth);

  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => { if (token) navigate('/'); }, [token, navigate]);
  useEffect(() => { return () => { dispatch(clearError()); }; }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login(form));
  };

  return (
    <div style={{ background: '#1C1C28', minHeight: '100vh', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#2A2A3D', borderRadius: '14px', width: '100%', maxWidth: '400px', padding: '30px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 8px' }}>Welcome Back</h1>
          <p style={{ color: '#8888A8' }}>Login to StoryHub</p>
        </div>
        {error && <div style={{ background: 'rgba(255,103,64,0.1)', color: '#FF6740', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#aaa' }}>Email</label>
            <input
              type="email" required
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: '#1C1C28', border: '1.5px solid #3A3A55',
                borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none'
              }}
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#aaa' }}>Password</label>
            <input
              type="password" required
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: '#1C1C28', border: '1.5px solid #3A3A55',
                borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none'
              }}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit" disabled={isLoading}
            style={{
              padding: '12px', background: '#FF6740', color: '#fff', border: 'none', borderRadius: '8px',
              fontWeight: 700, cursor: 'pointer', fontSize: '14px', marginTop: '8px'
            }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={{ textAlign: 'center', fontSize: '13px', color: '#6B6B8A', marginTop: '20px' }}>
          Don't have an account? <Link to="/register" style={{ color: '#FF6740', textDecoration: 'none', fontWeight: 600 }}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
