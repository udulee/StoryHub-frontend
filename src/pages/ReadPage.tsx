import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getChapters, getChapterById } from '../services/api';
import { Chapter } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ReadPage: React.FC = () => {
  const { storyId, chapterId } = useParams<{ storyId: string; chapterId: string }>();
  const navigate = useNavigate();

  const [chapter,  setChapter]  = useState<Chapter | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [chRes, chsRes] = await Promise.all([getChapterById(chapterId!), getChapters(storyId!)]);
        setChapter(chRes.data);
        setChapters(chsRes.data);
        window.scrollTo(0, 0);
      } catch (err) {
        console.error("Failed to load chapter:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [chapterId, storyId]);

  if (loading) return <LoadingSpinner />;
  if (!chapter) return <div className="text-center py-20">Chapter not found</div>;

  const idx     = chapters.findIndex(c => c._id === chapterId);
  const prevCh  = idx > 0 ? chapters[idx - 1] : null;
  const nextCh  = idx < chapters.length - 1 ? chapters[idx + 1] : null;

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      {/* Reading toolbar */}
      <div className={`sticky top-16 z-40 shadow-md py-3 px-4 flex items-center justify-between ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <Link to={`/story/${storyId}`} className="text-primary hover:underline text-sm">← Back to Story</Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button onClick={() => setFontSize(f => Math.max(12, f - 2))} className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-bold flex items-center justify-center">A-</button>
            <span className="text-xs text-gray-500">{fontSize}px</span>
            <button onClick={() => setFontSize(f => Math.min(24, f + 2))} className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-bold flex items-center justify-center">A+</button>
          </div>
          <button onClick={() => setDarkMode(d => !d)} className={`px-3 py-1 rounded-full text-sm font-medium ${darkMode ? 'bg-yellow-400 text-dark' : 'bg-dark text-white'}`}>
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-extrabold mb-2">Chapter {chapter.chapter_number}</h1>
        {chapter.chapter_title && <h2 className="text-xl text-primary font-semibold mb-8">{chapter.chapter_title}</h2>}
        <div className="leading-relaxed whitespace-pre-wrap" style={{ fontSize: `${fontSize}px`, lineHeight: 1.9 }}>
          {chapter.content}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
          {prevCh ? (
            <button onClick={() => navigate(`/read/${storyId}/chapter/${prevCh._id}`)}
              className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
              ← Chapter {prevCh.chapter_number}
            </button>
          ) : <div />}
          {nextCh && (
            <button onClick={() => navigate(`/read/${storyId}/chapter/${nextCh._id}`)}
              className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
              Chapter {nextCh.chapter_number} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadPage;
