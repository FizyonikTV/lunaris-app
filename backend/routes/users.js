const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Multer ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars/');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Sadece JPEG, JPG ve PNG dosyalarına izin verilir.'));
    }
  },
});

// Kullanıcı bilgilerini güncelle
router.put('/me', auth, async (req, res) => {
  try {
    const { username, avatar, status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username, avatar, status },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/status', auth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['online', 'idle', 'dnd', 'invisible', 'offline'].includes(status)) {
      return res.status(400).json({ message: 'Geçersiz durum' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { status },
      { new: true }
    );

    res.json({ status: user.status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Avatar yükleme rotası
router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    user.avatar = `/uploads/avatars/${req.file.filename}`;
    await user.save();

    res.json({ avatar: user.avatar });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/search', auth, async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Arama sorgusu gerekli' });
    }

    const users = await User.find({
      username: { $regex: query, $options: 'i' },
    }).select('username avatar status');

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;