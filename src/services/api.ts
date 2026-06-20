import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const registerUser  = (data: object) => API.post('/auth/register', data);
export const loginUser     = (data: object) => API.post('/auth/login', data);
export const getMe         = ()             => API.get('/auth/me');
export const updateProfile = (data: object) => API.put('/auth/profile', data);

// Stories
export const getStories   = (params?: object) => API.get('/stories', { params });
export const getMyStories = ()                 => API.get('/stories/my');
export const getStoryById = (id: string)       => API.get(`/stories/${id}`);
export const createStory  = (data: object)     => API.post('/stories', data);
export const updateStory  = (id: string, data: object) => API.put(`/stories/${id}`, data);
export const deleteStory  = (id: string)       => API.delete(`/stories/${id}`);
export const toggleLike   = (id: string)       => API.post(`/stories/like/${id}`);

// Chapters
export const getChapters   = (storyId: string)          => API.get(`/chapters/${storyId}`);
export const getChapterById = (id: string)               => API.get(`/chapters/single/${id}`);
export const createChapter = (data: object)              => API.post('/chapters', data);
export const updateChapter = (id: string, data: object)  => API.put(`/chapters/${id}`, data);
export const deleteChapter = (id: string)                => API.delete(`/chapters/${id}`);

// Comments
export const getComments   = (storyId: string) => API.get(`/comments/${storyId}`);
export const createComment = (data: object)    => API.post('/comments', data);
export const deleteComment = (id: string)      => API.delete(`/comments/${id}`);

// PDF - Advanced Feature
export const downloadStoryPDF    = (id: string) => API.get(`/pdf/story/${id}`, { responseType: 'blob' });
export const downloadWriterReport = ()           => API.get('/pdf/my-report',  { responseType: 'blob' });

export default API;
