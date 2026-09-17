import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EC-334 — Assignment Submission',
  description: 'Submit your assignment .docx here.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --grad1: #7C3AED;
            --grad2: #EC4899;
            --grad3: #FB923C;
            --hot: #FF3D81;
            --hot-dark: #E01E68;
            --teal: #14B8A6;
            --teal-dark: #0D9488;
            --amber: #F59E0B;
            --card: #ffffff;
            --ink: #1F1147;
            --ink-dim: #6B5B95;
            --line: #E9DFFB;
            --display: 'Baloo 2', sans-serif;
            --body: 'Inter', sans-serif;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            font-family: var(--body);
            color: var(--ink);
            min-height: 100vh;
            background: linear-gradient(135deg, var(--grad1) 0%, var(--grad2) 55%, var(--grad3) 100%);
            background-attachment: fixed;
          }
          h1, h2, h3 { font-family: var(--display); margin: 0; }
          button { font-family: var(--body); cursor: pointer; }
          ::selection { background: var(--hot); color: white; }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
