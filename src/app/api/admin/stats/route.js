import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db/mongodb';
import User from '@/models/User';
import Story from '@/models/Story';
import DoctorApplication from '@/models/DoctorApplication';
// import Appointment from '@/models/Appointment'; // Removed

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get all stats in parallel (remove Appointment related stats)
    const [totalUsers, totalDoctors, totalPatients, pendingApplications, totalStories] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'doctor' }),
      User.countDocuments({ role: 'patient' }),
      DoctorApplication.countDocuments({ status: 'pending' }),
      Story.countDocuments()
    ]);

    return NextResponse.json({
      totalUsers,
      totalDoctors,
      totalPatients,
      pendingApplications,
      totalStories
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
} 