import '@/app/global.css';
import { RootProvider } from 'fumadocs-ui/provider';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
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
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
