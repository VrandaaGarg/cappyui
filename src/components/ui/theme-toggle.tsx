"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    const newTheme = isDark ? "light" : "dark";

    html.classList.remove("light", "dark");
    html.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
    setIsDark(!isDark);
  };

  if (!mounted) {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-lg p-2",
          "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white",
          "hover:bg-neutral-100 dark:hover:bg-neutral-800",
          "transition-colors duration-200",
          className
        )}
        aria-label="Toggle theme"
      >
        <Sun className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "inline-flex items-center justify-center rounded-lg p-2",
        "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white",
        "hover:bg-neutral-100 dark:hover:bg-neutral-800",
        "transition-colors duration-200",
        className
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  );
}
