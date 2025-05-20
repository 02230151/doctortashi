import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import DoctorApplication from '@/models/DoctorApplication';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET - Fetch all doctor applications
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    await connectDB();

    const applications = await DoctorApplication.find()
      .populate('userId', 'name email')
      .populate('reviewedBy', 'name email')
      .sort({ applicationDate: -1 });

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching doctor applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch doctor applications' },
      { status: 500 }
    );
  }
}

// POST - Submit a new doctor application
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    await connectDB();
    const data = await request.json();

    const application = await DoctorApplication.create({
      userId: session.user.id,
      name: data.name,
      email: data.email,
      specialization: data.specialization,
      experience: data.experience,
      licenseNumber: data.licenseNumber,
      documents: data.documents
    });

    return NextResponse.json(
      { message: 'Application submitted successfully', application },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting doctor application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}

// PUT - Update application status
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    await connectDB();
    const data = await request.json();
    const { applicationId, status, rejectionReason } = data;

    const application = await DoctorApplication.findByIdAndUpdate(
      applicationId,
      {
        status,
        rejectionReason: status === 'rejected' ? rejectionReason : undefined,
        reviewDate: new Date(),
        reviewedBy: session.user.id
      },
      { new: true }
    ).populate('userId');

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // If application is approved, create doctor profile
    if (status === 'approved') {
      const User = (await import('@/models/User')).default;
      const DoctorProfile = (await import('@/models/DoctorProfile')).default;

      // Update user role to doctor
      await User.findByIdAndUpdate(application.userId, {
        role: 'doctor',
        isVerified: true
      });

      // Create doctor profile
      await DoctorProfile.create({
        userId: application.userId,
        specialization: application.specialization,
        experience: application.experience,
        licenseNumber: application.licenseNumber,
        documents: application.documents,
        consultationFee: 0 // Default value, can be updated later
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