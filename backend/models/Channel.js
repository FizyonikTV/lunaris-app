const ChannelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['text', 'voice', 'video'],
    default: 'text',
  },
  server: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Server',
  },
  description: {
    type: String,
    default: '',
  },
  pinnedMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  },
});