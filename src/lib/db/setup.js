import mongoose from 'mongoose';
import User from '../../models/User';
import Disease from '../../models/Disease';
import Story from '../../models/Story';
import Feed from '../../models/Feed';
import DoctorApplication from '../../models/DoctorApplication';

export async function setupCollections() {
  try {
    // Get all collection names
    const collections = await mongoose.connection.db.collections();
    console.log('Existing collections:', collections.map(c => c.collectionName));

    // Ensure indexes for User collection
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ role: 1 });
    await User.collection.createIndex({ doctorId: 1 }, { sparse: true });

    // Ensure indexes for Disease collection
    await Disease.collection.createIndex({ name: 1 });
    await Disease.collection.createIndex({ 
      name: 'text', 
      symptoms: 'text', 
      relatedSymptoms: 'text', 
      tags: 'text' 
    });

    // Ensure indexes for Story collection
    await Story.collection.createIndex({ author: 1 });
    await Story.collection.createIndex({ disease: 1 });
    await Story.collection.createIndex({ verificationStatus: 1 });
    await Story.collection.createIndex({ 
      title: 'text', 
      content: 'text', 
      tags: 'text' 
    });

    // Ensure indexes for Feed collection
    await Feed.collection.createIndex({ category: 1 });
    await Feed.collection.createIndex({ author: 1 });
    await Feed.collection.createIndex({ createdAt: -1 });

    // Ensure indexes for DoctorApplication collection
    await DoctorApplication.collection.createIndex({ email: 1 });
    await DoctorApplication.collection.createIndex({ status: 1 });
    await DoctorApplication.collection.createIndex({ createdAt: 1 });

    console.log('All collections and indexes have been set up successfully');
    return true;
  } catch (error) {
    console.error('Error setting up collections:', error);
    throw error;
  }
} 