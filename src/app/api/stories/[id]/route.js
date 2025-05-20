import { NextResponse } from 'next/server';
import Story from '@/models/Story';
import connectDB from '@/lib/db/mongodb';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const story = await Story.findById(id)
      .populate('author', 'name image');

    if (!story) {
      return NextResponse.json({ message: 'Story not found' }, { status: 404 });
    }

    return NextResponse.json(story);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = params;

    const story = await Story.findById(id);
    if (!story) {
      return NextResponse.json({ message: 'Story not found' }, { status: 404 });
    }

    // Check if user is the author or an admin
    if (story.author?.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await story.deleteOne();

    return NextResponse.json({ message: 'Story deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = params;
    const data = await req.json();

    const story = await Story.findById(id);
    if (!story) {
      return NextResponse.json({ message: 'Story not found' }, { status: 404 });
    }

    // Check if user is the author or an admin
    if (story.author?.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Update allowed fields
    const allowedFields = ['authorName', 'symptoms', 'remedies', 'healingProcess', 'prescriptionProof'];
    Object.keys(data).forEach((key) => {
      if (allowedFields.includes(key)) {
        story[key] = data[key];
      }
    });

    story.updatedAt = new Date();
    await story.save();

    return NextResponse.json(story);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
} 