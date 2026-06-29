import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { logout } from '../redux/slices/authSlice';
import { updateProfile } from '../services/api';
import { useNavigate } from 'react-router-dom';

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: '#13131f', border: '1.5px solid #3A3A55',
  borderRadius: '10px', padding: '13px 14px',
  color: '#fff', fontSize: '14px', outline: 'none',
  transition: 'border-color 0.2s',
  fontFamily: 'inherit',
};

const labelStyle: React.CSSProperties = {
  display: 'block', marginBottom: '7px',
  fontSize: '12px', color: '#8888A8',
  fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
};

const ProfilePage: React.FC = () => {
  const { user }  = useAppSelector(s => s.auth);
  const dispatch  = useAppDispatch();
  const navigate  = useNavigate();
  const [form,    setForm]    = useState({ username: user?.username || '', bio: user?.bio || '' });
  const [success, setSuccess] = useState('');
  const [error,   setError]   = useState('');
  const [saving,  setSaving]  = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await updateProfile(form);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const roleColors: Record<string, string> = {
    writer: '#6C63FF',
    reader: '#FF6740',
    admin:  '#4CAF50',
  };
  const roleColor = roleColors[user?.role || 'reader'] || '#FF6740';

  return (
    <div style={{ background: '#1C1C28', minHeight: '100vh', padding: '48px 20px', color: '#fff' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>

        {/* ── Profile Header Card ── */}
        <div style={{
          background: 'linear-gradient(135deg, #13131f 0%, #1e1e30 100%)',
          borderRadius: '18px', padding: '32px', marginBottom: '24px',
          border: '1px solid #2A2A3D', textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Decorative glow */}
          <div style={{
            position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)',
            width: '200px', height: '200px',
            background: `radial-gradient(circle, ${roleColor}22 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />

          {/* Avatar */}
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: `linear-gradient(135deg, ${roleColor}, ${roleColor}88)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', fontWeight: 800, margin: '0 auto 16px',
            boxShadow: `0 8px 24px ${roleColor}44`,
            position: 'relative',
          }}>
            {user?.username?.[0]?.toUpperCase() || '?'}
          </div>

          <h1 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 6px' }}>
            {user?.username}
          </h1>
          <p style={{ color: '#8888A8', margin: '0 0 12px', fontSize: '14px' }}>
            {user?.email}
          </p>

          <span style={{
            fontSize: '11px', fontWeight: 800, textTransform: 'uppercase',
            letterSpacing: '0.1em', padding: '5px 14px', borderRadius: '20px',
            background: `${roleColor}22`, color: roleColor, border: `1px solid ${roleColor}44`,
          }}>
            {user?.role}
          </span>
        </div>

        {/* ── Edit Profile Card ── */}
        <div style={{ background: '#2A2A3D', borderRadius: '18px', padding: '30px', marginBottom: '16px', border: '1px solid #3A3A55' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 24px', color: '#fff' }}>
            Edit Profile
          </h2>

          {success && (
            <div style={{
              background: 'rgba(76,175,80,0.1)', border: '1px solid rgba(76,175,80,0.3)',
              color: '#4CAF50', padding: '12px 14px', borderRadius: '10px',
              marginBottom: '20px', fontSize: '13px', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              ✓ {success}
            </div>
          )}
          {error && (
            <div style={{
              background: 'rgba(233,69,96,0.1)', border: '1px solid rgba(233,69,96,0.3)',
              color: '#e94560', padding: '12px 14px', borderRadius: '10px',
              marginBottom: '20px', fontSize: '13px', fontWeight: 600,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Username</label>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                style={inputStyle}
                placeholder="Your username"
                onFocus={e => e.currentTarget.style.borderColor = '#FF6740'}
                onBlur={e => e.currentTarget.style.borderColor = '#3A3A55'}
              />
            </div>

            <div>
              <label style={labelStyle}>Bio</label>
              <textarea
                value={form.bio}
                onChange={e => setForm({ ...form, bio: e.target.value })}
                rows={4}
                style={{ ...inputStyle, resize: 'none' }}
                placeholder="Tell readers about yourself..."
                onFocus={e => e.currentTarget.style.borderColor = '#FF6740'}
                onBlur={e => e.currentTarget.style.borderColor = '#3A3A55'}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                padding: '13px', background: saving ? '#3A3A55' : '#FF6740',
                color: '#fff', border: 'none', borderRadius: '10px',
                fontWeight: 800, cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '14px', transition: 'background 0.2s, transform 0.1s',
                boxShadow: saving ? 'none' : '0 4px 16px rgba(255,103,64,0.3)',
              }}
              onMouseEnter={e => { if (!saving) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {saving ? 'Saving…' : '✓ Save Changes'}
            </button>
          </form>
        </div>

        {/* ── Logout ── */}
        <button
          onClick={handleLogout}
          style={{
            width: '100%', padding: '13px',
            background: 'transparent',
            border: '1.5px solid rgba(233,69,96,0.4)',
            color: '#e94560', borderRadius: '10px',
            fontWeight: 700, cursor: 'pointer', fontSize: '14px',
            transition: 'background 0.2s, border-color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(233,69,96,0.08)'; e.currentTarget.style.borderColor = '#e94560'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(233,69,96,0.4)'; }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
