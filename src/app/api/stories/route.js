import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Story from '@/models/Story';
import connectDB from '@/lib/db/mongodb';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'stories');

export async function POST(req) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Create upload directory if it doesn't exist
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      console.error('Error creating directory:', error);
      return NextResponse.json(
        { message: 'Failed to create upload directory' },
        { status: 500 }
      );
    }

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
      const filename = `${Date.now()}-${prescriptionFile.name}`;
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, Buffer.from(buffer));
      data.prescriptionProof = `/uploads/stories/${filename}`;
    }

    // Create story (no disease required)
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
    // You may want to filter by other fields if needed
    const stories = await Story.find(query)
      .populate('author', 'name image')
      .sort({ createdAt: -1 })
      .limit(20);
    return NextResponse.json({ stories });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
} 