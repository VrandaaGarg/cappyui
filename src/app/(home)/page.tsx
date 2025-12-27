"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Github, Plus, Star } from "lucide-react";
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
import { SparklesText } from "@/components/ui/sparkles-text";

const USER_AVATARS = [
  { name: "Alex", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
  { name: "Sarah", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
  { name: "Mike", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { name: "Emma", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
  { name: "John", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
];

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
import RealTimeEditor from "@/components/components/real-time-editor";
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
    id: "book-appointment",
    component: <RealTimeEditor />,
    href: "/docs/book-appointment",
    className: "p-4 md:col-span-3",
  },
  {
    id: "secure-app",
    component: <SecureApp />,
    href: "/docs/secure-app",
    className: "  md:col-span-3",
  },
  {
    id: "ai-chat",
    component: <AIChat />,
    href: "/docs/ai-chat",
    className: "p-4 md:p-0 md:col-span-4 md:row-span-2",
  },
  {
    id: "biometric",
    component: <BiometricSecurity />,
    href: "/docs/biometric-security",
    className: "p-4 md:p-0 md:row-span-2 md:col-span-2",
  },
  {
    id: "tool-grid",
    component: <ToolGrid />,
    href: "/docs/tool-grid",
    className: "p-4 md:p-0 md:col-span-2",
  },
  {
    id: "puzzle",
    component: <ImagePuzzle />,
    href: "/docs/puzzle",
    className: "p-4 md:p-0 md:col-span-2",
  },
  {
    id: "secure-vault",
    component: <SecureVault />,
    href: "/docs/secure-vault",
    className: "p-4 md:p-0 md:col-span-2",
  },
  
  {
    id: "pin-chat",
    component: <PinChat />,
    href: "/docs/pin-chat",
    className: "p-4 md:p-0 md:col-span-3",
  },
  {
    id: "team-card",
    component: <TeamCard />,
    href: "/docs/team-card",
    className: "p-4 md:p-0 md:row-span-2 md:col-span-3",
  },
  {
    id: "multi-factor",
    component: <MultiFactor />,
    href: "/docs/multi-factor-authentication",
    className: "p-4 md:p-0 md:col-span-3",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
       

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                The UI library your project deserves
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold  text-center tracking-tight text-neutral-900 dark:text-white mb-6"
          >
            Build{" "}
            <SparklesText
              colors={{ first: "#FFD700", second: "#FFA500" }}
              sparklesCount={8}
            >
              <Highlighter
                action="highlight"
                color="#069EFE"
                strokeWidth={2}
                animationDuration={1000}
                iterations={1}
                padding={4}
                delay={500}
              >
                stunning
              </Highlighter>
            </SparklesText>{" "}
            interfaces
            <br />
            <span className="text-neutral-800 dark:text-neutral-200">
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
              href="https://github.com/VrandaaGarg/cappyui"
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

          {/* Social Proof - User Avatars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-col items-center gap-3 mt-12"
          >
            <div className="flex items-center -space-x-3">
              {USER_AVATARS.map((user, index) => (
                <motion.div
                  key={user.name}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  className="relative"
                >
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-neutral-900 object-cover ring-2 ring-neutral-100 dark:ring-neutral-800"
                  />
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.8 }}
                className="w-10 h-10 z-20 rounded-full border-2 border-white dark:border-neutral-900 bg-neutral-900 dark:bg-white flex items-center justify-center ring-2 ring-neutral-100 dark:ring-neutral-800"
              >
                <span className=" text-xs font-semibold text-white dark:text-neutral-900">
                  +2k
                </span>
              </motion.div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Loved by <span className="font-semibold text-neutral-900 dark:text-white">2,000+</span> developers
              </span>
            </div>
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
        <div className="relative grid grid-cols-1 md:grid-cols-6 border border-neutral-200 dark:border-neutral-800">
          {/* Grid corner icons */}
          <Plus className="absolute -top-3 -left-3 w-6 h-6 z-20 text-neutral-300 dark:text-neutral-700" strokeWidth={1} />
          <Plus className="absolute -top-3 -right-3 w-6 h-6 z-20 text-neutral-300 dark:text-neutral-700" strokeWidth={1} />
          <Plus className="absolute -bottom-3 -left-3 w-6 h-6 z-20 text-neutral-300 dark:text-neutral-700" strokeWidth={1} />
          <Plus className="absolute -bottom-3 -right-3 w-6 h-6 z-20 text-neutral-300 dark:text-neutral-700" strokeWidth={1} />

          {BENTO_ITEMS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0}}
              whileInView={{ opacity: 1}}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true, margin: "-50px" }}
              className={cn(
                "group relative",
                "border border-neutral-200 dark:border-neutral-900",
                "-m-px",
                "transition-all duration-300",
                item.className
              )}
            >
              <div className={`block h-full overflow-hidden ${item.id=="secure-app" ? "scale-115": ""} `}>
                <div className="relative flex items-center justify-center h-full">
                  {item.component}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-neutral-100 dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-8">
          <p className="text-neutral-600 dark:text-neutral-400 text-lg text-center">
            Built by{" "}
            <a
              href="https://github.com/vrandagarg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-800 dark:text-neutral-200 underline underline-offset-4 hover:text-neutral-950 dark:hover:text-white transition-colors"
            >
              Vranda Garg
            </a>
            . The source code is available on{" "}
            <a
              href="https://github.com/VrandaaGarg/cappyui"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-800 dark:text-neutral-200 underline underline-offset-4 hover:text-neutral-950 dark:hover:text-white transition-colors"
            >
              GitHub
            </a>
            .
          </p>
         
        </div>
      </footer>
    </main>
  );
}
