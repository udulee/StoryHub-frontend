import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { logout } from '../../redux/slices/authSlice';

const Navbar: React.FC = () => {
  const { user } = useAppSelector(s => s.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
    navigate('/');
  };

  return (
    <nav style={{ background: '#13131F', borderBottom: '1px solid #2A2A3D', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', fontSize: '22px', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#FF6740' }}>✦</span> StoryHub
          </Link>

          {/* Desktop Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }} className="hidden md:flex">
            <Link to="/" style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px', fontWeight: 600, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#aaa'}>Home</Link>
            {user?.role === 'writer' && (
              <Link to="/writer" style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px', fontWeight: 600, transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#aaa'}>Dashboard</Link>
            )}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Link to="/profile" style={{ color: '#FF6740', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>
                  @{user.username}
                </Link>
                <button onClick={handleLogout} style={{ background: '#2A2A3D', color: '#fff', border: '1px solid #3A3A55', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#3A3A55'} onMouseLeave={e => e.currentTarget.style.background = '#2A2A3D'}>
                  Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Link to="/login" style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px', fontWeight: 600, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#aaa'}>Login</Link>
                <Link to="/register" style={{ background: '#FF6740', color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: 700, padding: '8px 18px', borderRadius: '20px', boxShadow: '0 4px 12px rgba(255,103,64,0.3)' }}>
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger / Menu toggle button for Mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className="md:hidden"
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div style={{ background: '#13131F', borderBottom: '1px solid #2A2A3D', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }} className="md:hidden">
          <Link to="/" onClick={() => setIsOpen(false)} style={{ color: '#fff', textDecoration: 'none', fontSize: '15px', fontWeight: 600 }}>Home</Link>
          {user?.role === 'writer' && (
            <Link to="/writer" onClick={() => setIsOpen(false)} style={{ color: '#fff', textDecoration: 'none', fontSize: '15px', fontWeight: 600 }}>Dashboard</Link>
          )}
          {user ? (
            <>
              <Link to="/profile" onClick={() => setIsOpen(false)} style={{ color: '#FF6740', textDecoration: 'none', fontSize: '15px', fontWeight: 700 }}>
                @{user.username} (Profile)
              </Link>
              <button onClick={handleLogout} style={{ background: '#2A2A3D', color: '#fff', border: '1px solid #3A3A55', padding: '10px', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', textAlign: 'center' }}>
                Logout
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/login" onClick={() => setIsOpen(false)} style={{ color: '#fff', textDecoration: 'none', fontSize: '15px', fontWeight: 600 }}>Login</Link>
              <Link to="/register" onClick={() => setIsOpen(false)} style={{ background: '#FF6740', color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 700, padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
