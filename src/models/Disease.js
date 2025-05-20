const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide disease name'],
    index: true,
  },
  alternativeNames: [{
    type: String,
    index: true,
  }],
  overview: {
    type: String,
    required: [true, 'Please provide disease overview'],
  },
  symptoms: [{
    type: String,
    required: [true, 'Please provide symptoms'],
  }],
  whenToSeeDoctor: {
    type: String,
    required: [true, 'Please provide when to see doctor information'],
  },
  treatmentAndRemedies: {
    type: String,
    required: [true, 'Please provide treatment information'],
  },
  preventionTips: [{
    type: String,
  }],
  relatedSymptoms: [{
    type: String,
    index: true,
  }],
  riskFactors: [{
    type: String,
    index: true,
  }],
  complications: [{
    type: String,
    index: true,
  }],
  ageGroups: [{
    type: String,
    enum: ['infant', 'child', 'teen', 'adult', 'elderly'],
    index: true,
  }],
  gender: [{
    type: String,
    enum: ['male', 'female', 'both'],
    index: true,
  }],
  bodyParts: [{
    type: String,
    index: true,
  }],
  severity: {
    type: String,
    enum: ['mild', 'moderate', 'severe', 'life-threatening'],
    index: true,
  },
  contagious: {
    type: Boolean,
    index: true,
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now,
  },
  patientStories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
  }],
  tags: [{
    type: String,
    index: true,
  }],
  commonTests: [{
    type: String,
    index: true,
  }],
  medications: [{
    type: String,
    index: true,
  }],
  lifestyleChanges: [{
    type: String,
    index: true,
  }],
  emergencySigns: [{
    type: String,
    index: true,
  }],
});

// Create text index for search with weights
diseaseSchema.index({
  name: 'text',
  alternativeNames: 'text',
  overview: 'text',
  symptoms: 'text',
  relatedSymptoms: 'text',
  riskFactors: 'text',
  complications: 'text',
  bodyParts: 'text',
  commonTests: 'text',
  medications: 'text',
  lifestyleChanges: 'text',
  emergencySigns: 'text',
  tags: 'text'
}, {
  weights: {
    name: 10,
    alternativeNames: 8,
    symptoms: 7,
    emergencySigns: 6,
    complications: 5,
    overview: 4,
    relatedSymptoms: 3,
    riskFactors: 3,
    bodyParts: 3,
    commonTests: 2,
    medications: 2,
    lifestyleChanges: 2,
    tags: 1
  },
  name: 'disease_search'
});

const Disease = mongoose.models.Disease || mongoose.model('Disease', diseaseSchema);

module.exports = Disease; 