import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getStories, getMyStories, getStoryById, createStory, updateStory, deleteStory } from '../../services/api';
import { StoryState, Story } from '../../types';

const initialState: StoryState = {
  stories: [], myStories: [], currentStory: null, isLoading: false, error: null,
};

export const fetchStories = createAsyncThunk('story/fetchAll', async (params?: object) => {
  return (await getStories(params)).data;
});

export const fetchMyStories = createAsyncThunk('story/fetchMy', async () => {
  return (await getMyStories()).data;
});

export const fetchStoryById = createAsyncThunk('story/fetchOne', async (id: string) => {
  return (await getStoryById(id)).data;
});

export const addStory = createAsyncThunk('story/create', async (data: object, { rejectWithValue }) => {
  try { return (await createStory(data)).data; }
  catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(e.response?.data?.message || 'Create failed');
  }
});

export const editStory = createAsyncThunk('story/update', async ({ id, data }: { id: string; data: object }) => {
  return (await updateStory(id, data)).data;
});

export const removeStory = createAsyncThunk('story/delete', async (id: string) => {
  await deleteStory(id); return id;
});

const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: { clearCurrentStory: (state) => { state.currentStory = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStories.pending,   (state) => { state.isLoading = true; })
      .addCase(fetchStories.fulfilled, (state, action: PayloadAction<Story[]>) => {
        state.isLoading = false; state.stories = action.payload;
      })
      .addCase(fetchMyStories.fulfilled, (state, action: PayloadAction<Story[]>) => {
        state.myStories = action.payload;
      })
      .addCase(fetchStoryById.fulfilled, (state, action: PayloadAction<Story>) => {
        state.currentStory = action.payload;
      })
      .addCase(addStory.fulfilled, (state, action: PayloadAction<Story>) => {
        state.myStories.unshift(action.payload);
      })
      .addCase(editStory.fulfilled, (state, action: PayloadAction<Story>) => {
        state.myStories = state.myStories.map(s => s._id === action.payload._id ? action.payload : s);
      })
      .addCase(removeStory.fulfilled, (state, action: PayloadAction<string>) => {
        state.myStories = state.myStories.filter(s => s._id !== action.payload);
      });
  },
});

export const { clearCurrentStory } = storySlice.actions;
export default storySlice.reducer;
