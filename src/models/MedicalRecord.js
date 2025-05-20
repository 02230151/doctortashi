import mongoose from 'mongoose';

const medicalRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bloodGroup: String,
  allergies: [String],
  chronicConditions: [String],
  currentMedications: [{
    name: String,
    dosage: String,
    frequency: String,
    startDate: Date,
    endDate: Date,
  }],
  surgicalHistory: [{
    procedure: String,
    date: Date,
    hospital: String,
    surgeon: String,
    notes: String,
  }],
  familyHistory: [{
    condition: String,
    relationship: String,
    notes: String,
  }],
  immunizations: [{
    name: String,
    date: Date,
    dueDate: Date,
    notes: String,
  }],
  labReports: [{
    testName: String,
    date: Date,
    results: String,
    fileUrl: String,
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  }],
  emergencyContact: {
    name: String,
    relationship: String,
    phoneNumber: String,
    address: String,
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

medicalRecordSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const MedicalRecord = mongoose.models.MedicalRecord || mongoose.model('MedicalRecord', medicalRecordSchema);

export default MedicalRecord; 