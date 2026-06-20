import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchStories } from '../redux/slices/storySlice';
import StoryCard from '../components/story/StoryCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CATEGORIES = ['All', 'Fantasy', 'Romance', 'Horror', 'Mystery', 'Action', 'Webtoon'];

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stories, isLoading } = useAppSelector(s => s.story);
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const params: Record<string, string> = {};
    if (search)            params.search   = search;
    if (category !== 'All') params.category = category;
    dispatch(fetchStories(params));
  }, [dispatch, search, category]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="bg-white rounded-3xl p-10 mb-10 text-center shadow-sm border border-gray-100">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          Welcome to <span className="text-primary">StoryHub</span>
        </h1>
        <p className="text-gray-500 text-lg mb-6">Discover novels, webtoons & short stories</p>
        <input
          type="text"
          placeholder="Search stories..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-lg px-5 py-3 rounded-full border border-gray-200 text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-3 flex-wrap mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-5 py-2 rounded-full font-medium text-sm transition ${
              category === cat
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Stories Grid */}
      {isLoading ? <LoadingSpinner /> : (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {category === 'All' ? 'All Stories' : category} ({stories.length})
          </h2>
          {stories.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-6xl mb-4">📚</p>
              <p className="text-xl">No stories found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {stories.map(story => <StoryCard key={story._id} story={story} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
