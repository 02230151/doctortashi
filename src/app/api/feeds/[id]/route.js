import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db/mongodb';
import Feed from '@/models/Feed';

export async function GET(req, { params }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = params;

    const feed = await Feed.findById(id).populate('author', 'name image');
    if (!feed) {
      return NextResponse.json({ message: 'Feed not found' }, { status: 404 });
    }

    return NextResponse.json(feed);
  } catch (error) {
    console.error('Fetch feed error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Only allow doctors to edit any feed
    const userRole = (session.user.role || '').trim().toLowerCase();
    console.log('User role:', userRole); // Debug log
    if (userRole !== 'doctor') {
      return NextResponse.json(
        { message: 'Only doctors can edit feeds' },
        { status: 403 }
      );
    }

    await connectDB();
    const { id } = params;
    const data = await req.json();

    const feed = await Feed.findById(id);
    if (!feed) {
      return NextResponse.json({ message: 'Feed not found' }, { status: 404 });
    }

    // Update allowed fields
    const allowedFields = ['title', 'content', 'category', 'image', 'status'];
    Object.keys(data).forEach((key) => {
      if (allowedFields.includes(key)) {
        feed[key] = data[key];
      }
    });

    feed.updatedAt = new Date();
    await feed.save();

    return NextResponse.json(feed);
  } catch (error) {
    console.error('Update feed error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 