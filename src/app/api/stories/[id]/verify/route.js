import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Story from '@/models/Story';
import connectDB from '@/lib/db/mongodb';

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    // Fallback: If session.user.role is missing, fetch from DB
    if (!session?.user?.role) {
      const User = (await import('@/models/User')).default;
      const dbUser = await User.findOne({ email: session?.user?.email });
      if (dbUser) {
        session.user.role = dbUser.role;
      }
    }

    // Assign userRole after fallback
    const userRole = (session?.user?.role || '').trim().toLowerCase();
    console.log('VERIFY STORY SESSION:', session);
    console.log('User role:', userRole);

    if (!session || userRole !== 'doctor') {
      console.log('Unauthorized: No session or not a doctor');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = params;
    const body = await req.json();
    console.log('VERIFY STORY PARAMS:', params);
    console.log('VERIFY STORY BODY:', body);
    const { status, notes } = body;

    const story = await Story.findById(id);
    if (!story) {
      console.log('Story not found:', id);
      return NextResponse.json({ message: 'Story not found' }, { status: 404 });
    }

    story.verificationStatus = status === 'approved' ? 'verified' : status;
    story.verifiedBy = session.user.id;
    story.verificationDate = new Date();
    if (notes) {
      story.verificationNotes = notes;
    }

    await story.save();

    console.log('Story verification status updated:', story._id, status);
    return NextResponse.json({ message: 'Story verification status updated' });
  } catch (error) {
    console.error('VERIFY STORY ERROR:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
} 