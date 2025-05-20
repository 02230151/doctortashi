import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  authorName: {
    type: String,
    maxLength: [100, 'Name cannot be more than 100 characters'],
  },
  symptoms: {
    type: String,
    required: [true, 'Please describe your symptoms'],
    minLength: [10, 'Symptoms description should be at least 10 characters long'],
  },
  remedies: {
    type: String,
    required: [true, 'Please share the remedies or treatments you used'],
    minLength: [10, 'Remedies description should be at least 10 characters long'],
  },
  healingProcess: {
    type: String,
    required: [true, 'Please share how you healed or tips that helped you'],
    minLength: [10, 'Healing process description should be at least 10 characters long'],
  },
  prescriptionProof: {
    type: String, // URL to the uploaded prescription/proof document
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  helpful: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending',
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verificationDate: { type: Date },
  verificationNotes: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  moderatorNotes: {
    type: String,
  },
  tags: [{
    type: String,
  }],
});

// Add text search index
storySchema.index({
  symptoms: 'text',
  remedies: 'text',
  healingProcess: 'text',
  tags: 'text'
});

const Story = mongoose.models.Story || mongoose.model('Story', storySchema);

export default Story; 