/** Assignment submission deadline, Pakistan Standard Time (UTC+5). */
export const SUBMISSION_DEADLINE = new Date('2026-09-22T00:00:00+05:00');

export function isPastDeadline(now: Date = new Date()): boolean {
  return now.getTime() >= SUBMISSION_DEADLINE.getTime();
}
