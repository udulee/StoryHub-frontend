import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchStoryById } from '../redux/slices/storySlice';
import { getChapters, getComments, createComment, deleteComment, toggleLike, downloadStoryPDF } from '../services/api';
import { Chapter, Comment } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PDFViewer from '../components/common/PDFViewer';

const StoryDetailPage: React.FC = () => {
  const { id }       = useParams<{ id: string }>();
  const dispatch     = useAppDispatch();
  const navigate     = useNavigate();
  const { currentStory, isLoading } = useAppSelector(s => s.story);
  const { user }     = useAppSelector(s => s.auth);

  const [chapters,    setChapters]   = useState<Chapter[]>([]);
  const [comments,    setComments]   = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [liked,       setLiked]      = useState(false);
  const [likeCount,   setLikeCount]  = useState(0);
  const [pdfBlobUrl,   setPdfBlobUrl]  = useState<string | null>(null);
  const [isViewingPDF, setIsViewingPDF] = useState(false);
  const [pdfLoading,   setPdfLoading]  = useState(false);
  const [pdfError,     setPdfError]    = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchStoryById(id));
      getChapters(id).then(r => setChapters(r.data));
      getComments(id).then(r => setComments(r.data));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentStory && user) {
      setLiked(currentStory.likes.includes(user._id));
      setLikeCount(currentStory.likes.length);
    }
  }, [currentStory, user]);

  const handleLike = async () => {
    if (!user) { navigate('/login'); return; }
    const res = await toggleLike(id!);
    setLiked(res.data.liked);
    setLikeCount(res.data.total_likes);
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (!commentText.trim()) return;
    const res = await createComment({ story_id: id, comment_text: commentText });
    setComments([res.data, ...comments]);
    setCommentText('');
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment(commentId);
    setComments(comments.filter(c => c._id !== commentId));
  };

  const handleViewPDF = async () => {
    setPdfError(null);
    if (!pdfBlobUrl) {
      setPdfLoading(true);
      try {
        // axios responseType:'blob' already returns a Blob — do NOT wrap in new Blob([])
        const res = await downloadStoryPDF(id!);
        const url = window.URL.createObjectURL(res.data as Blob);
        setPdfBlobUrl(url);
      } catch (err: any) {
        setPdfError(err?.response?.data?.message || 'Failed to load PDF. Please try again.');
        setPdfLoading(false);
        return;
      } finally {
        setPdfLoading(false);
      }
    }
    setIsViewingPDF(true);
  };

  const handleDownloadPDF = async () => {
    setPdfError(null);
    setPdfLoading(true);
    try {
      // axios responseType:'blob' already returns a Blob — do NOT wrap in new Blob([])
      const res = await downloadStoryPDF(id!);
      const url = window.URL.createObjectURL(res.data as Blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${currentStory?.title || 'story'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setPdfError(err?.response?.data?.message || 'Failed to download PDF. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!currentStory) return <div className="text-center py-20">Story not found</div>;

  const author = typeof currentStory.author === 'object' ? currentStory.author : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Cover + Info */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8">
        <div className="h-64 bg-gradient-to-r from-dark to-primary flex items-center justify-center">
          <h1 className="text-4xl font-extrabold text-white text-center px-8">{currentStory.title}</h1>
        </div>
        <div className="p-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-purple-100 text-purple-700 text-sm font-semibold px-3 py-1 rounded-full">{currentStory.category}</span>
            <span className="text-gray-400 text-sm">👁 {currentStory.views} views</span>
            <span className="text-gray-400 text-sm">❤️ {likeCount} likes</span>
          </div>
          {author && <p className="text-gray-500 mb-4">by <span className="text-primary font-semibold">{author.username}</span></p>}
          <p className="text-gray-700 leading-relaxed mb-6">{currentStory.description}</p>
          <div className="flex gap-3 flex-wrap">
            {chapters.length > 0 && (
              <Link to={`/read/${id}/chapter/${chapters[0]._id}`}
                className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
                Start Reading
              </Link>
            )}
            <button onClick={handleLike}
              className={`px-6 py-3 rounded-xl font-semibold border-2 transition ${liked ? 'bg-red-500 text-white border-red-500' : 'border-gray-300 text-gray-600 hover:border-red-400'}`}>
              {liked ? '❤️ Liked' : '🤍 Like'}
            </button>
            {user && (
              <button
                onClick={handleViewPDF}
                disabled={pdfLoading}
                className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {pdfLoading ? '⏳ Loading…' : '📖 View PDF'}
              </button>
            )}
            {user && (
              <button
                onClick={handleDownloadPDF}
                disabled={pdfLoading}
                className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {pdfLoading ? '⏳ Loading…' : '📥 Download PDF'}
              </button>
            )}
            {pdfError && (
              <p className="w-full text-red-500 text-sm mt-2">{pdfError}</p>
            )}
          </div>
        </div>
      </div>

      {isViewingPDF && pdfBlobUrl && (
        <PDFViewer pdfUrl={pdfBlobUrl} onClose={() => setIsViewingPDF(false)} />
      )}

      {/* Chapters */}
      {chapters.length > 0 && (
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-dark mb-5">Chapters ({chapters.length})</h2>
          <div className="space-y-3">
            {chapters.map(ch => (
              <Link key={ch._id} to={`/read/${id}/chapter/${ch._id}`}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 hover:text-primary transition group">
                <span className="font-medium">Chapter {ch.chapter_number}: {ch.chapter_title}</span>
                <span className="text-gray-400 group-hover:text-primary">→</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Comments */}
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-dark mb-5">Comments ({comments.length})</h2>
        {user && (
          <form onSubmit={handleComment} className="mb-6">
            <textarea value={commentText} onChange={e => setCommentText(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 resize-none focus:ring-2 focus:ring-primary outline-none"
              rows={3} placeholder="Write a comment..." />
            <button type="submit" className="mt-2 bg-primary text-white px-5 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition text-sm">
              Post Comment
            </button>
          </form>
        )}
        <div className="space-y-4">
          {comments.map(c => (
            <div key={c._id} className="flex gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-bold shrink-0">
                {c.user.username[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-dark">{c.user.username}</span>
                  <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-700 text-sm mt-1">{c.comment_text}</p>
              </div>
              {user?._id === c.user._id && (
                <button onClick={() => handleDeleteComment(c._id)} className="text-red-400 hover:text-red-600 text-xs">Delete</button>
              )}
            </div>
          ))}
          {comments.length === 0 && <p className="text-center text-gray-400 py-8">No comments yet. Be the first!</p>}
        </div>
      </div>
    </div>
  );
};

export default StoryDetailPage;
