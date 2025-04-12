const router = require('express').Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');
const multer = require('multer');
const path = require('path');

// Multer ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/files/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Geçersiz dosya türü. Sadece resim ve belge dosyalarına izin verilir.'));
    }
  },
});

// Dosya yükleme rotası
router.post('/:channelId/upload', auth, upload.single('file'), async (req, res) => {
  try {
    const message = new Message({
      content: '',
      channel: req.params.channelId,
      author: req.user._id,
      attachments: [`/uploads/files/${req.file.filename}`],
    });

    await message.save();

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mesajları getir
router.get('/:channelId/messages', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const messages = await Message.find({ channel: req.params.channelId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('author', 'username avatar');

    const totalMessages = await Message.countDocuments({ channel: req.params.channelId });

    res.json({
      messages,
      totalPages: Math.ceil(totalMessages / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mesaj güncelle
router.put('/:messageId', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ message: 'Mesaj bulunamadı' });
    }

    if (message.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Bu mesajı düzenleme yetkiniz yok' });
    }

    message.content = content;
    message.edited = true;
    await message.save();

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mesaj sil
router.delete('/:messageId', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ message: 'Mesaj bulunamadı' });
    }

    if (message.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Bu mesajı silme yetkiniz yok' });
    }

    await message.remove();
    res.json({ message: 'Mesaj silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;