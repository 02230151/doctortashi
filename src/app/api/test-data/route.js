import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/models/User';
import Story from '@/models/Story';

export async function POST() {
  try {
    await connectDB();

    // Add test doctor
    let doctor = await User.findOne({ email: 'doctor@example.com' });
    if (!doctor) {
      doctor = await User.create({
        name: 'Test Doctor',
        email: 'doctor@example.com',
        password: 'doctor123', // You may want to hash this if your app requires it
        role: 'doctor',
        isActive: true
      });
    }

    // Add test patient
    let patient = await User.findOne({ email: 'patient@example.com' });
    if (!patient) {
      patient = await User.create({
        name: 'Test Patient',
        email: 'patient@example.com',
        password: 'patient123',
        role: 'patient',
        isActive: true
      });
    }

    // Add test story
    let story = await Story.findOne({ authorName: 'Test Patient' });
    if (!story) {
      story = await Story.create({
        authorName: 'Test Patient',
        symptoms: 'Test symptoms',
        remedies: 'Test remedies',
        healingProcess: 'Test healing process',
        author: patient._id
      });
    }

    return NextResponse.json({
      message: 'Test data created',
      doctor: { email: doctor.email, role: doctor.role },
      patient: { email: patient.email, role: patient.role },
      story: { id: story._id }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating test data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 