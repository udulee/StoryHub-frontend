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

  if (isLoading) return <div style={{ background: '#1C1C28', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LoadingSpinner /></div>;
  if (!currentStory) return <div style={{ background: '#1C1C28', minHeight: '100vh', color: '#fff', textAlign: 'center', padding: '80px 20px' }}>Story not found</div>;

  const author = typeof currentStory.author === 'object' ? currentStory.author : null;

  return (
    <div style={{ background: '#1C1C28', minHeight: '100vh', color: '#fff', padding: '40px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Cover + Info */}
        <div style={{ background: '#2A2A3D', borderRadius: '16px', overflow: 'hidden', marginBottom: '30px' }}>
          <div style={{ height: '240px', background: 'linear-gradient(135deg, #13131f 0%, #1e1e30 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '20px', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', background: 'rgba(255,103,64,0.15)', color: '#FF6740', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px' }}>
              {currentStory.category}
            </span>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>{currentStory.title}</h1>
            {author && <p style={{ color: '#8888A8', margin: 0, fontSize: '14px' }}>by <span style={{ color: '#FF6740', fontWeight: 600 }}>{author.username}</span></p>}
          </div>

          <div style={{ padding: '30px' }}>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', fontSize: '13px', color: '#8888A8' }}>
              <span>👁 {currentStory.views} views</span>
              <span>❤️ {likeCount} likes</span>
            </div>
            <p style={{ color: '#aaa', fontSize: '15px', lineHeight: 1.65, margin: '0 0 30px' }}>{currentStory.description}</p>
            
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {chapters.length > 0 && (
                <Link to={`/read/${id}/chapter/${chapters[0]._id}`}
                  style={{ background: '#FF6740', color: '#fff', textDecoration: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 700, fontSize: '14px' }}>
                  Start Reading
                </Link>
              )}
              <button onClick={handleLike}
                style={{
                  background: liked ? 'rgba(233,69,96,0.1)' : 'transparent',
                  border: liked ? '1.5px solid #e94560' : '1.5px solid #3A3A55',
                  color: liked ? '#e94560' : '#aaa',
                  padding: '12px 24px', borderRadius: '8px', fontWeight: 700, fontSize: '14px', cursor: 'pointer'
                }}>
                {liked ? '❤️ Liked' : '🤍 Like'}
              </button>
              {user && (
                <button
                  onClick={handleViewPDF}
                  disabled={pdfLoading}
                  style={{ background: '#6C63FF', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
                >
                  {pdfLoading ? '⏳ Loading…' : '📖 View PDF'}
                </button>
              )}
              {user && (
                <button
                  onClick={handleDownloadPDF}
                  disabled={pdfLoading}
                  style={{ background: '#4CAF50', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
                >
                  {pdfLoading ? '⏳ Loading…' : '📥 Download PDF'}
                </button>
              )}
              {pdfError && (
                <p style={{ width: '100%', color: '#e94560', fontSize: '13px', margin: '12px 0 0' }}>{pdfError}</p>
              )}
            </div>
          </div>
        </div>

        {isViewingPDF && pdfBlobUrl && (
          <PDFViewer pdfUrl={pdfBlobUrl} onClose={() => setIsViewingPDF(false)} />
        )}

        {/* Chapters */}
        {chapters.length > 0 && (
          <div style={{ background: '#2A2A3D', borderRadius: '16px', padding: '30px', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>Chapters ({chapters.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {chapters.map(ch => (
                <Link key={ch._id} to={`/read/${id}/chapter/${ch._id}`}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#1C1C28', border: '1.5px solid #3A3A55', borderRadius: '10px', color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 600, transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#FF6740'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#3A3A55'}>
                  <span>Chapter {ch.chapter_number}: {ch.chapter_title}</span>
                  <span style={{ color: '#FF6740' }}>→</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        <div style={{ background: '#2A2A3D', borderRadius: '16px', padding: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>Comments ({comments.length})</h2>
          {user && (
            <form onSubmit={handleComment} style={{ marginBottom: '24px' }}>
              <textarea value={commentText} onChange={e => setCommentText(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', background: '#1C1C28', border: '1.5px solid #3A3A55', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none', resize: 'none' }}
                rows={3} placeholder="Write a comment..." />
              <button type="submit" style={{ marginTop: '10px', background: '#FF6740', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                Post Comment
              </button>
            </form>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {comments.map(c => (
              <div key={c._id} style={{ display: 'flex', gap: '12px', padding: '16px', background: '#1C1C28', border: '1px solid #3A3A55', borderRadius: '10px' }}>
                <div style={{ width: '36px', height: '36px', background: '#FF6740', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, flexShrink: 0 }}>
                  {c.user.username[0].toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize: '14px' }}>{c.user.username}</span>
                    <span style={{ fontSize: '11px', color: '#6B6B8A' }}>{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p style={{ color: '#aaa', fontSize: '13px', margin: '6px 0 0', lineHeight: 1.5 }}>{c.comment_text}</p>
                </div>
                {user?._id === c.user._id && (
                  <button onClick={() => handleDeleteComment(c._id)} style={{ background: 'transparent', border: 'none', color: '#e94560', fontSize: '12px', cursor: 'pointer', padding: 0 }}>Delete</button>
                )}
              </div>
            ))}
            {comments.length === 0 && <p style={{ textAlign: 'center', color: '#6B6B8A', margin: 0, padding: '20px 0' }}>No comments yet. Be the first!</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryDetailPage;
