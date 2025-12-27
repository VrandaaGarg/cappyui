import '@/app/global.css';
import { RootProvider } from 'fumadocs-ui/provider';
import { Space_Grotesk, Plus_Jakarta_Sans } from 'next/font/google';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
});

const siteConfig = {
  name: 'CappyUI',
  url: 'https://cappyui.com',
  ogImage: 'https://res.cloudinary.com/dyetf2h9n/image/upload/v1766867568/image_xij1nl.png',
  description: 'Copy-paste beautiful animated React components into your apps. Built with React, Tailwind CSS, and Framer Motion. Open-source UI library with 20+ stunning components.',
  creator: 'Vranda Garg',
  twitter: '@VrandaGarg',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'CappyUI - Beautiful Animated React Components | Free UI Library',
    template: '%s | CappyUI - React Component Library',
  },
  description: siteConfig.description,
  keywords: [
    'React Components',
    'UI Library',
    'React UI Kit',
    'Tailwind CSS Components',
    'Framer Motion',
    'Next.js Components',
    'TypeScript UI',
    'Animated Components',
    'Copy Paste Components',
    'Free React Components',
    'Open Source UI',
    'Modern UI Components',
    'Responsive Components',
    'Dark Mode Components',
    'shadcn alternative',
    'Radix UI',
    'Web Components',
    'Frontend Components',
  ],
  authors: [{ name: siteConfig.creator, url: 'https://github.com/VrandaaGarg' }],
  creator: siteConfig.creator,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: 'CappyUI - Beautiful Animated React Components',
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'CappyUI - Beautiful Animated React Components Library',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CappyUI - Beautiful Animated React Components',
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.twitter,
    site: siteConfig.twitter,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: siteConfig.url,
  },
  category: 'technology',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'CappyUI',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web',
  description: siteConfig.description,
  url: siteConfig.url,
  author: {
    '@type': 'Person',
    name: siteConfig.creator,
    url: 'https://github.com/VrandaaGarg',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    ratingCount: '2000',
    bestRating: '5',
    worstRating: '1',
  },
  image: siteConfig.ogImage,
  screenshot: siteConfig.ogImage,
  featureList: [
    'Copy-paste React components',
    'Tailwind CSS styling',
    'Framer Motion animations',
    'Dark mode support',
    'TypeScript support',
    'Fully responsive',
    'Open source',
  ],
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex flex-col min-h-screen font-sans">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
