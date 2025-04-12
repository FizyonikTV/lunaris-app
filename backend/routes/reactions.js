const router = require('express').Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');

// Emoji tepkisi ekle
router.post('/:messageId/reactions', auth, async (req, res) => {
  try {
    const { emoji } = req.body;
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ message: 'Mesaj bulunamadı' });
    }

    const existingReaction = message.reactions.find(
      (reaction) => reaction.emoji === emoji
    );

    if (existingReaction) {
      if (!existingReaction.users.includes(req.user._id)) {
        existingReaction.users.push(req.user._id);
      }
    } else {
      message.reactions.push({ emoji, users: [req.user._id] });
    }

    await message.save();
    res.json(message.reactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Emoji tepkisi kaldır
router.delete('/:messageId/reactions', auth, async (req, res) => {
  try {
    const { emoji } = req.body;
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ message: 'Mesaj bulunamadı' });
    }

    const reaction = message.reactions.find(
      (reaction) => reaction.emoji === emoji
    );

    if (reaction) {
      reaction.users = reaction.users.filter(
        (userId) => userId.toString() !== req.user._id.toString()
      );

      if (reaction.users.length === 0) {
        message.reactions = message.reactions.filter(
          (r) => r.emoji !== emoji
        );
      }
    }

    await message.save();
    res.json(message.reactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;