export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'reader' | 'writer' | 'admin';
  profile_image?: string;
  bio?: string;
}

export interface Story {
  _id: string;
  title: string;
  description: string;
  category: 'Fantasy' | 'Romance' | 'Horror' | 'Mystery' | 'Action' | 'Webtoon';
  cover_image?: string;
  author: User | string;
  status: 'draft' | 'published';
  likes: string[];
  views: number;
  createdAt: string;
}

export interface Chapter {
  _id: string;
  story: string;
  chapter_number: number;
  chapter_title: string;
  content: string;
  createdAt: string;
}

export interface Comment {
  _id: string;
  story: string;
  user: User;
  comment_text: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface StoryState {
  stories: Story[];
  myStories: Story[];
  currentStory: Story | null;
  isLoading: boolean;
  error: string | null;
}
