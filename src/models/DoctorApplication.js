import mongoose from 'mongoose';

const doctorApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  licenseNumber: {
    type: String,
    required: true,
  },
  documents: [{
    type: {
      type: String,
      enum: ['license', 'degree', 'certification', 'other'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    verified: {
      type: Boolean,
      default: false
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  reviewDate: Date,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectionReason: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

doctorApplicationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const DoctorApplication = mongoose.models.DoctorApplication || mongoose.model('DoctorApplication', doctorApplicationSchema);

export default DoctorApplication; 