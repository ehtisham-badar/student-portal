/** Per-question max marks, in question order. Must sum to TOTAL_MARKS. */
export const QUESTION_MAX_MARKS: readonly number[] = [
  12, 12, 15, 10, 10, 12, 14, 8, 10, 10, 12, 15, 15,
];

export const TOTAL_MARKS = QUESTION_MAX_MARKS.reduce((sum, m) => sum + m, 0);

/** Full text of EC-334 Assignment 1, used as the grading rubric/context. */
export const ASSIGNMENT_TEXT = `EC-334 — Assignment 1
Comprehensive Assessment — Lectures 1–4, Including the C# Language
DEADLINE: MONDAY, 21 SEPTEMBER 2026, 11:59 PM — NO SUBMISSIONS ACCEPTED AFTER THIS TIME, NO EXCEPTIONS.
Scope
Lectures 1–4 in full, including the C# language — game design theory, engine theory, and real C# code
Format
This document. Type your answers directly into the answer boxes below each question, save as .docx, and upload — do not change the file type.
Total
155 marks across 13 questions
Submission Guidelines
	•	Submit through the class submission portal — find your row by your roll number and name, and use the upload button next to it.
	•	The file you upload must be .docx. No other format (.doc, .pdf, .odt, Google Docs links, photos of handwriting) will be accepted by the portal.
	•	Type your answers directly into the "Your answer" box under each question in this same file, then save and upload the whole document — don't create a separate answer sheet.
	•	Fill in your name and roll number below before you begin, so your identity is on the document itself as well as on the portal.
Name:_______________________________________________________
Roll Number:_______________________________________________________
Academic Integrity
This work must be your own. Submissions are compared against every other submission in this class for overlapping text, so copying from a classmate — in either direction — puts both of you at risk, not just the person who copied. Write your own examples; reused phrasing is exactly what similarity checking is built to catch.
Before You Start
This is deliberately the hardest assignment of the semester so far. Several questions have no single correct answer — you are graded on the rigor of your reasoning, not on reaching a specific conclusion. Three rules apply throughout:
	•	Any question asking for an example disqualifies examples already used in class. Reusing one caps that question at 40%, regardless of how well-argued the rest is.
	•	For the code questions: trace the code by hand, the way the compiler would, before answering — several are deliberately not identical to anything shown in lecture.
	•	Asserting a conclusion is not the same as defending one. "This is true because it's true" earns no credit beyond stating a position.
  Section A — Game Design Foundations (Lecture 1)
Q1   Two Frameworks, One Word
12 marks  •  expected length: 200–250 words
Both the Layered Tetrad and MDA use the word "Mechanics," and the two uses overlap but aren't identical. Pick a game not discussed in class. Identify one specific element of it that counts as "Mechanics" under both frameworks — then explain specifically what each framework asks you to DO with that identification that the other doesn't.
For full marks: a real, specific difference in what each framework is FOR, not just a restatement of both definitions side by side.

Q2   Designing for Two Players at Once
12 marks  •  expected length: 200–250 words
Describe (in words, not code) a difficulty-curve design for an original game concept such that a player with above-average skill AND a player with below-average skill both stay inside the flow channel for the first 10 minutes. Be specific about what actually changes over those 10 minutes and why it accommodates both players.
For full marks: a concrete mechanism (not just "it gets harder gradually") that plausibly serves both skill levels, with reasoning tied to the flow channel specifically.

  Section B — Engine & Editor Theory (Lecture 2)
Q3   Reflection Meets Retained Mode
15 marks  •  expected length: 200–250 words
The Inspector is a reflection-based UI; the Scene is a retained-mode data structure. Trace, step by step, what happens when you change a public field's value in the Inspector while in Edit mode, then press Play, change it again during Play mode, then press Stop. What value does the field end up holding, and which of the two concepts (reflection or retained mode) is responsible for each step of that behavior?
For full marks: a genuine step-by-step trace naming which concept governs each step — not just a restatement of what reflection and retained mode mean in isolation.

  Section C — Formal Elements & Prototyping (Lecture 4, Part A)
Q4   All Seven, Still Broken
10 marks  •  expected length: 150–200 words
"A game can satisfy all seven of Fullerton's formal elements and still fail as a game." Defend or refute this claim using a specific example — real or a plausible hypothetical — not used in class.
For full marks: a specific example where all seven elements are genuinely present, with a concrete account of why it still succeeds or fails as a game.

  Section D — The C# Language (Lecture 4, Part B)
Q5   Trace It By Hand
10 marks  •  expected length: Short — show your work
What does the following print, and why?
int a = 10;
float b = a / 3;
Debug.Log(b);
For full marks: the correct printed value AND an explanation of the order operations actually happen in — not just "because int division truncates," but why that rule still applies here even though b is a float.

Q6   Whose Object Is It?
12 marks  •  expected length: Short — show your work
What does this print? Explain using value types vs. reference types.
CharacterStats hero = new CharacterStats();
hero.health = 100;
ModifyHealth(hero);
Debug.Log(hero.health);

void ModifyHealth(CharacterStats c)
{
    c.health = 50;
}
For full marks: the correct printed value, plus an explanation of what gets passed into the method parameter c — a copy of what, specifically.

Q7   Write It, Then Break It
14 marks  •  expected length: A short script, plus 2–3 sentences
Write a short C# snippet (5–10 lines) that: declares a health variable, computes an isAlive status using the ternary operator (not an if-statement), and prints a status message using string interpolation. Then: a classmate's version compares health to a threshold using == instead of a range check. Name specifically what could go wrong.
For full marks: working, correctly-typed code using the ternary operator as specified, plus a specific failure case for the == comparison — not just "floats shouldn't use ==."

  Section E — Hardest Basic Programs (No Loops, No If-Statements)
Everything below is solvable with only what's been taught so far: variables, types, operators, and the ternary operator. That's the whole constraint, and it's also what makes these hard — no for/while/foreach, no if/else blocks (the ternary operator is allowed and often necessary), and no writing your own helper methods. Each one has a real "gotcha" if you reach for the tool you don't have yet instead of thinking it through with what you do have.

Q8   Swap Without a Third Variable
8 marks  •  expected length: A few lines of code
Write C# code that swaps the values of two int variables, a and b, WITHOUT declaring a third variable to hold a temporary value. Show the values of both before and after, using Debug.Log.
For full marks: a correct swap using only arithmetic operators — no third variable, no tuple syntax (a, b) = (b, a), no library shortcut.

Q9   Leap Year, One Expression
10 marks  •  expected length: One line of code, plus 1–2 sentences
A year is a leap year if it's divisible by 4 — unless it's also divisible by 100, in which case it's NOT — unless it's ALSO divisible by 400, in which case it IS after all. Write a single line of C# that computes a bool isLeapYear for a given int year, using only comparison and logical operators. No if-statement, no ternary — one boolean expression that's correct on its own.
For full marks: a single boolean expression correct for all three cases — mentally check it against 2000 (leap), 1900 (not leap), and 2024 (leap) before you write your final answer.

Q10   Maximum of Three, Ternary Only
10 marks  •  expected length: One line of code
Given three int variables a, b, c, write a single expression — no if-statements, no Math.Max — that computes their maximum using ONLY the ternary operator, nested as needed. Assign the result to a variable called largest.
For full marks: a correctly nested ternary that handles all six possible orderings of a, b, and c — test it against at least one case where the largest value is in each of the three positions.

Q11   Single-Number FizzBuzz, No Loops
12 marks  •  expected length: A few lines of code
Given a single int n, print "Fizz" if it's divisible by 3, "Buzz" if divisible by 5, "FizzBuzz" if divisible by both, and the number itself otherwise — using ONLY nested ternary operators and Debug.Log. You're handling one number, not a range, so no loop is needed or allowed.
For full marks: the "divisible by both" case checked BEFORE checking 3 or 5 individually — the most common mistake here is a nesting order that can never actually reach "FizzBuzz."

Q12   Reverse and Compare a Three-Digit Number
15 marks  •  expected length: Several lines of code, plus 1–2 sentences
Given an int n known to be exactly three digits (100–999): (a) extract its hundreds, tens, and units digits using only / and % operators; (b) reconstruct those digits into a new number with the order reversed — 123 becomes 321; (c) print whether the reversed number is the SAME as the original or DIFFERENT, using the ternary operator for the final message. No loops, no if-statements, and no converting to a string to reverse it as text — digits and arithmetic only.
For full marks: correct digit extraction (hundreds = n/100, tens = (n/10)%10, units = n%10), correct reconstruction, and a correct ternary-based comparison — mentally test against a palindrome like 121 and a non-palindrome like 123.

  Section F — Synthesis
Q13   Three Frameworks, One Idea?
15 marks  •  expected length: 250–300 words
"The Component/reference-type architecture from Lectures 2 and 4, the Layered Tetrad's Technology layer from Lecture 1, and 'Mechanics' from Lecture 3's MDA are secretly describing the same underlying idea from three different angles." Argue for or against this claim, referencing at least two of the three frameworks by name and with specific reasoning — not just a summary of what each one is.
For full marks: a specific, defended position (for or against) that engages at least two named frameworks on their actual substance, not a restatement of their definitions side by side.`;

/**
 * Full text of Lectures 1-4 (the assignment's stated scope), used so the
 * grader can (a) enforce the "no examples used in class" rule accurately
 * instead of guessing, and (b) check the C# questions against the exact
 * rules/conventions actually taught, not just general C# knowledge.
 *
 * Note: these lecture notes never introduce "reflection" / "retained mode"
 * terminology or the Inspector's Edit-mode vs Play-mode value-reset behavior
 * that Q3 asks about -- that content is not present in the material provided
 * to this grader. Q3 is graded on general software-engineering knowledge of
 * those concepts, not against lecture-taught vocabulary.
 */
export const LECTURE_CONTEXT = `=== LECTURE 1: What Is Game Design? (Meaningful play, the Layered Tetrad, core loops) ===

Meaningful play (Salen & Zimmerman): a player's action is meaningful when it is both discernible (you can see what happened) and integrated (it affects what happens later).

The Layered Tetrad (Jeremy Gibson Bond) -- four layers every game is built from:
- Mechanics: the rules and systems -- what the player can actually do.
- Story: the narrative context wrapped around the mechanics.
- Aesthetics: the feeling the game produces in the player.
- Technology: the medium that makes the game possible.
No single layer is mandatory; what matters is that the four layers stay consistent with each other (worked example in class: Chess has almost no Story and zero digital Technology, and is still one of the deepest games ever designed).

Core loop: the smallest cycle of action, feedback, and decision a player repeats for as long as they play: Act -> Feedback -> Reward or cost -> Decide -> (back to Act).

EXAMPLES USED IN CLASS in this lecture (disqualified if a student reuses one where the question asks for an example not used in class): Chess, Tetris, Flappy Bird, Among Us, Angry Birds, Wordle, Candy Crush, Duolingo, free-throw practice / basketball, a jigsaw puzzle, a Rubik's Cube.

=== LECTURE 2: Unity3D & VS Code Setup, Editor Tour ===

Six core Editor panels: Scene view (authoring space, never seen by a player), Game view (renders through the active Camera -- what a player sees), Hierarchy (tree of GameObjects in the currently open Scene), Project window (every asset in the whole project, placed or not), Inspector (shows and lets you edit every Component on whatever is selected), Console (errors, warnings, Debug.Log output).

Every GameObject always has a Transform component (position, rotation, scale) and can never lose it. Everything else that gives a GameObject behavior (Sprite Renderer, Rigidbody, a custom script) is an add-on Component attached on top of the Transform. A GameObject alone does nothing -- behavior comes entirely from its attached Components.

A Scene is a serialized list of GameObjects and the Component data attached to each one -- a snapshot of exactly where every piece is and what state each is in.

Note: this lecture's notes do not use the terms "reflection" or "retained mode," and do not describe what happens to Inspector-edited values when entering/exiting Play mode.

=== LECTURE 3 (MDA): Game Loops & the MDA Framework ===

The MDA framework -- three layers:
- Mechanics: the rules and systems the designer directly authors (e.g. "Jump has a 0.2-second cooldown").
- Dynamics: the run-time behavior that emerges when mechanics meet a real player -- nobody codes a dynamic directly.
- Aesthetics: the emotional response the dynamics produce -- the actual goal of design.
Worked example used in class: a stealth mechanic (guards have a 90-degree vision cone and can't see through cover -> players start timing cover-to-cover hops to guard patrol patterns [dynamic] -> tense, careful puzzle-solving [aesthetic, mostly Challenge with a little Sensation]).

The reversal: designers work Mechanics -> Dynamics -> Aesthetics; players experience it backwards, Aesthetics -> Dynamics -> Mechanics. This is why playtesting is non-negotiable.

Eight kinds of fun: Sensation, Fantasy, Narrative, Challenge, Fellowship, Discovery, Expression, Submission.

Intrinsic vs extrinsic motivation; the overjustification effect (an external reward can crowd out an activity's own intrinsic appeal).

The flow channel (Csikszentmihalyi): a state of complete absorption occurring specifically when challenge and skill are both high and well-matched. Skill far exceeds challenge -> boredom. Challenge far exceeds skill -> anxiety/frustration. Both rising together, roughly matched -> flow. Good pacing keeps raising the challenge ceiling just ahead of the player's rising skill so they stay inside the channel.

Core loop revisited with MDA vocabulary: Mechanics define what's possible inside the loop; Dynamics are the loop actually playing out; Aesthetics is why you want to go around again. Worked example used in class: "Hot Potato Tap" (see the potato glow [M] -> tap before it explodes [M] -> screen shake + score [D] -> potato passes faster [D] -> tension climbs [A]), aiming for Sensation + Challenge.

EXAMPLES USED IN CLASS in this lecture (disqualified if reused where the question asks for an example not used in class): the stealth-mechanic/guard-vision-cone example, "Hot Potato Tap", Tetris (line-clear flash/clunk), an RPG letting you be a wizard/dragon, a visual novel, a Dark Souls boss, a co-op raid, Among Us, a metroidvania map, The Sims' house-building, an idle clicker/solitaire.

=== LECTURE 4: Formal Elements of Games & Paper Prototyping ===

Tracy Fullerton's seven formal elements (medium-independent): Players (how many, symmetric or asymmetric), Objectives (what the player is trying to achieve), Rules (constraints defining the possibility space), Resources (things of value managed under scarcity), Conflict (tension from obstacles/opposition), Boundaries (the "magic circle" separating what's meaningful inside the game from the outside world), Outcome (the game must produce an uncertain, quantifiable result).

Paper prototyping trades fidelity for iteration speed; it tests Mechanics and Dynamics specifically, and deliberately cannot test Aesthetics driven by audio/visual polish. A good paper prototype answers one design question.

EXAMPLES USED IN CLASS in this lecture: Chess (2-player symmetric), Among Us (asymmetric, Crewmate vs Impostor), a rook's movement rule, Uno (a red card means nothing outside the game).

=== LECTURE (C# LANGUAGE REFERENCE): the full syntax/semantics reference covering Sections D and E of the assignment ===

C# is compiled and statically typed: every variable has a fixed type that never changes; the compiler catches type errors before the game runs.

Value types (int, float, double, bool, char, struct) are COPIED on assignment -- the two variables become fully independent. Reference types (class, array; string is a special immutable case) share the SAME underlying object on assignment -- both variables point at one object, so a change through one is visible through the other. Passing an object to a method parameter passes a copy of the reference for reference types (so mutating fields on it through the parameter mutates the same shared object the caller sees), and passes a copy of the value for value types.

Arithmetic: int division truncates -- 7 / 2 is 3, not 3.5, because both operands are int; cast at least one operand to get a fractional result, e.g. (float)7 / 2. This applies even when the result is assigned into a float variable -- the truncation happens during the int/int division itself, before the assignment. The modulo operator % gives the remainder (7 % 2 is 1).
Never compare floats with == for equality in gameplay code, because floating-point rounding means mathematically-equal values can differ by a tiny fraction.
Logical && and || short-circuit (in "a && b", if a is false, b is never evaluated).
The ternary operator: "condition ? valueIfTrue : valueIfFalse" is a compact if/else that produces a value.

Common mistakes explicitly called out in this lecture: integer division truncating; comparing floats with ==; a while loop whose exit condition never becomes false (infinite loop, freezes the Editor); assuming assignment of a reference type copies the object rather than sharing it; accessing an array index that doesn't exist (IndexOutOfRangeException).

Nothing in this reference lecture teaches or demonstrates loops or if/else-if/else being used to solve the Section E "no loops, no if-statements" puzzles (swap without a third variable, leap year in one expression, max of three via nested ternary, single-number FizzBuzz via nested ternary, reverse-and-compare a three-digit number via / and %) -- those are original problems applying the operators taught here, not examples reused from class.`;
