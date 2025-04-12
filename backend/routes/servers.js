const router = require('express').Router();
const auth = require('../middleware/auth');
const Server = require('../models/Server');

// Sunucu bilgilerini güncelle
router.put('/:serverId', auth, async (req, res) => {
  try {
    const { name, icon } = req.body;
    const server = await Server.findByIdAndUpdate(
      req.params.serverId,
      { name, icon },
      { new: true }
    );
    res.json(server);
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

    const servers = await Server.find({
      name: { $regex: query, $options: 'i' },
    }).select('name icon members');

    res.json(servers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:serverId/stats', auth, async (req, res) => {
  try {
    const server = await Server.findById(req.params.serverId)
      .populate('members.user', 'username status')
      .populate('channels');

    if (!server) {
      return res.status(404).json({ message: 'Sunucu bulunamadı' });
    }

    const stats = {
      totalMembers: server.members.length,
      activeMembers: server.members.filter((member) => member.user.status === 'online').length,
      channelMessageCounts: await Promise.all(
        server.channels.map(async (channel) => {
          const messageCount = await Message.countDocuments({ channel: channel._id });
          return { channelId: channel._id, messageCount };
        })
      ),
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;