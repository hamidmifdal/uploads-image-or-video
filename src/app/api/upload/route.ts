import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const uploadDir = path.join(process.cwd(), 'uploads');

export async function POST(req: Request) {
  try {
    // Ensure req.body is defined and a ReadableStream
    if (!req.body) {
      return NextResponse.json({ error: 'No file data received.' }, { status: 400 });
    }

    // Create a FormData object from the request
    const formData = await req.formData();
    const file = formData.get('file'); // Get the uploaded file

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'File not found or invalid.' }, { status: 400 });
    }

    // Check the file type
    const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/webm', 'video/ogg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only images and videos are allowed.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer()); // Convert file to buffer
    const filename = file.name; // Get the original filename

    // Ensure the uploads directory exists
    fs.mkdirSync(uploadDir, { recursive: true });

    // Write the file to the uploads directory
    fs.writeFileSync(path.join(uploadDir, filename), buffer);

    return NextResponse.json({ message: 'File uploaded successfully', filename });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error uploading the file.' }, { status: 500 });
  }
}
