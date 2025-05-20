import mongoose from 'mongoose';

const feedSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: {
    type: String,
    enum: ['Facts Sheet', 'Bhutan News', 'World News'],
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: { type: String }, // URL to the image
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update lastUpdated timestamp on every update
feedSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Feed = mongoose.models.Feed || mongoose.model('Feed', feedSchema);

export default Feed; 