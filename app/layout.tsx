import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Tailwind Visualizer', description: 'Visual Tailwind CSS website builder' };
const themeScript = `document.documentElement.classList.toggle('dark',/tv-theme=dark/.test(document.cookie))`;
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body>{children}</body>
    </html>
  );
}
