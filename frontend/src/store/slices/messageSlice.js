import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setNotification } from './notificationSlice';

const API_URL = '/api';

// Async thunks
export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/channels/${channelId}/messages`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchMessagesWithPagination = createAsyncThunk(
  'messages/fetchMessagesWithPagination',
  async ({ channelId, page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/channels/${channelId}/messages?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async (messageData, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(
        `${API_URL}/channels/${messageData.channelId}/messages`, 
        { content: messageData.content }
      );
      dispatch(setNotification({ message: 'Mesaj gönderildi!', type: 'success' }));
      return response.data;
    } catch (error) {
      dispatch(setNotification({ message: 'Mesaj gönderilemedi!', type: 'error' }));
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateMessage = createAsyncThunk(
  'messages/updateMessage',
  async ({ messageId, content }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(
        `${API_URL}/messages/${messageId}`,
        { content },
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteMessage = createAsyncThunk(
  'messages/deleteMessage',
  async (messageId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`${API_URL}/messages/${messageId}`, config);
      return messageId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addReaction = createAsyncThunk(
  'messages/addReaction',
  async ({ messageId, emoji }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${API_URL}/messages/${messageId}/reactions`,
        { emoji },
        config
      );
      return { messageId, reactions: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeReaction = createAsyncThunk(
  'messages/removeReaction',
  async ({ messageId, emoji }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.delete(
        `${API_URL}/messages/${messageId}/reactions`,
        { data: { emoji }, ...config }
      );
      return { messageId, reactions: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  messages: [],
  loading: false,
  error: null,
  sendingMessage: false,
  updatingMessage: false,
  deletingMessage: false
};

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.messages = [];
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    updateMessageLocal: (state, action) => {
      const index = state.messages.findIndex(msg => msg._id === action.payload._id);
      if (index !== -1) {
        state.messages[index] = action.payload;
      }
    },
    removeMessage: (state, action) => {
      state.messages = state.messages.filter(msg => msg._id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Mesajlar yüklenirken bir hata oluştu.';
      })
      
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.sendingMessage = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendingMessage = false;
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendingMessage = false;
        state.error = action.payload || 'Mesaj gönderilirken bir hata oluştu.';
      })
      
      // Update message
      .addCase(updateMessage.pending, (state) => {
        state.updatingMessage = true;
        state.error = null;
      })
      .addCase(updateMessage.fulfilled, (state, action) => {
        state.updatingMessage = false;
        const index = state.messages.findIndex(msg => msg._id === action.payload._id);
        if (index !== -1) {
          state.messages[index] = action.payload;
        }
      })
      .addCase(updateMessage.rejected, (state, action) => {
        state.updatingMessage = false;
        state.error = action.payload || 'Mesaj güncellenirken bir hata oluştu.';
      })
      
      // Delete message
      .addCase(deleteMessage.pending, (state) => {
        state.deletingMessage = true;
        state.error = null;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.deletingMessage = false;
        state.messages = state.messages.filter(msg => msg._id !== action.payload);
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.deletingMessage = false;
        state.error = action.payload || 'Mesaj silinirken bir hata oluştu.';
      })

      // Add reaction
      .addCase(addReaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReaction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.messages.findIndex(msg => msg._id === action.payload.messageId);
        if (index !== -1) {
          state.messages[index].reactions = action.payload.reactions;
        }
      })
      .addCase(addReaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Reaksiyon eklenirken bir hata oluştu.';
      })

      // Remove reaction
      .addCase(removeReaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeReaction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.messages.findIndex(msg => msg._id === action.payload.messageId);
        if (index !== -1) {
          state.messages[index].reactions = action.payload.reactions;
        }
      })
      .addCase(removeReaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Reaksiyon kaldırılırken bir hata oluştu.';
      });
  }
});

export const { clearMessages, addMessage, updateMessageLocal, removeMessage } = messageSlice.actions;

export default messageSlice.reducer;