import React from 'react';
import { Link } from 'react-router-dom';
import { Story } from '../../types';

interface Props { story: Story; }

const CATEGORY_COLORS: Record<string, string> = {
  Fantasy: 'bg-purple-100 text-purple-700',
  Romance: 'bg-pink-100 text-pink-700',
  Horror:  'bg-red-100 text-red-700',
  Mystery: 'bg-yellow-100 text-yellow-700',
  Action:  'bg-blue-100 text-blue-700',
  Webtoon: 'bg-green-100 text-green-700',
};

const StoryCard: React.FC<Props> = ({ story }) => {
  const author = typeof story.author === 'object' ? story.author.username : 'Unknown';

  return (
    <Link to={`/story/${story._id}`} className="group block">
      <div className="bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group-hover:-translate-y-1">
        <div className="h-48 bg-gray-100 flex items-center justify-center">
          {story.cover_image ? (
            <img src={story.cover_image} alt={story.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-400 text-5xl font-bold">{story.title[0]}</span>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${CATEGORY_COLORS[story.category] || 'bg-gray-100 text-gray-700'}`}>
              {story.category}
            </span>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>👁 {story.views}</span>
              <span>❤️ {story.likes.length}</span>
            </div>
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2 group-hover:text-primary transition">
            {story.title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{story.description}</p>
          <p className="text-xs text-gray-400">by <span className="text-primary font-medium">{author}</span></p>
        </div>
      </div>
    </Link>
  );
};

export default StoryCard;
