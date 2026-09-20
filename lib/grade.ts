import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import mammoth from 'mammoth';
import { ASSIGNMENT_TEXT, QUESTION_MAX_MARKS, TOTAL_MARKS } from './grading-rubric';

export type QuestionGrade = {
  number: number;
  maxMarks: number;
  marksAwarded: number;
  feedback: string;
};

export type Grading = {
  totalMarks: number;
  maxMarks: number;
  overallFeedback: string;
  questions: QuestionGrade[];
  gradedAt: string;
};

const GradingResultSchema = z.object({
  questions: z
    .array(
      z.object({
        number: z.number().int(),
        marksAwarded: z.number(),
        feedback: z.string(),
      }),
    )
    .length(QUESTION_MAX_MARKS.length),
  overallFeedback: z.string(),
});

/** Extracts plain text from an uploaded .docx buffer. */
export async function extractDocxText(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

const SYSTEM_PROMPT = `You are grading a university assignment for EC-334 (Game Design and Development). Grade strictly and consistently against the rubric below -- the same standard for every student. Follow the "For full marks" criteria for each question exactly; do not award full marks for answers that only restate definitions or assert a conclusion without defending it.

Known limitation you must work within: you cannot verify whether an example was used in the actual class lectures (you weren't given lecture transcripts). Do not apply the "reused class example" 40% cap unless the example given is one of the specific examples that appear inside this assignment text itself -- otherwise grade the reasoning on its own merits.

If a question was left blank or clearly not attempted, award 0 for it and say so in that question's feedback.

Assignment text (contains all 13 questions and their grading criteria):
${ASSIGNMENT_TEXT}`;

/** Grades a student's extracted submission text against the Assignment 1 rubric via Claude Opus 5. */
export async function gradeSubmission(submissionText: string): Promise<Grading> {
  const client = new Anthropic();

  const response = await client.messages.parse({
    model: 'claude-opus-5',
    max_tokens: 16000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Here is the student's submitted document (extracted from their .docx). Grade all 13 questions.\n\n---\n${submissionText}\n---`,
      },
    ],
    output_config: {
      format: zodOutputFormat(GradingResultSchema),
      effort: 'high',
    },
  });

  const parsed = response.parsed_output;
  if (!parsed) {
    throw new Error('Grading failed: the model did not return a parseable result.');
  }

  const questions: QuestionGrade[] = parsed.questions
    .slice()
    .sort((a, b) => a.number - b.number)
    .map((q, i) => {
      const maxMarks = QUESTION_MAX_MARKS[i];
      return {
        number: q.number,
        maxMarks,
        marksAwarded: Math.max(0, Math.min(q.marksAwarded, maxMarks)),
        feedback: q.feedback,
      };
    });

  const totalMarks = questions.reduce((sum, q) => sum + q.marksAwarded, 0);

  return {
    totalMarks,
    maxMarks: TOTAL_MARKS,
    overallFeedback: parsed.overallFeedback,
    questions,
    gradedAt: new Date().toISOString(),
  };
}
