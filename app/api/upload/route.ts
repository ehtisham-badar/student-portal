import { NextResponse } from 'next/server';
import { getRoster, saveSubmission } from '@/lib/blob-helpers';

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const rollNumber = form.get('rollNumber');
    const file = form.get('file');

    if (typeof rollNumber !== 'string' || !rollNumber) {
      return NextResponse.json({ error: 'Missing roll number.' }, { status: 400 });
    }
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    }
    const isDocx =
      file.name.toLowerCase().endsWith('.docx') &&
      (file.type === '' ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    if (!isDocx) {
      return NextResponse.json(
        { error: 'Only .docx files are accepted.' },
        { status: 400 },
      );
    }

    const roster = await getRoster();
    if (!roster.some((s) => s.rollNumber === rollNumber)) {
      return NextResponse.json({ error: 'Unknown roll number.' }, { status: 404 });
    }

    const buffer = await file.arrayBuffer();
    const updated = await saveSubmission(rollNumber, file.name, buffer);
    return NextResponse.json({ roster: updated });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Upload failed.' },
      { status: 500 },
    );
  }
}
