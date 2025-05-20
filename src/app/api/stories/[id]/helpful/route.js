import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Story from '@/models/Story';
import dbConnect from '@/lib/dbConnect';

export async function POST(req, { params }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { id } = params;

    const story = await Story.findById(id);
    if (!story) {
      return NextResponse.json({ message: 'Story not found' }, { status: 404 });
    }

    // Check if user has already marked as helpful
    if (story.helpful.includes(session.user.id)) {
      return NextResponse.json({ message: 'Already marked as helpful' }, { status: 400 });
    }

    // Add user to helpful array
    story.helpful.push(session.user.id);
    await story.save();

    return NextResponse.json({ message: 'Marked as helpful' });
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

    await dbConnect();
    const { id } = params;

    const story = await Story.findById(id);
    if (!story) {
      return NextResponse.json({ message: 'Story not found' }, { status: 404 });
    }

    // Remove user from helpful array
    story.helpful = story.helpful.filter(
      (userId) => userId.toString() !== session.user.id
    );
    await story.save();

    return NextResponse.json({ message: 'Removed helpful mark' });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
} 