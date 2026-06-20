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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-dark">Writer Dashboard</h1>
        <div className="flex gap-3">
          <button onClick={handleDownloadReport}
            className="bg-green-500 text-white px-5 py-2 rounded-xl font-semibold hover:bg-green-600 transition text-sm">
            📥 Download Report PDF
          </button>
          <Link to="/writer/create" className="bg-primary text-white px-5 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition text-sm">
            + Create Story
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Stories', value: myStories.length, icon: '📚' },
          { label: 'Published',     value: published,         icon: '✅' },
          { label: 'Total Views',   value: totalViews,        icon: '👁' },
          { label: 'Total Likes',   value: totalLikes,        icon: '❤️' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl shadow p-5 text-center">
            <div className="text-3xl mb-1">{stat.icon}</div>
            <div className="text-2xl font-extrabold text-dark">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Stories Table */}
      {isLoading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-dark">My Stories</h2>
          </div>
          {myStories.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-5xl mb-4">✍️</p>
              <p>No stories yet. <Link to="/writer/create" className="text-primary hover:underline">Create your first story!</Link></p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {myStories.map(story => (
                <div key={story._id} className="p-6">
                  {editingId === story._id ? (
                    <div className="space-y-3">
                      <input value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary outline-none" />
                      <textarea value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 resize-none focus:ring-2 focus:ring-primary outline-none" rows={2} />
                      <select value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})}
                        className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary outline-none">
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditSave(story._id)} className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-semibold">Save</button>
                        <button onClick={() => setEditingId(null)} className="border border-gray-300 px-4 py-2 rounded-xl text-sm">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-dark text-lg">{story.title}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${story.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {story.status}
                          </span>
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{story.category}</span>
                        </div>
                        <p className="text-gray-500 text-sm line-clamp-2">{story.description}</p>
                        <div className="flex gap-4 mt-2 text-xs text-gray-400">
                          <span>👁 {story.views}</span>
                          <span>❤️ {story.likes.length}</span>
                          <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Link to={`/story/${story._id}`} className="text-indigo-500 hover:text-indigo-700 text-sm font-medium px-3 py-2 rounded-lg hover:bg-indigo-50">View</Link>
                        <button onClick={() => startEdit(story)} className="text-blue-500 hover:text-blue-700 text-sm font-medium px-3 py-2 rounded-lg hover:bg-blue-50">Edit</button>
                        <button onClick={() => handleDelete(story._id)} className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-2 rounded-lg hover:bg-red-50">Delete</button>
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
  );
};

export default WriterDashboard;
