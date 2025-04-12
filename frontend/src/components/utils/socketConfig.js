import { io } from 'socket.io-client';
import { addMessage, updateMessageLocal, removeMessage } from '../store/slices/messageSlice';
import store from '../store';

let socket;

export const initializeSocket = (token) => {
  if (socket) {
    socket.disconnect();
  }

  socket = io(process.env.REACT_APP_API_URL, {
    auth: {
      token: token
    }
  });

  // Error handling ekleyelim
  socket.on('connect_error', (error) => {
    console.error('Socket bağlantı hatası:', error.message);
  });

  socket.on('message_error', (error) => {
    console.error('Mesaj hatası:', error.message);
  });

  // Socket event listeners
  socket.on('connect', () => {
    console.log('Socket bağlantısı kuruldu');
  });

  socket.on('disconnect', () => {
    console.log('Socket bağlantısı kesildi');
  });

  socket.on('error', (error) => {
    console.error('Socket hatası:', error);
  });

  // Mesaj olaylarını dinle
  socket.on('receive_message', (message) => {
    store.dispatch(addMessage(message));
  });

  socket.on('message_updated', (message) => {
    store.dispatch(updateMessageLocal(message));
  });

  socket.on('message_deleted', (messageId) => {
    store.dispatch(removeMessage(messageId));
  });

  socket.on('receive_notification', (notification) => {
    store.dispatch(setNotification({ message: notification.message, type: 'info' }));
  });

  socket.on('status_updated', (data) => {
    console.log(`Kullanıcı durumu güncellendi: ${data.userId} - ${data.status}`);
    // Durum güncellemesini Redux store'a veya UI'ye yansıtabilirsiniz.
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket bağlantısı henüz kurulmadı. Önce initializeSocket() çağrılmalı.');
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const sendNotification = (recipientId, message) => {
  const socket = getSocket();
  socket.emit('send_notification', { recipientId, message });
};

export default {
  initializeSocket,
  getSocket,
  disconnectSocket
};