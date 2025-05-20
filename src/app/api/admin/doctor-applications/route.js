import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db/mongodb';
import DoctorApplication from '@/models/DoctorApplication';

// GET - Fetch all doctor applications
export async function GET(req) {
  // TEMP: Always allow for debugging
  await connectDB();
  const applications = await DoctorApplication.find().sort({ applicationDate: -1 }).lean();
  console.log('Fetched doctor applications:', applications.length, applications.map(a => a.email));
  return NextResponse.json({ applications });
}

// PUT - Update application status
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('API Session:', session);

    // Fallback: If session.user.role is missing, fetch from DB
    if (!session?.user?.role) {
      const User = (await import('@/models/User')).default;
      const dbUser = await User.findOne({ email: session?.user?.email });
      if (dbUser) {
        session.user.role = dbUser.role;
      }
    }

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const { applicationId, status, notes } = body;
    if (!applicationId || !status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }
    await connectDB();
    const application = await DoctorApplication.findByIdAndUpdate(
      applicationId,
      {
        status,
        notes,
        reviewedAt: new Date(),
        reviewedBy: session.user.id
      },
      { new: true }
    );
    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }
    // If approved, register as doctor if not already present
    if (status === 'approved') {
      const User = (await import('@/models/User')).default;
      const bcrypt = (await import('bcryptjs')).default;
      
      console.log('Approving doctor application for:', application.email);
      
      // First delete any existing user with this email
      await User.deleteOne({ email: application.email });
      console.log('Deleted existing user if any');
      
      // Create new user with plain password (will be hashed by pre-save hook)
      const newUser = await User.create({
        email: application.email,
        name: application.name,
        role: 'doctor',
        password: '1234567'  // Pass plain password, let the model hash it
      });
      
      console.log('Created new doctor user:', {
        email: newUser.email,
        role: newUser.role,
        hasPassword: !!newUser.password
      });
    }
    return NextResponse.json(application);
  } catch (error) {
    console.error('Error updating doctor application:', error);
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
} 