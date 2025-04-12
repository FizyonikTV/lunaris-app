const router = require('express').Router();
const auth = require('../middleware/auth');
const Server = require('../models/Server');
const { v4: uuidv4 } = require('uuid');

// Davet oluştur
router.post('/:serverId', auth, async (req, res) => {
  try {
    const server = await Server.findById(req.params.serverId);

    if (!server) {
      return res.status(404).json({ message: 'Sunucu bulunamadı' });
    }

    const inviteCode = uuidv4();
    server.invites.push(inviteCode);
    await server.save();

    res.status(201).json({ inviteCode });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Davet ile sunucuya katıl
router.post('/join/:inviteCode', auth, async (req, res) => {
  try {
    const server = await Server.findOne({ invites: req.params.inviteCode });

    if (!server) {
      return res.status(404).json({ message: 'Davet kodu geçersiz' });
    }

    if (server.members.some((member) => member.user.toString() === req.user._id.toString())) {
      return res.status(400).json({ message: 'Zaten bu sunucunun üyesisiniz' });
    }

    server.members.push({ user: req.user._id });
    await server.save();

    res.status(200).json({ message: 'Sunucuya katıldınız', server });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;