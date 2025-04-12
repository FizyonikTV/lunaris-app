import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Kanal oluştur
export const createChannel = createAsyncThunk(
  'channels/createChannel',
  async ({ serverId, channelData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${API_URL}/channels/${serverId}`,
        channelData,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Kanal düzenle
export const updateChannel = createAsyncThunk(
  'channels/updateChannel',
  async ({ channelId, channelData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(
        `${API_URL}/channels/${channelId}`,
        channelData,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Kanal sil
export const deleteChannel = createAsyncThunk(
  'channels/deleteChannel',
  async (channelId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`${API_URL}/channels/${channelId}`, config);
      return channelId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Mesaj sabitle
export const pinMessage = createAsyncThunk(
  'channels/pinMessage',
  async ({ channelId, messageId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(
        `${API_URL}/channels/${channelId}/pin`,
        { messageId },
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Mesaj sabitlemeyi kaldır
export const unpinMessage = createAsyncThunk(
  'channels/unpinMessage',
  async (channelId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(`${API_URL}/channels/${channelId}/unpin`, {}, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const channelSlice = createSlice({
  name: 'channels',
  initialState: {
    channels: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createChannel.fulfilled, (state, action) => {
        state.channels.push(action.payload);
      })
      .addCase(updateChannel.fulfilled, (state, action) => {
        const index = state.channels.findIndex(
          (channel) => channel._id === action.payload._id
        );
        if (index !== -1) {
          state.channels[index] = action.payload;
        }
      })
      .addCase(deleteChannel.fulfilled, (state, action) => {
        state.channels = state.channels.filter(
          (channel) => channel._id !== action.payload
        );
      });
  },
});

export default channelSlice.reducer;