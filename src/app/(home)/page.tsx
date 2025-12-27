"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Github } from "lucide-react";
import {
  SiReact,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiFramer,
  SiShadcnui,
  SiRadixui,
} from "react-icons/si";
import { TbBrandNextjs } from "react-icons/tb";
import { cn } from "@/lib/utils";
import { Highlighter } from "@/components/ui/highlighter";

const TECH_STACK = [
  { icon: SiReact, name: "React.js" },
  { icon: SiTypescript, name: "TypeScript" },
  { icon: SiJavascript, name: "JavaScript" },
  { icon: SiTailwindcss, name: "Tailwind CSS" },
  { icon: SiFramer, name: "Framer Motion" },
  { icon: TbBrandNextjs, name: "Next.js" },
  { icon: SiShadcnui, name: "shadcn/ui" },
  { icon: SiRadixui, name: "Radix UI" },
];

import AIChat from "@/components/AIapplicationsComponents/ai-chat";
import PinChat from "@/components/AIapplicationsComponents/pin-chat";
import ToolGrid from "@/components/AIapplicationsComponents/tool-grid";
import { ImagePuzzle } from "@/components/components/image-puzzle";
import { BiometricSecurity } from "@/components/components/BiometricSecurity";
import BookAppointment from "@/components/components/book-appointment";
import { MultiFactor } from "@/components/components/MultiFactor";
import { TeamCard } from "@/components/components/TeamCard";

import { SecureVault } from "@/components/components/secure-vault";
import { SecureApp } from "@/components/components/secure-app";

interface BentoItem {
  id: string;
  component: React.ReactNode;
  href: string;
  className: string;
}

const BENTO_ITEMS: BentoItem[] = [
  {
    id: "ai-chat",
    component: <AIChat />,
    href: "/docs/ai-chat",
    className: "md:col-span-4 md:row-span-2",
  },
  {
    id: "biometric",
    component: <BiometricSecurity />,
    href: "/docs/biometric-security",
    className: "md:row-span-2 md:col-span-2",
  },
  {
    id: "tool-grid",
    component: <ToolGrid />,
    href: "/docs/tool-grid",
    className: "md:col-span-2",
  },
  {
    id: "puzzle",
    component: <ImagePuzzle />,
    href: "/docs/puzzle",
    className: "md:col-span-2",
  },
  {
    id: "secure-vault",
    component: <SecureVault />,
    href: "/docs/secure-vault",
    className: "md:col-span-2",
  },
  {
    id: "book-appointment",
    component: <BookAppointment />,
    href: "/docs/book-appointment",
    className: "md:col-span-3",
  },
  {
    id: "secure-app",
    component: <SecureApp />,
    href: "/docs/secure-app",
    className: "md:col-span-3",
  },
  {
    id: "pin-chat",
    component: <PinChat />,
    href: "/docs/pin-chat",
    className: "md:col-span-3",
  },
  {
    id: "team-card",
    component: <TeamCard />,
    href: "/docs/team-card",
    className: "md:row-span-2 md:col-span-3",
  },
  {
    id: "multi-factor",
    component: <MultiFactor />,
    href: "/docs/multi-factor-authentication",
    className: "md:col-span-3",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {BENTO_ITEMS.length}+ Components
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-center tracking-tight text-neutral-900 dark:text-white mb-6"
          >
            Build{" "}
            <Highlighter
              action="highlight"
              color="#069EFE"
              strokeWidth={2}
              animationDuration={1000}
              iterations={1}
              padding={4}
              delay={700}
            >
              stunning
            </Highlighter>{" "}
            interfaces
            <br />
            <span className="text-neutral-400 dark:text-neutral-400">
              <Highlighter
                action="underline"
                color="#0588DA"
                strokeWidth={2}
                animationDuration={800}
                iterations={2}
                padding={2}
                delay={1200}
              >
                faster than ever
              </Highlighter>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-center text-neutral-600 dark:text-neutral-400 text-lg max-w-2xl mx-auto mb-10"
          >
            Copy-paste beautiful animated components into your apps. 
            Built with React, Tailwind CSS, and Framer Motion.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center gap-4"
          >
            <Link
              href="/docs"
              className={cn(
                "inline-flex items-center gap-2 px-6 py-3 rounded-full",
                "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900",
                "font-medium text-sm",
                "hover:bg-neutral-800 dark:hover:bg-neutral-100",
                "transition-colors duration-200"
              )}
            >
              Browse Components
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="https://github.com"
              className={cn(
                "relative inline-flex items-center justify-center p-3 rounded-full",
                "bg-neutral-100 dark:bg-neutral-800",
                "border border-neutral-300 dark:border-neutral-700",
                "text-neutral-700 dark:text-neutral-200",
                "hover:bg-neutral-200 dark:hover:bg-neutral-700",
                "transition-colors duration-200",
                "overflow-hidden"
              )}
            >
              <Github className="w-5 h-5 relative z-10" />
              {/* Infinite shine effect */}
              <div className="absolute inset-0 animate-shine bg-gradient-to-r from-transparent via-white/60 dark:via-white/20 to-transparent" />
            </Link>
          </motion.div>

          {/* Tech Stack - Infinite Marquee */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-16 relative overflow-hidden"
          >
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white dark:from-neutral-950 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-neutral-950 to-transparent z-10 pointer-events-none" />
            
            <div className="flex gap-10 animate-marquee">
              {[...TECH_STACK, ...TECH_STACK].map((tech, index) => (
                <div
                  key={`${tech.name}-${index}`}
                  className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 shrink-0"
                >
                  <tech.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{tech.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        <div className="relative grid grid-cols-1 md:grid-cols-6">
          {BENTO_ITEMS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true, margin: "-50px" }}
              className={cn(
                "group relative",
                "border border-neutral-200 dark:border-neutral-800",
                "transition-all duration-300",
                item.className
              )}
            >
              <div className="block h-full overflow-hidden">
                <div className="relative flex items-center justify-center h-full">
                  {item.component}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
