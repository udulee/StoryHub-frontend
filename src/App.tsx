import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks/useAppDispatch';
import { fetchMe } from './redux/slices/authSlice';

import Navbar      from './components/common/Navbar';
import HomePage    from './pages/HomePage';
import LoginPage   from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StoryDetail from './pages/StoryDetailPage';
import ReadPage    from './pages/ReadPage';
import WriterDashboard from './pages/WriterDashboard';
import CreateStory from './pages/CreateStoryPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './routes/ProtectedRoute';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector(s => s.auth);

  useEffect(() => {
    if (token) dispatch(fetchMe());
  }, [dispatch, token]);

  return (
    <Router>
      <div style={{ minHeight: '100vh', background: '#1C1C28' }}>
        <Navbar />
        <Routes>
          <Route path="/"           element={<HomePage />} />
          <Route path="/login"      element={<LoginPage />} />
          <Route path="/register"   element={<RegisterPage />} />
          <Route path="/story/:id"  element={<StoryDetail />} />
          <Route path="/read/:storyId/chapter/:chapterId" element={<ReadPage />} />
          <Route path="/writer" element={
            <ProtectedRoute role="writer">
              <WriterDashboard />
            </ProtectedRoute>
          } />
          <Route path="/writer/create" element={
            <ProtectedRoute role="writer">
              <CreateStory />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
