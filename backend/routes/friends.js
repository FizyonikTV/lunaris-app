const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Kullanıcı profili görüntüleme
router.get('/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Arkadaş ekleme
router.post('/:userId/add', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const friend = await User.findById(req.params.userId);

    if (!friend) {
      return res.status(404).json({ message: 'Arkadaş bulunamadı' });
    }

    if (user.friends.includes(friend._id)) {
      return res.status(400).json({ message: 'Bu kullanıcı zaten arkadaşınız' });
    }

    user.friends.push(friend._id);
    await user.save();

    res.json({ message: 'Arkadaş eklendi', friend });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Arkadaş silme
router.delete('/:userId/remove', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const friend = await User.findById(req.params.userId);

    if (!friend) {
      return res.status(404).json({ message: 'Arkadaş bulunamadı' });
    }

    user.friends = user.friends.filter((id) => id.toString() !== friend._id.toString());
    await user.save();

    res.json({ message: 'Arkadaş silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;