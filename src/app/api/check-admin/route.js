import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();

    // Delete any existing admin first
    await User.deleteOne({ email: 'admin@curelink.com' });

    // Create fresh admin account without hashing
    const newAdmin = await User.create({
      name: 'Admin User',
      email: 'admin@curelink.com',
      password: 'admin123',  // Plain password without hashing
      role: 'admin',
      status: 'active'
    });

    return NextResponse.json({
      message: 'Admin account reset successfully',
      credentials: {
        email: 'admin@curelink.com',
        password: 'admin123'
      }
    });

  } catch (error) {
    console.error('Admin setup error:', error);
    return NextResponse.json({ 
      error: 'Failed to setup admin account',
      details: error.message 
    }, { status: 500 });
  }
}
