import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Paste Vault - Private Scratchpad',
  description: 'Privacy-first paste scratchpad with local storage',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="bg-[#1e1e1e] text-neutral-100 h-full antialiased overflow-hidden">{children}</body>
    </html>
  );
}