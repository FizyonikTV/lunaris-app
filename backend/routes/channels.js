const router = require('express').Router();
const auth = require('../middleware/auth');
const Channel = require('../models/Channel');
const Server = require('../models/Server');

// Kanal oluştur
router.post('/:serverId', auth, async (req, res) => {
  try {
    const { name, type } = req.body;
    const server = await Server.findById(req.params.serverId);

    if (!server) {
      return res.status(404).json({ message: 'Sunucu bulunamadı' });
    }

    const channel = new Channel({ name, type, server: server._id });
    await channel.save();

    server.channels.push(channel._id);
    await server.save();

    res.status(201).json(channel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Kanal düzenle
router.put('/:channelId', auth, async (req, res) => {
  try {
    const { name, type } = req.body;
    const channel = await Channel.findByIdAndUpdate(
      req.params.channelId,
      { name, type },
      { new: true }
    );

    if (!channel) {
      return res.status(404).json({ message: 'Kanal bulunamadı' });
    }

    res.json(channel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Kanal sil
router.delete('/:channelId', auth, async (req, res) => {
  try {
    const channel = await Channel.findByIdAndDelete(req.params.channelId);

    if (!channel) {
      return res.status(404).json({ message: 'Kanal bulunamadı' });
    }

    await Server.findByIdAndUpdate(channel.server, {
      $pull: { channels: channel._id },
    });

    res.json({ message: 'Kanal silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Sabit mesaj ekleme
router.put('/:channelId/pin', auth, async (req, res) => {
  try {
    const { messageId } = req.body;
    const channel = await Channel.findById(req.params.channelId);

    if (!channel) {
      return res.status(404).json({ message: 'Kanal bulunamadı' });
    }

    channel.pinnedMessage = messageId;
    await channel.save();

    res.json({ pinnedMessage: channel.pinnedMessage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Sabit mesajı kaldırma
router.put('/:channelId/unpin', auth, async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.channelId);

    if (!channel) {
      return res.status(404).json({ message: 'Kanal bulunamadı' });
    }

    channel.pinnedMessage = null;
    await channel.save();

    res.json({ message: 'Sabit mesaj kaldırıldı' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Kanal arama
router.get('/search', auth, async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Arama sorgusu gerekli' });
    }

    const channels = await Channel.find({
      name: { $regex: query, $options: 'i' },
    }).select('name type server');

    res.json(channels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;