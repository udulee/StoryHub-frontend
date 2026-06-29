import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { addStory } from '../redux/slices/storySlice';
import { createChapter } from '../services/api';

const CATEGORIES = [
  { name: 'Fantasy', icon: '🔮' },
  { name: 'Romance', icon: '💖' },
  { name: 'Horror',  icon: '💀' },
  { name: 'Mystery', icon: '🔍' },
  { name: 'Action',  icon: '⚡' },
  { name: 'Webtoon', icon: '🎨' },
];

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: '#13131f', border: '1.5px solid #3A3A55',
  borderRadius: '10px', padding: '13px 14px',
  color: '#fff', fontSize: '14px', outline: 'none',
  transition: 'border-color 0.2s', fontFamily: 'inherit',
};

const labelStyle: React.CSSProperties = {
  display: 'block', marginBottom: '8px',
  fontSize: '12px', color: '#8888A8',
  fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
};

const CreateStoryPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [story,   setStory]   = useState({ title: '', description: '', category: 'Fantasy' });
  const [chapter, setChapter] = useState({ chapter_title: 'Chapter 1', content: '' });
  const [step,    setStep]    = useState(1);
  const [storyId, setStoryId] = useState('');
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');

  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const result = await dispatch(addStory(story));
    if (addStory.fulfilled.match(result)) {
      setStoryId(result.payload._id);
      setStep(2);
    } else {
      setError((result.payload as string) || 'Failed to create story. Please try again.');
    }
    setSaving(false);
  };

  const handleCreateChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await createChapter({
        story_id: storyId,
        chapter_number: 1,
        chapter_title: chapter.chapter_title,
        content: chapter.content,
      });
      navigate(`/story/${storyId}`);
    } catch {
      setError('Failed to save chapter. Please try again.');
      setSaving(false);
    }
  };

  return (
    <div style={{ background: '#1C1C28', minHeight: '100vh', padding: '48px 20px', color: '#fff' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>

        {/* ── Page title ── */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <p style={{ color: '#FF6740', fontWeight: 700, fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 8px' }}>
            ✦ Writer Studio
          </p>
          <h1 style={{ fontSize: '28px', fontWeight: 900, margin: 0 }}>
            {step === 1 ? 'Create New Story' : 'Add First Chapter'}
          </h1>
        </div>

        {/* ── Step Indicator ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', marginBottom: '36px' }}>
          {[
            { n: 1, label: 'Story Info' },
            { n: 2, label: 'First Chapter' },
          ].map(({ n, label }, i) => (
            <React.Fragment key={n}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', fontWeight: 800,
                  background: step >= n ? '#FF6740' : '#2A2A3D',
                  color: '#fff',
                  boxShadow: step >= n ? '0 4px 12px rgba(255,103,64,0.4)' : 'none',
                  transition: 'all 0.3s',
                }}>
                  {step > n ? '✓' : n}
                </div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: step >= n ? '#fff' : '#6B6B8A' }}>
                  {label}
                </span>
              </div>
              {i < 1 && (
                <div style={{
                  flex: 1, height: '2px', margin: '0 16px',
                  background: step > 1 ? '#FF6740' : '#2A2A3D',
                  transition: 'background 0.4s',
                  maxWidth: '80px',
                }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {error && (
          <div style={{
            background: 'rgba(233,69,96,0.1)', border: '1px solid rgba(233,69,96,0.3)',
            color: '#e94560', padding: '12px 16px', borderRadius: '10px',
            marginBottom: '24px', fontSize: '13px', fontWeight: 600,
          }}>
            ⚠ {error}
          </div>
        )}

        {/* ── Step 1: Story Details ── */}
        {step === 1 && (
          <div style={{ background: '#2A2A3D', borderRadius: '18px', padding: '32px', border: '1px solid #3A3A55' }}>
            <form onSubmit={handleCreateStory} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div>
                <label style={labelStyle}>Story Title *</label>
                <input
                  type="text" required
                  value={story.title}
                  onChange={e => setStory({ ...story, title: e.target.value })}
                  style={inputStyle}
                  placeholder="Enter your story title…"
                  onFocus={e => e.currentTarget.style.borderColor = '#FF6740'}
                  onBlur={e => e.currentTarget.style.borderColor = '#3A3A55'}
                />
              </div>

              <div>
                <label style={labelStyle}>Description</label>
                <textarea
                  rows={4}
                  value={story.description}
                  onChange={e => setStory({ ...story, description: e.target.value })}
                  style={{ ...inputStyle, resize: 'none' }}
                  placeholder="What is your story about?"
                  onFocus={e => e.currentTarget.style.borderColor = '#FF6740'}
                  onBlur={e => e.currentTarget.style.borderColor = '#3A3A55'}
                />
              </div>

              <div>
                <label style={labelStyle}>Category</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {CATEGORIES.map(cat => (
                    <button
                      type="button" key={cat.name}
                      onClick={() => setStory({ ...story, category: cat.name })}
                      style={{
                        padding: '12px 8px', borderRadius: '10px',
                        border: story.category === cat.name ? '1.5px solid #FF6740' : '1.5px solid #3A3A55',
                        background: story.category === cat.name ? 'rgba(255,103,64,0.12)' : '#13131f',
                        color: story.category === cat.name ? '#FF6740' : '#8888A8',
                        fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                        transition: 'all 0.2s',
                      }}
                    >
                      <span style={{ fontSize: '20px' }}>{cat.icon}</span>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit" disabled={saving}
                style={{
                  padding: '14px',
                  background: saving ? '#3A3A55' : 'linear-gradient(135deg, #FF6740, #e94560)',
                  color: '#fff', border: 'none', borderRadius: '10px',
                  fontWeight: 800, cursor: saving ? 'not-allowed' : 'pointer',
                  fontSize: '15px', marginTop: '4px',
                  boxShadow: saving ? 'none' : '0 6px 20px rgba(255,103,64,0.35)',
                  transition: 'all 0.2s',
                }}
              >
                {saving ? 'Creating…' : 'Continue → Add First Chapter'}
              </button>
            </form>
          </div>
        )}

        {/* ── Step 2: First Chapter ── */}
        {step === 2 && (
          <div style={{ background: '#2A2A3D', borderRadius: '18px', padding: '32px', border: '1px solid #3A3A55' }}>
            <p style={{ color: '#8888A8', fontSize: '13px', margin: '0 0 24px' }}>
              Add your first chapter. You can add more from the Writer Dashboard later.
            </p>
            <form onSubmit={handleCreateChapter} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div>
                <label style={labelStyle}>Chapter Title</label>
                <input
                  type="text"
                  value={chapter.chapter_title}
                  onChange={e => setChapter({ ...chapter, chapter_title: e.target.value })}
                  style={inputStyle}
                  placeholder="e.g. Chapter 1 — The Beginning"
                  onFocus={e => e.currentTarget.style.borderColor = '#FF6740'}
                  onBlur={e => e.currentTarget.style.borderColor = '#3A3A55'}
                />
              </div>

              <div>
                <label style={labelStyle}>Content *</label>
                <textarea
                  required rows={14}
                  value={chapter.content}
                  onChange={e => setChapter({ ...chapter, content: e.target.value })}
                  style={{
                    ...inputStyle, resize: 'vertical', minHeight: '280px',
                    lineHeight: 1.7, fontFamily: 'Georgia, serif',
                  }}
                  placeholder="Write your story here…"
                  onFocus={e => e.currentTarget.style.borderColor = '#FF6740'}
                  onBlur={e => e.currentTarget.style.borderColor = '#3A3A55'}
                />
                <p style={{ fontSize: '11px', color: '#6B6B8A', margin: '6px 0 0', textAlign: 'right' }}>
                  {chapter.content.length} characters
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    flex: 1, padding: '13px',
                    background: 'transparent', border: '1.5px solid #3A3A55',
                    color: '#aaa', borderRadius: '10px',
                    fontWeight: 700, cursor: 'pointer', fontSize: '14px',
                  }}
                >
                  ← Back
                </button>
                <button
                  type="submit" disabled={saving}
                  style={{
                    flex: 2, padding: '13px',
                    background: saving ? '#3A3A55' : 'linear-gradient(135deg, #6C63FF, #FF6740)',
                    color: '#fff', border: 'none', borderRadius: '10px',
                    fontWeight: 800, cursor: saving ? 'not-allowed' : 'pointer',
                    fontSize: '15px',
                    boxShadow: saving ? 'none' : '0 6px 20px rgba(108,99,255,0.35)',
                  }}
                >
                  {saving ? 'Publishing…' : '🚀 Publish Story'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateStoryPage;
