import { NextResponse } from 'next/server';
import { getRoster, saveSubmission, saveGrade, saveGradingError } from '@/lib/blob-helpers';
import { isPastDeadline } from '@/lib/deadline';
import { extractDocxText, gradeSubmission } from '@/lib/grade';

// AI grading (Claude Opus 5, extended thinking) can comfortably exceed
// Vercel's default function timeout -- give it room.
export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    if (isPastDeadline()) {
      return NextResponse.json({ error: 'The submission deadline has passed.' }, { status: 403 });
    }

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

    try {
      const text = await extractDocxText(Buffer.from(buffer));
      const grading = await gradeSubmission(text);
      const graded = await saveGrade(rollNumber, grading);
      return NextResponse.json({ roster: graded });
    } catch (gradingErr) {
      // The submission itself is saved and counts -- grading is a
      // best-effort add-on, so a grading failure must not fail the upload.
      const message = gradingErr instanceof Error ? gradingErr.message : 'AI grading failed.';
      const withError = await saveGradingError(rollNumber, message);
      return NextResponse.json({ roster: withError });
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Upload failed.' },
      { status: 500 },
    );
  }
}
