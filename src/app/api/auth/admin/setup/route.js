import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db/mongodb';
import User from '@/models/User';

// These credentials should be kept secure and not exposed in the code in a real application
const ADMIN_CREDENTIALS = {
  name: 'CureLink Admin',
  email: 'admin@curelink.com',
  password: 'admin123',
  role: 'admin'
};

export async function POST(req) {
  try {
    // In a real application, you would want to add additional security here
    const { secretKey } = await req.json();
    
    // Simple security check - in production, use a more secure method
    if (secretKey !== process.env.ADMIN_SETUP_KEY) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return NextResponse.json(
        { message: 'Admin account already exists' },
        { status: 400 }
      );
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(ADMIN_CREDENTIALS.password, 12);
    const admin = await User.create({
      ...ADMIN_CREDENTIALS,
      password: hashedPassword,
    });

    return NextResponse.json(
      { 
        message: 'Admin account created successfully',
        credentials: {
          email: ADMIN_CREDENTIALS.email,
          password: ADMIN_CREDENTIALS.password
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Admin setup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 