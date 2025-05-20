import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db/mongodb';
import Feed from '@/models/Feed';

export async function GET(req) {
  try {
    await connectDB();

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 9;

    // Build query
    const query = { status: 'published' }; // Only show published feeds
    if (category) {
      query.category = category;
    }

    // Execute query with pagination
    const feeds = await Feed.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author', 'name image');

    // Get total count for pagination
    const total = await Feed.countDocuments(query);

    return NextResponse.json({
      feeds,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Fetch feeds error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession();
    console.log('Session object:', session); // Debug: print the whole session

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user.role || '').trim().toLowerCase();
    console.log('User role:', userRole); // Debug: print the normalized role

    if (userRole !== 'doctor') {
      return NextResponse.json(
        { message: 'Only doctors can create feeds' },
        { status: 403 }
      );
    }

    await connectDB();
    const { title, content, category, image, status } = await req.json();

    // Validate required fields
    if (!title || !content || !category) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const feed = await Feed.create({
      title,
      content,
      category,
      image,
      author: session.user.id,
      status: status || 'draft'
    });

    return NextResponse.json(feed, { status: 201 });
  } catch (error) {
    console.error('Create feed error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 