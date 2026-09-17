# EC-334 Student Submission Portal

Students find their name, upload a .docx, done. Public — no login.

## What this is

A Next.js app that stores everything in **Vercel Blob** — both the uploaded
`.docx` files and a `data/students.json` file that acts as the database
(roll number, name, submitted yes/no, filename, timestamp). There's no
separate database to set up.

The roster is pre-loaded with your 52 students from the attendance report.
On first visit ever, the app writes that starting roster to Blob automatically
— you don't need to run a seed script.

## Deploy this

### 1. Push this folder to a GitHub repo
Vercel deploys from a repo (or you can use the Vercel CLI directly — see
below for that path instead).

### 2. Create the project on Vercel, and create a Blob store
1. Import the repo at vercel.com/new.
2. Once the project exists, go to its **Storage** tab → **Create Database**
   → **Blob**. Set access to whatever you like when it asks (the app itself
   controls per-file access in code, so this dashboard setting mostly just
   affects the default).
3. When you create the store, Vercel adds an environment variable called
   `BLOB_READ_WRITE_TOKEN` to this project automatically. **Copy that exact
   value** — you'll need to paste it into the admin portal's project too, so
   both apps share the same store. (Project Settings → Environment Variables
   → click to reveal `BLOB_READ_WRITE_TOKEN`.)

### 3. Redeploy
Environment variables only take effect on new deployments — trigger one
(push a commit, or use "Redeploy" in the Vercel dashboard).

### Alternative: deploy via CLI instead of GitHub
```bash
npm i -g vercel
cd student-portal
vercel link                 # creates/links the Vercel project
vercel blob create-store ec334-submissions
# copy the BLOB_READ_WRITE_TOKEN it prints, then:
vercel env add BLOB_READ_WRITE_TOKEN production
vercel --prod
```

## Local development
```bash
cp .env.example .env.local
# paste your BLOB_READ_WRITE_TOKEN into .env.local
npm install
npm run dev
```

## Adding more students later
Two ways:
- Tell whoever's maintaining this (or ask Claude again) to add rows to
  `lib/seed-data.ts` and redeploy — but note the seed file only runs on the
  **very first request ever** (when no `data/students.json` blob exists
  yet), so this only works before anyone's used the app.
- Simplest ongoing option: use the **admin portal's "Add a student" form** —
  it writes directly to the shared roster at any time, no redeploy needed.

## Design notes / tradeoffs worth knowing
- Files are stored with `access: 'public'` in Blob. Each file's URL contains
  a long random per-store hash, so it isn't publicly *browsable* or
  guessable — but it's not access-controlled either. Anyone who somehow
  obtained an exact file URL could fetch it directly. This was a deliberate
  simplification: the installed `@vercel/blob` SDK (v2.x) doesn't ship a
  function to read private blob content directly, only `head()` (metadata)
  + a plain `fetch()` of the resulting URL — which only works unauthenticated
  against public blobs. Fine for a classroom tool; worth upgrading if you
  ever store anything more sensitive here.
- There's no per-student login. Anyone with the link can technically upload
  under any roll number. Reasonable for a trusted classroom context; say so
  if you want real per-student auth added.
- Re-uploading replaces the previous file at the same path (`allowOverwrite:
  true`) — there's no version history, just the latest submission.
