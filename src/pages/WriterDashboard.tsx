import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchMyStories, removeStory, editStory } from '../redux/slices/storySlice';
import { downloadWriterReport } from '../services/api';
import { Story } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

const WriterDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { myStories, isLoading } = useAppSelector(s => s.story);
  const [editingId,  setEditingId]  = useState<string | null>(null);
  const [editForm,   setEditForm]   = useState({ title: '', description: '', status: 'draft' });

  useEffect(() => { dispatch(fetchMyStories()); }, [dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this story?')) dispatch(removeStory(id));
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
    const res = await downloadWriterReport();
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'my-report.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const published = myStories.filter(s => s.status === 'published').length;
  const totalViews = myStories.reduce((sum, s) => sum + s.views, 0);
  const totalLikes = myStories.reduce((sum, s) => sum + s.likes.length, 0);

  return (
    <div style={{ background: '#1C1C28', minHeight: '100vh', padding: '40px 20px', color: '#fff' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Writer Dashboard</h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handleDownloadReport}
              style={{ background: '#2A2A3D', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
              📥 Download Report PDF
            </button>
            <Link to="/writer/create" style={{ background: '#FF6740', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
              + Create Story
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {[
            { label: 'Total Stories', value: myStories.length, icon: '📚' },
            { label: 'Published',     value: published,         icon: '✅' },
            { label: 'Total Views',   value: totalViews,        icon: '👁' },
            { label: 'Total Likes',   value: totalLikes,        icon: '❤️' },
          ].map(stat => (
            <div key={stat.label} style={{ background: '#2A2A3D', borderRadius: '14px', padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontSize: '24px', fontWeight: 800 }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: '#6B6B8A' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Stories Table */}
        {isLoading ? <LoadingSpinner /> : (
          <div style={{ background: '#2A2A3D', borderRadius: '14px', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #3A3A55' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>My Stories</h2>
            </div>
            {myStories.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#6B6B8A' }}>
                <p style={{ fontSize: '48px', marginBottom: '16px' }}>✍️</p>
                <p>No stories yet. <Link to="/writer/create" style={{ color: '#FF6740', textDecoration: 'none', fontWeight: 600 }}>Create your first story!</Link></p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {myStories.map(story => (
                  <div key={story._id} style={{ padding: '20px', borderBottom: '1px solid #3A3A55' }}>
                    {editingId === story._id ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <input value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})}
                          style={{
                            width: '100%', boxSizing: 'border-box',
                            background: '#1C1C28', border: '1.5px solid #3A3A55',
                            borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none'
                          }} />
                        <textarea value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})}
                          style={{
                            width: '100%', boxSizing: 'border-box',
                            background: '#1C1C28', border: '1.5px solid #3A3A55',
                            borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none', resize: 'none'
                          }} rows={2} />
                        <select value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})}
                          style={{
                            background: '#1C1C28', border: '1.5px solid #3A3A55',
                            borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '14px', outline: 'none'
                          }}>
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button onClick={() => handleEditSave(story._id)} style={{ background: '#FF6740', color: '#fff', padding: '10px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Save</button>
                          <button onClick={() => setEditingId(null)} style={{ background: 'transparent', border: '1px solid #3A3A55', color: '#aaa', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>{story.title}</h3>
                            <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 700, background: story.status === 'published' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 193, 7, 0.2)', color: story.status === 'published' ? '#4CAF50' : '#FFC107' }}>
                              {story.status}
                            </span>
                            <span style={{ fontSize: '11px', background: '#3A3A55', padding: '2px 8px', borderRadius: '20px' }}>{story.category}</span>
                          </div>
                          <p style={{ color: '#8888A8', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>{story.description}</p>
                          <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '12px', color: '#6B6B8A' }}>
                            <span>👁 {story.views}</span>
                            <span>❤️ {story.likes.length}</span>
                            <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                          <Link to={`/story/${story._id}`} style={{ color: '#aaa', textDecoration: 'none', fontSize: '13px', fontWeight: 600, padding: '8px 12px', border: '1px solid #3A3A55', borderRadius: '8px' }}>View</Link>
                          <button onClick={() => startEdit(story)} style={{ color: '#aaa', background: 'transparent', border: '1px solid #3A3A55', borderRadius: '8px', cursor: 'pointer', padding: '8px 12px', fontSize: '13px', fontWeight: 600 }}>Edit</button>
                          <button onClick={() => handleDelete(story._id)} style={{ color: '#FF6740', background: 'transparent', border: '1px solid #3A3A55', borderRadius: '8px', cursor: 'pointer', padding: '8px 12px', fontSize: '13px', fontWeight: 600 }}>Delete</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WriterDashboard;
