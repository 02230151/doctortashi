import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import connectDB from '@/lib/db/mongodb';
import DoctorApplication from '@/models/DoctorApplication';

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'doctor-applications');

export async function POST(req) {
  try {
    console.log('1. Starting doctor application process...');
    
    const formData = await req.formData();
    console.log('2. Form data received:', {
      name: formData.get('name'),
      email: formData.get('email'),
      specialization: formData.get('specialization'),
      experience: formData.get('experience'),
      licenseNumber: formData.get('licenseNumber') || '',
      documentName: formData.get('document')?.name
    });

    const name = formData.get('name');
    const email = formData.get('email');
    const specialization = formData.get('specialization');
    const experience = formData.get('experience');
    const licenseNumber = formData.get('licenseNumber') || '';
    const document = formData.get('document');

    if (!name || !email || !specialization || !experience || !document) {
      console.log('3. Missing required fields:', { name, email, specialization, experience, hasDocument: !!document });
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('4. Creating upload directory...');
    // Create upload directory if it doesn't exist
    try {
      await mkdir(uploadDir, { recursive: true });
      console.log('5. Upload directory created/verified at:', uploadDir);
    } catch (error) {
      console.error('6. Error creating directory:', error);
      return NextResponse.json(
        { message: 'Failed to create upload directory', error: error.message },
        { status: 500 }
      );
    }

    // Save file locally
    try {
      console.log('7. Processing file upload...');
      const buffer = await document.arrayBuffer();
      const filename = `${Date.now()}-${document.name}`;
      const filePath = path.join(uploadDir, filename);
      
      console.log('8. Writing file to:', filePath);
      await writeFile(filePath, Buffer.from(buffer));
      console.log('9. File written successfully');

      // Generate public URL for the file
      const documentUrl = `/uploads/doctor-applications/${filename}`;
      console.log('10. Generated document URL:', documentUrl);

      console.log('11. Connecting to database...');
      await connectDB();
      console.log('12. Database connected');

      console.log('13. Creating doctor application record...');
      // Create doctor application
      const application = await DoctorApplication.create({
        name,
        email,
        specialization,
        experience: Number(experience),
        licenseNumber,
        documents: [{
          type: 'license',
          url: documentUrl,
          verified: false
        }]
      });
      console.log('14. Doctor application created:', application._id);

      return NextResponse.json(
        { message: 'Application submitted successfully', applicationId: application._id },
        { status: 201 }
      );
    } catch (error) {
      console.error('Error processing application:', {
        step: error.step || 'unknown',
        error: error.message,
        stack: error.stack
      });
      return NextResponse.json(
        { message: 'Failed to process application', error: error.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Top level error:', {
      error: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
} 