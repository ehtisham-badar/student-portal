'use client';

import { useEffect, useRef, useState } from 'react';
import { isPastDeadline } from '@/lib/deadline';

type Student = {
  rollNumber: string;
  name: string;
  submitted: boolean;
  filename?: string;
  uploadedAt?: string;
};

export default function Page() {
  const [roster, setRoster] = useState<Student[] | null>(null);
  const [query, setQuery] = useState('');
  const [busyRoll, setBusyRoll] = useState<string | null>(null);
  const [errorByRoll, setErrorByRoll] = useState<Record<string, string>>({});
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    loadRoster();
  }, []);

  async function loadRoster() {
    try {
      const res = await fetch('/api/roster');
      const data = await res.json();
      setRoster(data.roster || []);
    } catch {
      setRoster([]);
    }
  }

  function clearError(roll: string) {
    setErrorByRoll((prev) => {
      const next = { ...prev };
      delete next[roll];
      return next;
    });
  }

  async function handleFileChosen(rollNumber: string, file: File | undefined) {
    if (!file) return;
    clearError(rollNumber);
    if (!file.name.toLowerCase().endsWith('.docx')) {
      setErrorByRoll((p) => ({ ...p, [rollNumber]: 'Only .docx files are accepted.' }));
      return;
    }
    setBusyRoll(rollNumber);
    try {
      const form = new FormData();
      form.append('rollNumber', rollNumber);
      form.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed.');
      setRoster(data.roster);
    } catch (err) {
      setErrorByRoll((p) => ({
        ...p,
        [rollNumber]: err instanceof Error ? err.message : 'Upload failed.',
      }));
    } finally {
      setBusyRoll(null);
    }
  }

  function handleDeadlinePassedClick() {
    loadRoster();
  }

  const deadlinePassed = isPastDeadline();

  const filtered = (roster || []).filter((s) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return s.rollNumber.toLowerCase().includes(q) || s.name.toLowerCase().includes(q);
  });

  const submittedCount = (roster || []).filter((s) => s.submitted).length;

  return (
    <main style={{ maxWidth: 880, margin: '0 auto', padding: '36px 20px 80px' }}>
      <header style={{ textAlign: 'center', marginBottom: 28, color: 'white' }}>
        <div
          style={{
            fontFamily: 'var(--display)',
            fontWeight: 800,
            fontSize: 13,
            letterSpacing: '0.08em',
            opacity: 0.85,
            marginBottom: 6,
          }}
        >
          EC-334 · GAME DESIGN AND DEVELOPMENT
        </div>
        <h1 style={{ fontSize: 'clamp(28px,5vw,42px)', textShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
          Assignment Submission 📥
        </h1>
        <p style={{ margin: '8px 0 0', opacity: 0.9, fontSize: 15 }}>
          Find your name below, upload your .docx, and you're done.
        </p>
      </header>

      <div
        style={{
          background: 'rgba(255,255,255,0.18)',
          backdropFilter: 'blur(6px)',
          borderRadius: 18,
          padding: '14px 18px',
          marginBottom: 22,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
          color: 'white',
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍  Search your name or roll number…"
          style={{
            flex: 1,
            minWidth: 220,
            border: 'none',
            borderRadius: 12,
            padding: '12px 16px',
            fontSize: 15,
            outline: 'none',
            fontFamily: 'var(--body)',
          }}
        />
        <div style={{ fontWeight: 700, fontFamily: 'var(--display)', whiteSpace: 'nowrap' }}>
          {roster ? `${submittedCount} / ${roster.length} submitted` : 'Loading…'}
        </div>
      </div>

      {roster === null && (
        <div style={{ textAlign: 'center', color: 'white', opacity: 0.85, padding: 40 }}>
          Loading roster…
        </div>
      )}

      {roster !== null && filtered.length === 0 && (
        <div style={{ textAlign: 'center', color: 'white', opacity: 0.85, padding: 40 }}>
          No matches. Check the spelling, or ask your instructor if you're not on the roster yet.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map((s) => {
          const busy = busyRoll === s.rollNumber;
          const error = errorByRoll[s.rollNumber];
          return (
            <div
              key={s.rollNumber}
              style={{
                background: 'var(--card)',
                borderRadius: 18,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                flexWrap: 'wrap',
                boxShadow: '0 6px 20px rgba(31,17,71,0.12)',
              }}
            >
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ fontWeight: 700, fontFamily: 'var(--display)', fontSize: 17 }}>
                  {s.name}
                </div>
                <div style={{ color: 'var(--ink-dim)', fontSize: 13, fontFamily: 'monospace' }}>
                  {s.rollNumber}
                </div>
                {error && (
                  <div style={{ color: '#DC2626', fontSize: 12.5, marginTop: 4, fontWeight: 600 }}>
                    {error}
                  </div>
                )}
              </div>

              {s.submitted ? (
                <span
                  style={{
                    background: 'linear-gradient(135deg,#14B8A6,#0D9488)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: 13,
                    padding: '7px 14px',
                    borderRadius: 999,
                    whiteSpace: 'nowrap',
                  }}
                >
                  ✓ Submitted
                </span>
              ) : deadlinePassed ? (
                <button onClick={handleDeadlinePassedClick} style={btnStyle('#DC2626')}>
                  ✕ Deadline passed
                </button>
              ) : (
                <>
                  <input
                    ref={(el) => {
                      fileInputs.current[s.rollNumber] = el;
                    }}
                    type="file"
                    accept=".docx"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileChosen(s.rollNumber, e.target.files?.[0])}
                  />
                  <button
                    onClick={() => fileInputs.current[s.rollNumber]?.click()}
                    disabled={busy}
                    style={btnStyle('#FF3D81', busy)}
                  >
                    {busy ? 'Uploading…' : '⬆ Upload .docx'}
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>

      <footer style={{ textAlign: 'center', color: 'white', opacity: 0.75, fontSize: 12.5, marginTop: 40 }}>
        Only .docx files are accepted. Uploading again replaces your previous submission.
      </footer>
    </main>
  );
}

function btnStyle(color: string, disabled = false): React.CSSProperties {
  return {
    background: disabled ? '#C4C4C4' : color,
    color: 'white',
    border: 'none',
    borderRadius: 12,
    padding: '10px 16px',
    fontWeight: 700,
    fontSize: 13.5,
    whiteSpace: 'nowrap',
    opacity: disabled ? 0.7 : 1,
  };
}
