import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { addStory } from '../redux/slices/storySlice';
import { createChapter } from '../services/api';

const CATEGORIES = ['Fantasy', 'Romance', 'Horror', 'Mystery', 'Action', 'Webtoon'];

const CreateStoryPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [story, setStory] = useState({ title: '', description: '', category: 'Fantasy' });
  const [chapter, setChapter] = useState({ chapter_title: 'Chapter 1', content: '' });
  const [step, setStep]   = useState(1);
  const [storyId, setStoryId] = useState('');
  const [saving, setSaving]   = useState(false);

  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const result = await dispatch(addStory(story));
    if (addStory.fulfilled.match(result)) {
      setStoryId(result.payload._id);
      setStep(2);
    }
    setSaving(false);
  };

  const handleCreateChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await createChapter({ story_id: storyId, chapter_number: 1, chapter_title: chapter.chapter_title, content: chapter.content });
    navigate(`/story/${storyId}`);
  };

  return (
    <div style={{ background: '#1C1C28', minHeight: '100vh', padding: '40px 20px', color: '#fff' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px', justifyContent: 'center' }}>
          {[1, 2].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, background: step >= s ? '#FF6740' : '#3A3A55', color: '#fff' }}>{s}</div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: step >= s ? '#fff' : '#6B6B8A' }}>{s === 1 ? 'Story Info' : 'First Chapter'}</span>
              {s < 2 && <span style={{ color: '#3A3A55', marginLeft: '10px' }}>→</span>}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div style={{ background: '#2A2A3D', borderRadius: '14px', padding: '30px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px' }}>Create New Story</h1>
            <form onSubmit={handleCreateStory} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#aaa' }}>Story Title *</label>
                <input type="text" required value={story.title} onChange={e => setStory({...story, title: e.target.value})}
                  style={{ width: '100%', boxSizing: 'border-box', background: '#1C1C28', border: '1.5px solid #3A3A55', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none' }}
                  placeholder="Enter story title..." />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#aaa' }}>Description</label>
                <textarea rows={4} value={story.description} onChange={e => setStory({...story, description: e.target.value})}
                  style={{ width: '100%', boxSizing: 'border-box', background: '#1C1C28', border: '1.5px solid #3A3A55', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none', resize: 'none' }}
                  placeholder="What is your story about?" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#aaa' }}>Category</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {CATEGORIES.map(cat => (
                    <button type="button" key={cat} onClick={() => setStory({...story, category: cat})}
                      style={{ padding: '10px', borderRadius: '8px', border: story.category === cat ? '1.5px solid #FF6740' : '1.5px solid #3A3A55', background: story.category === cat ? 'rgba(255,103,64,0.1)' : 'transparent', color: story.category === cat ? '#FF6740' : '#aaa', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" disabled={saving}
                style={{ padding: '12px', background: '#FF6740', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '14px', marginTop: '8px' }}>
                {saving ? 'Creating...' : 'Continue →'}
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div style={{ background: '#2A2A3D', borderRadius: '14px', padding: '30px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>Add First Chapter</h1>
            <p style={{ fontSize: '13px', color: '#8888A8', marginBottom: '24px' }}>You can add more chapters from the dashboard later.</p>
            <form onSubmit={handleCreateChapter} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#aaa' }}>Chapter Title</label>
                <input type="text" value={chapter.chapter_title} onChange={e => setChapter({...chapter, chapter_title: e.target.value})}
                  style={{ width: '100%', boxSizing: 'border-box', background: '#1C1C28', border: '1.5px solid #3A3A55', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#aaa' }}>Content *</label>
                <textarea required rows={12} value={chapter.content} onChange={e => setChapter({...chapter, content: e.target.value})}
                  style={{ width: '100%', boxSizing: 'border-box', background: '#1C1C28', border: '1.5px solid #3A3A55', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none', resize: 'none' }}
                  placeholder="Write your story here..." />
              </div>
              <button type="submit" disabled={saving}
                style={{ padding: '12px', background: '#FF6740', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '14px', marginTop: '8px' }}>
                {saving ? 'Publishing...' : '🚀 Publish Story'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateStoryPage;
