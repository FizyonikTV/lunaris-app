// backend/server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { verifyToken } = require('./middleware/auth');
const Message = require('./models/Message'); // Message modelini ekleyelim

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const channelRoutes = require('./routes/channels');

// Config
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/channels', channelRoutes);

// MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/discord-clone')
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch(err => console.error('MongoDB bağlantı hatası:', err));

// Socket.io yetkilendirme middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Yetkilendirme token\'ı eksik'));
  }
  
  try {
    const user = verifyToken(token);
    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Geçersiz token'));
  }
});

// Socket.io mesajlaşma
io.on('connection', (socket) => {
  console.log(`Kullanıcı bağlandı: ${socket.user.username} (${socket.id})`);
  
  // Kanala katılma
  socket.on('join_channel', (channelId) => {
    socket.join(channelId);
    console.log(`${socket.user.username} ${channelId} kanalına katıldı`);
  });
  
  // Kanaldan ayrılma
  socket.on('leave_channel', (channelId) => {
    socket.leave(channelId);
    console.log(`${socket.user.username} ${channelId} kanalından ayrıldı`);
  });
  
  // Mesaj gönderme kısmını güncelleyelim
  socket.on('send_message', async (messageData) => {
    try {
      const message = new Message({
        content: messageData.content,
        channel: messageData.channelId,
        author: socket.user.id
      });
      
      await message.save();
      
      const populatedMessage = await Message.findById(message._id)
        .populate('author', 'username avatar');
      
      io.to(messageData.channelId).emit('receive_message', populatedMessage);
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
      socket.emit('message_error', { message: 'Mesaj gönderilemedi' });
    }
  });
  
  // Bildirim gönderme
  socket.on('send_notification', (notificationData) => {
    const { recipientId, message } = notificationData;
    io.to(recipientId).emit('receive_notification', { message });
  });

  // Kullanıcı yazıyor bildirimi
  socket.on('typing', (data) => {
    socket.to(data.channelId).emit('user_typing', {
      userId: socket.user.id,
      username: socket.user.username,
      channelId: data.channelId,
    });
  });

  // Kullanıcı yazmayı durdurdu bildirimi
  socket.on('stop_typing', (data) => {
    socket.to(data.channelId).emit('user_stopped_typing', {
      userId: socket.user.id,
      channelId: data.channelId,
    });
  });

  // Kullanıcı durum güncelleme
  socket.on('update_status', (status) => {
    socket.user.status = status;
    io.emit('status_updated', { userId: socket.user.id, status });
  });
  
  // Bağlantı kesildiğinde
  socket.on('disconnect', () => {
    console.log(`Kullanıcı bağlantısı kesildi: ${socket.user.username}`);
  });
});

// Server'ı başlat
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});