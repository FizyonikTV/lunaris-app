import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { sendNotification } from '../../components/utils/socketConfig';

const API_URL = process.env.REACT_APP_API_URL;

// Kullanıcı profili yükle
export const fetchUserProfile = createAsyncThunk(
  'friends/fetchUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_URL}/friends/${userId}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Arkadaş ekle
export const addFriend = createAsyncThunk(
  'friends/addFriend',
  async (userId, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(`${API_URL}/friends/${userId}/add`, {}, config);

      // Bildirim gönder
      sendNotification(userId, 'Bir arkadaşlık isteği aldınız!');

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Arkadaş sil
export const removeFriend = createAsyncThunk(
  'friends/removeFriend',
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.delete(`${API_URL}/friends/${userId}/remove`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const friendSlice = createSlice({
  name: 'friends',
  initialState: {
    profile: null,
    friends: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Kullanıcı profili yüklenemedi.';
      })
      .addCase(addFriend.fulfilled, (state, action) => {
        state.friends.push(action.payload.friend);
      })
      .addCase(removeFriend.fulfilled, (state, action) => {
        state.friends = state.friends.filter(
          (friend) => friend._id !== action.meta.arg
        );
      });
  },
});

export default friendSlice.reducer;