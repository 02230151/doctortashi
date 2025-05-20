import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import DoctorApplication from '@/models/DoctorApplication';
import { getServerSession } from 'next-auth';

export async function PATCH(req, { params }) {
  const session = await getServerSession();
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await connectDB();
  const { status, rejectionReason } = await req.json();
  const update = {
    status,
    reviewDate: new Date(),
    reviewedBy: session.user.id,
  };
  if (status === 'rejected' && rejectionReason) {
    update.rejectionReason = rejectionReason;
  }
  const application = await DoctorApplication.findByIdAndUpdate(params.id, update, { new: true });
  if (!application) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 });
  }
  return NextResponse.json({ application });
} 