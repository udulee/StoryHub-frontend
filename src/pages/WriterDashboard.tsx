import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchMyStories, removeStory, editStory } from '../redux/slices/storySlice';
import { downloadWriterReport } from '../services/api';
import { Story } from '../types';

const CATEGORY_COLORS: Record<string, string> = {
  Fantasy: '#6C63FF', Romance: '#FF6584', Horror: '#e94560',
  Mystery: '#3498db', Action: '#f39c12', Webtoon: '#00b09b',
};

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: '#13131f', border: '1.5px solid #3A3A55',
  borderRadius: '8px', padding: '10px 12px',
  color: '#fff', fontSize: '13px', outline: 'none', fontFamily: 'inherit',
};

const WriterDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { myStories, isLoading } = useAppSelector(s => s.story);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm,  setEditForm]  = useState({ title: '', description: '', status: 'draft' });
  const [downloading, setDownloading] = useState(false);

  useEffect(() => { dispatch(fetchMyStories()); }, [dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this story? This cannot be undone.')) {
      dispatch(removeStory(id));
    }
  };

  const startEdit = (story: Story) => {
    setEditingId(story._id);
    setEditForm({ title: story.title, description: story.description, status: story.status });
  };

  const handleEditSave = (id: string) => {
    dispatch(editStory({ id, data: editForm }));
    setEditingId(null);
  };

  const handleDownloadReport = async () => {
    setDownloading(true);
    try {
      const res = await downloadWriterReport();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'writer-report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch { /* ignore */ }
    setDownloading(false);
  };

  const published  = myStories.filter(s => s.status === 'published').length;
  const totalViews = myStories.reduce((sum, s) => sum + s.views, 0);
  const totalLikes = myStories.reduce((sum, s) => sum + s.likes.length, 0);

  return (
    <div style={{ background: '#1C1C28', minHeight: '100vh', padding: '40px 20px', color: '#fff' }}>
      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{ color: '#FF6740', fontWeight: 700, fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 6px' }}>
              ✦ Writer Studio
            </p>
            <h1 style={{ fontSize: '28px', fontWeight: 900, margin: 0 }}>Writer Dashboard</h1>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={handleDownloadReport}
              disabled={downloading}
              style={{
                background: '#2A2A3D', color: '#aaa',
                border: '1px solid #3A3A55', padding: '10px 18px',
                borderRadius: '10px', cursor: 'pointer',
                fontSize: '13px', fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF6740'; e.currentTarget.style.color = '#FF6740'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#3A3A55'; e.currentTarget.style.color = '#aaa'; }}
            >
              {downloading ? '⏳ Downloading…' : '📥 Download Report'}
            </button>
            <Link
              to="/writer/create"
              style={{
                background: 'linear-gradient(135deg, #FF6740, #e94560)',
                color: '#fff', textDecoration: 'none',
                padding: '10px 20px', borderRadius: '10px',
                fontSize: '13px', fontWeight: 800,
                boxShadow: '0 4px 16px rgba(255,103,64,0.35)',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}
            >
              + Create Story
            </Link>
          </div>
        </div>

        {/* ── Stats Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '36px' }}>
          {[
            { label: 'Total Stories', value: myStories.length, icon: '📚', color: '#6C63FF' },
            { label: 'Published',     value: published,         icon: '✅', color: '#4CAF50' },
            { label: 'Total Views',   value: totalViews.toLocaleString(), icon: '👁',  color: '#3498db' },
            { label: 'Total Likes',   value: totalLikes.toLocaleString(), icon: '❤️', color: '#e94560' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: '#2A2A3D', borderRadius: '14px',
              padding: '24px', textAlign: 'center',
              border: '1px solid #3A3A55',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'default',
              position: 'relative', overflow: 'hidden',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 24px rgba(0,0,0,0.3)`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
            >
              <div style={{
                position: 'absolute', top: '-20px', right: '-20px',
                width: '80px', height: '80px',
                background: `${stat.color}15`, borderRadius: '50%',
              }} />
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '12px', color: '#6B6B8A', marginTop: '4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Stories List ── */}
        <div style={{ background: '#2A2A3D', borderRadius: '16px', overflow: 'hidden', border: '1px solid #3A3A55' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #3A3A55', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>My Stories</h2>
            <span style={{ fontSize: '12px', color: '#6B6B8A' }}>{myStories.length} stories</span>
          </div>

          {isLoading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#6B6B8A' }}>
              <div style={{ width: '36px', height: '36px', border: '3px solid #FF6740', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ margin: 0, fontSize: '14px' }}>Loading stories…</p>
            </div>
          ) : myStories.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 40px', color: '#6B6B8A' }}>
              <p style={{ fontSize: '52px', marginBottom: '16px' }}>✍️</p>
              <p style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: '#fff' }}>No stories yet</p>
              <p style={{ marginBottom: '24px', fontSize: '14px' }}>Start writing your first story today</p>
              <Link
                to="/writer/create"
                style={{
                  background: '#FF6740', color: '#fff', textDecoration: 'none',
                  padding: '12px 24px', borderRadius: '10px',
                  fontWeight: 800, fontSize: '14px',
                  display: 'inline-block',
                }}
              >
                + Create First Story
              </Link>
            </div>
          ) : (
            <div>
              {myStories.map((story, idx) => {
                const catColor = CATEGORY_COLORS[story.category] || '#6C63FF';
                return (
                  <div
                    key={story._id}
                    style={{
                      padding: '20px 24px',
                      borderBottom: idx < myStories.length - 1 ? '1px solid #3A3A55' : 'none',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
                  >
                    {editingId === story._id ? (
                      /* Edit Mode */
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <input
                          value={editForm.title}
                          onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                          style={inputStyle}
                          placeholder="Story title"
                        />
                        <textarea
                          value={editForm.description}
                          onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                          style={{ ...inputStyle, resize: 'none' }}
                          rows={2}
                          placeholder="Description"
                        />
                        <select
                          value={editForm.status}
                          onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                          style={{ ...inputStyle, width: 'auto', cursor: 'pointer' }}
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button
                            onClick={() => handleEditSave(story._id)}
                            style={{
                              background: '#FF6740', color: '#fff',
                              padding: '9px 20px', borderRadius: '8px',
                              border: 'none', cursor: 'pointer',
                              fontWeight: 700, fontSize: '13px',
                            }}
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            style={{
                              background: 'transparent', border: '1px solid #3A3A55',
                              color: '#aaa', padding: '9px 20px',
                              borderRadius: '8px', cursor: 'pointer',
                              fontWeight: 600, fontSize: '13px',
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* View Mode */
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                        {/* Category color strip */}
                        <div style={{
                          width: '4px', minHeight: '60px', borderRadius: '2px',
                          background: catColor, flexShrink: 0,
                          alignSelf: 'stretch',
                        }} />

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                            <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: '#fff' }}>
                              {story.title}
                            </h3>
                            <span style={{
                              fontSize: '10px', padding: '2px 8px', borderRadius: '20px',
                              fontWeight: 700, textTransform: 'uppercase',
                              background: story.status === 'published' ? 'rgba(76,175,80,0.15)' : 'rgba(255,193,7,0.15)',
                              color: story.status === 'published' ? '#4CAF50' : '#FFC107',
                              border: `1px solid ${story.status === 'published' ? '#4CAF5044' : '#FFC10744'}`,
                            }}>
                              {story.status}
                            </span>
                            <span style={{
                              fontSize: '10px', padding: '2px 8px', borderRadius: '20px',
                              background: `${catColor}22`, color: catColor,
                              fontWeight: 700,
                            }}>
                              {story.category}
                            </span>
                          </div>

                          {story.description && (
                            <p style={{
                              color: '#8888A8', fontSize: '13px', margin: '0 0 8px',
                              lineHeight: 1.5,
                              overflow: 'hidden', display: '-webkit-box',
                              WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                            }}>
                              {story.description}
                            </p>
                          )}

                          <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#6B6B8A' }}>
                            <span>👁 {story.views}</span>
                            <span>❤️ {story.likes.length}</span>
                            <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                          <Link
                            to={`/story/${story._id}`}
                            style={{
                              color: '#aaa', textDecoration: 'none', fontSize: '12px',
                              fontWeight: 600, padding: '7px 12px',
                              border: '1px solid #3A3A55', borderRadius: '8px',
                              transition: 'border-color 0.15s, color 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#3A3A55'; e.currentTarget.style.color = '#aaa'; }}
                          >
                            View
                          </Link>
                          <button
                            onClick={() => startEdit(story)}
                            style={{
                              color: '#aaa', background: 'transparent',
                              border: '1px solid #3A3A55', borderRadius: '8px',
                              cursor: 'pointer', padding: '7px 12px',
                              fontSize: '12px', fontWeight: 600,
                              transition: 'border-color 0.15s, color 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#6C63FF'; e.currentTarget.style.color = '#6C63FF'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#3A3A55'; e.currentTarget.style.color = '#aaa'; }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(story._id)}
                            style={{
                              color: '#e94560', background: 'transparent',
                              border: '1px solid rgba(233,69,96,0.3)',
                              borderRadius: '8px', cursor: 'pointer',
                              padding: '7px 12px', fontSize: '12px', fontWeight: 600,
                              transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(233,69,96,0.1)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WriterDashboard;
