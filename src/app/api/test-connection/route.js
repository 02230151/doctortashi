import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ 
      message: 'Successfully connected to MongoDB',
      status: 'success'
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json({ 
      message: 'Failed to connect to MongoDB',
      error: error.message,
      status: 'error'
    }, { status: 500 });
  }
} 