// backend/routes/auth.js
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Kullanıcı kaydı
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Kullanıcı zaten var mı kontrol et
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({
        message: 'Bu e-posta veya kullanıcı adı zaten kullanılıyor'
      });
    }
    
    // Yeni kullanıcı oluştur
    const newUser = new User({ username, email, password });
    await newUser.save();
    
    // JWT token oluştur
    const token = jwt.sign(
      { id: newUser._id }, 
      process.env.JWT_SECRET || 'gizlianahtar', 
      { expiresIn: '30d' }
    );
    
    res.status(201).json({
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
        status: newUser.status
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Kullanıcı girişi
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Kullanıcıyı bul
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    
    // Şifreyi kontrol et
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Geçersiz şifre' });
    }
    
    // JWT token oluştur
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET || 'gizlianahtar', 
      { expiresIn: '30d' }
    );
    
    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        status: user.status
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;