import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import serverReducer from './slices/serverSlice';
import channelReducer from './slices/channelSlice';
import messageReducer from './slices/messageSlice';
import notificationReducer from './slices/notificationSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    servers: serverReducer,
    channels: channelReducer,
    messages: messageReducer,
    notifications: notificationReducer,
  },
});

export default store;