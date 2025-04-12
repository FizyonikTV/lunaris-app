const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  reactions: [
    {
      emoji: String,
      users: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },
  ],
});

module.exports = mongoose.model('Message', messageSchema);