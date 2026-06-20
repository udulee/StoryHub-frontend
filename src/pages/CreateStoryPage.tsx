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
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Step indicator */}
      <div className="flex items-center gap-4 mb-8">
        {[1, 2].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>{s}</div>
            <span className="text-sm font-medium text-gray-600">{s === 1 ? 'Story Info' : 'First Chapter'}</span>
            {s < 2 && <span className="text-gray-300 ml-2">→</span>}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-dark mb-6">Create New Story</h1>
          <form onSubmit={handleCreateStory} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Story Title *</label>
              <input type="text" required value={story.title} onChange={e => setStory({...story, title: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                placeholder="Enter story title..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea rows={4} value={story.description} onChange={e => setStory({...story, description: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none resize-none"
                placeholder="What is your story about?" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <div className="grid grid-cols-3 gap-3">
                {CATEGORIES.map(cat => (
                  <button type="button" key={cat} onClick={() => setStory({...story, category: cat})}
                    className={`py-2 px-3 rounded-xl border-2 font-medium text-sm transition ${story.category === cat ? 'border-primary bg-indigo-50 text-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={saving}
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-60">
              {saving ? 'Creating...' : 'Continue →'}
            </button>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-dark mb-2">Add First Chapter</h1>
          <p className="text-gray-500 text-sm mb-6">You can add more chapters from the dashboard later.</p>
          <form onSubmit={handleCreateChapter} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chapter Title</label>
              <input type="text" value={chapter.chapter_title} onChange={e => setChapter({...chapter, chapter_title: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
              <textarea required rows={12} value={chapter.content} onChange={e => setChapter({...chapter, content: e.target.value})}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none resize-none"
                placeholder="Write your story here..." />
            </div>
            <button type="submit" disabled={saving}
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-60">
              {saving ? 'Publishing...' : '🚀 Publish Story'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateStoryPage;
