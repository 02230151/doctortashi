import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Story from '@/models/Story';
import connectDB from '@/lib/db/mongodb';

export async function POST(req) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const formData = await req.formData();
    const data = {
      authorName: formData.get('authorName'),
      symptoms: formData.get('symptoms'),
      remedies: formData.get('remedies'),
      healingProcess: formData.get('healingProcess'),
    };

    // Handle file upload
    const prescriptionFile = formData.get('prescriptionProof');
    if (prescriptionFile) {
      const buffer = await prescriptionFile.arrayBuffer();
      const base64String = Buffer.from(buffer).toString('base64');
      const fileType = prescriptionFile.type;
      data.prescriptionProof = `data:${fileType};base64,${base64String}`;
    }

    // Create story
    const story = await Story.create({
      ...data,
      author: session.user.id,
    });

    return NextResponse.json(story, { status: 201 });
  } catch (error) {
    console.error('Story creation error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const query = {};
    if (status === 'verified') {
      query.verificationStatus = 'verified';
    }
    const stories = await Story.find(query)
      .populate('author', 'name image')
      .sort({ createdAt: -1 })
      .limit(20);
    return NextResponse.json({ stories });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
} 