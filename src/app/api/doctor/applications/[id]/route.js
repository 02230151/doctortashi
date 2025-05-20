import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db/mongodb';
import DoctorApplication from '@/models/DoctorApplication';
import User from '@/models/User';

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { status } = await req.json();

    await connectDB();

    const application = await DoctorApplication.findById(id);
    if (!application) {
      return NextResponse.json(
        { message: 'Application not found' },
        { status: 404 }
      );
    }

    // Update application status
    application.status = status;
    application.reviewedAt = new Date();
    application.reviewedBy = session.user.id;
    await application.save();

    // If approved, create or update user as doctor
    if (status === 'approved') {
      await User.findOneAndUpdate(
        { email: application.email },
        {
          $set: {
            role: 'doctor',
            specialization: application.specialization,
            documents: [application.documentUrl],
            status: 'active'
          }
        },
        { upsert: true }
      );
    }

    return NextResponse.json({ message: 'Application updated successfully' });
  } catch (error) {
    console.error('Update application error:', error);
    return NextResponse.json(
      { message: 'Failed to update application' },
      { status: 500 }
    );
  }
} 