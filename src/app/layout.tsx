import '@/app/global.css';
import { RootProvider } from 'fumadocs-ui/provider';
import { Space_Grotesk, Plus_Jakarta_Sans } from 'next/font/google';
import type { Metadata } from 'next';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: {
    default: 'CappyUI - Beautiful React Components',
    template: '%s | CappyUI',
  },
  description: 'Copy-paste beautiful animated components into your apps. Built with React, Tailwind CSS, and Framer Motion.',
  keywords: ['React', 'UI Components', 'Tailwind CSS', 'Framer Motion', 'Next.js', 'TypeScript'],
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen font-sans">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
