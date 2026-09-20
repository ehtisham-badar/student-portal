import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import mammoth from 'mammoth';
import { ASSIGNMENT_TEXT, LECTURE_CONTEXT, QUESTION_MAX_MARKS, TOTAL_MARKS } from './grading-rubric';

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

You have the actual lecture content below (Lectures 1-4, the assignment's stated scope). Use it two ways:
1. Enforce the "reused class example" 40% cap precisely against the "EXAMPLES USED IN CLASS" lists in each lecture section -- if a student's example for Q1, Q2, Q4, or Q13 matches one of those (or is trivially the same game/example renamed), cap that question at 40% regardless of how well-argued the rest is. Do not apply this cap to examples that aren't listed -- grade those on their reasoning alone.
2. Grade the C# questions (Q5-Q12) against the exact rules and conventions in the C# reference lecture section, not just general C# knowledge -- e.g. its explanation of int truncation, value vs. reference types, and the operators allowed.

Exception: this material does not cover "reflection-based UI" or "retained-mode" terminology, or the Inspector's Edit-mode/Play-mode value-reset behavior that Q3 asks about. Grade Q3 on general software-engineering correctness of the trace instead of against lecture-taught vocabulary, and do not penalize a student for not naming these lectures' terms for it.

If a question was left blank or clearly not attempted, award 0 for it and say so in that question's feedback.

Assignment text (contains all 13 questions and their grading criteria):
${ASSIGNMENT_TEXT}

Lecture content (Lectures 1-4):
${LECTURE_CONTEXT}`;

/** Grades a student's extracted submission text against the Assignment 1 rubric via Claude Opus 5. */
export async function gradeSubmission(submissionText: string): Promise<Grading> {
  const client = new Anthropic();

  const response = await client.messages.parse({
    model: 'claude-opus-5',
    max_tokens: 16000,
    // Cached: identical for every student's grading call on this
    // assignment, and large enough (rubric + 4 lectures) to be worth it.
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
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
