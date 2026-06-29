import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getChapters, getChapterById } from '../services/api';
import { Chapter } from '../types';

const ReadPage: React.FC = () => {
  const { storyId, chapterId } = useParams<{ storyId: string; chapterId: string }>();
  const navigate = useNavigate();

  const [chapter,  setChapter]  = useState<Chapter | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [fontSize, setFontSize] = useState(17);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [chRes, chsRes] = await Promise.all([getChapterById(chapterId!), getChapters(storyId!)]);
        setChapter(chRes.data);
        setChapters(chsRes.data);
        window.scrollTo(0, 0);
      } catch (err) {
        console.error('Failed to load chapter:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [chapterId, storyId]);

  const bg   = darkMode ? '#0f0f17' : '#faf9f7';
  const text = darkMode ? '#e8e6df' : '#1a1a1a';
  const sub  = darkMode ? '#8888A8' : '#666';
  const card = darkMode ? '#1C1C28' : '#fff';
  const border = darkMode ? '#2A2A3D' : '#e5e5e5';

  if (loading) return (
    <div style={{ background: bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: sub }}>
        <div style={{ width: '40px', height: '40px', border: `3px solid #FF6740`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ fontSize: '14px' }}>Loading chapter…</p>
      </div>
    </div>
  );

  if (!chapter) return (
    <div style={{ background: bg, minHeight: '100vh', color: text, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
      <p style={{ fontSize: '48px' }}>📖</p>
      <p style={{ fontSize: '18px', fontWeight: 700 }}>Chapter not found</p>
      <Link to={`/story/${storyId}`} style={{ color: '#FF6740', textDecoration: 'none', fontWeight: 600 }}>← Back to Story</Link>
    </div>
  );

  const idx    = chapters.findIndex(c => c._id === chapterId);
  const prevCh = idx > 0 ? chapters[idx - 1] : null;
  const nextCh = idx < chapters.length - 1 ? chapters[idx + 1] : null;

  return (
    <div style={{ background: bg, minHeight: '100vh', color: text, transition: 'background 0.3s, color 0.3s' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* ── Sticky Reading Toolbar ── */}
      <div style={{
        position: 'sticky', top: '64px', zIndex: 40,
        background: card, borderBottom: `1px solid ${border}`,
        padding: '10px 20px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
      }}>
        <Link to={`/story/${storyId}`} style={{
          color: '#FF6740', textDecoration: 'none', fontSize: '13px',
          fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          ← Back to Story
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Font size control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setFontSize(f => Math.max(12, f - 2))}
              style={{ width: '30px', height: '30px', background: darkMode ? '#2A2A3D' : '#f0f0f0', border: 'none', borderRadius: '6px', color: text, fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}
            >A-</button>
            <span style={{ fontSize: '12px', color: sub, minWidth: '36px', textAlign: 'center' }}>{fontSize}px</span>
            <button
              onClick={() => setFontSize(f => Math.min(26, f + 2))}
              style={{ width: '30px', height: '30px', background: darkMode ? '#2A2A3D' : '#f0f0f0', border: 'none', borderRadius: '6px', color: text, fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}
            >A+</button>
          </div>

          {/* Dark/Light toggle */}
          <button
            onClick={() => setDarkMode(d => !d)}
            style={{
              padding: '6px 14px', borderRadius: '20px', border: 'none',
              background: darkMode ? '#FF6740' : '#1C1C28',
              color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>

      {/* ── Chapter Content ── */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Chapter header */}
        <div style={{ marginBottom: '40px', paddingBottom: '24px', borderBottom: `1px solid ${border}` }}>
          <p style={{ fontSize: '12px', color: '#FF6740', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 8px' }}>
            Chapter {chapter.chapter_number} of {chapters.length}
          </p>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 6px', lineHeight: 1.2 }}>
            {chapter.chapter_title || `Chapter ${chapter.chapter_number}`}
          </h1>
          {/* Progress bar */}
          <div style={{ marginTop: '16px', background: border, borderRadius: '4px', height: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${((idx + 1) / chapters.length) * 100}%`, height: '100%', background: '#FF6740', borderRadius: '4px', transition: 'width 0.3s' }} />
          </div>
          <p style={{ fontSize: '11px', color: sub, margin: '6px 0 0', textAlign: 'right' }}>
            {idx + 1} / {chapters.length} chapters
          </p>
        </div>

        {/* Story content */}
        <div style={{
          fontSize: `${fontSize}px`, lineHeight: 1.95,
          color: text, whiteSpace: 'pre-wrap',
          fontFamily: 'Georgia, "Times New Roman", serif',
          letterSpacing: '0.01em',
        }}>
          {chapter.content}
        </div>

        {/* ── Chapter Navigation ── */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: '60px', paddingTop: '28px', borderTop: `1px solid ${border}`,
          gap: '12px',
        }}>
          {prevCh ? (
            <button
              onClick={() => navigate(`/read/${storyId}/chapter/${prevCh._id}`)}
              style={{
                background: darkMode ? '#2A2A3D' : '#f0f0f0',
                color: text, border: `1px solid ${border}`,
                padding: '12px 20px', borderRadius: '10px',
                fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}
            >
              ← Chapter {prevCh.chapter_number}
            </button>
          ) : <div />}

          {nextCh && (
            <button
              onClick={() => navigate(`/read/${storyId}/chapter/${nextCh._id}`)}
              style={{
                background: '#FF6740', color: '#fff', border: 'none',
                padding: '12px 24px', borderRadius: '10px',
                fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px',
                boxShadow: '0 4px 16px rgba(255,103,64,0.35)',
              }}
            >
              Chapter {nextCh.chapter_number} →
            </button>
          )}
        </div>

        {/* Table of contents mini */}
        {chapters.length > 1 && (
          <div style={{ marginTop: '40px', background: darkMode ? '#1C1C28' : '#f5f5f5', borderRadius: '12px', padding: '20px', border: `1px solid ${border}` }}>
            <p style={{ fontWeight: 700, marginBottom: '12px', fontSize: '13px', color: sub, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              All Chapters
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {chapters.map((ch, i) => (
                <Link
                  key={ch._id}
                  to={`/read/${storyId}/chapter/${ch._id}`}
                  style={{
                    padding: '8px 12px', borderRadius: '8px', textDecoration: 'none',
                    fontSize: '13px', fontWeight: ch._id === chapterId ? 700 : 500,
                    color: ch._id === chapterId ? '#FF6740' : sub,
                    background: ch._id === chapterId ? 'rgba(255,103,64,0.08)' : 'transparent',
                    display: 'flex', alignItems: 'center', gap: '10px',
                  }}
                >
                  <span style={{ fontSize: '11px', color: '#FF6740', minWidth: '20px' }}>{i + 1}</span>
                  {ch.chapter_title || `Chapter ${ch.chapter_number}`}
                  {ch._id === chapterId && <span style={{ marginLeft: 'auto', fontSize: '10px' }}>← Reading</span>}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadPage;
