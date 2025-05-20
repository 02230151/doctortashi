import mongoose from 'mongoose';

const doctorProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  qualifications: [{
    degree: String,
    institution: String,
    year: Number,
  }],
  experience: {
    type: Number, // years of experience
    required: true,
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true,
  },
  documents: [{
    type: {
      type: String,
      enum: ['license', 'degree', 'certification', 'other'],
    },
    url: String,
    verified: {
      type: Boolean,
      default: false,
    },
  }],
  consultationFee: {
    type: Number,
    required: true,
  },
  availability: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    },
    startTime: String,
    endTime: String,
    isAvailable: {
      type: Boolean,
      default: true,
    },
  }],
  rating: {
    type: Number,
    default: 0,
  },
  totalRatings: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

doctorProfileSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const DoctorProfile = mongoose.models.DoctorProfile || mongoose.model('DoctorProfile', doctorProfileSchema);

export default DoctorProfile; 