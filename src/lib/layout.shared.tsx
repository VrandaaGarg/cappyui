import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { SiGithub } from "react-icons/si";
import { ThemeToggle } from "@/components/ui/theme-toggle";

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export function baseOptions(): BaseLayoutProps {
  return {
    themeSwitch: {
      enabled: true,
      component: <ThemeToggle />,
    },
    nav: {
      transparentMode: "top",
      title: (
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            {/* Capybara-inspired logo */}
            <svg
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
              aria-label="CappyUI Logo"
            >
              {/* Body */}
              <ellipse cx="16" cy="18" rx="12" ry="10" className="fill-amber-600 dark:fill-amber-500" />
              {/* Head */}
              <circle cx="16" cy="10" r="8" className="fill-amber-700 dark:fill-amber-600" />
              {/* Snout */}
              <ellipse cx="16" cy="13" rx="4" ry="3" className="fill-amber-500 dark:fill-amber-400" />
              {/* Nose */}
              <ellipse cx="16" cy="12" rx="1.5" ry="1" className="fill-neutral-800 dark:fill-neutral-900" />
              {/* Eyes */}
              <circle cx="12" cy="8" r="1.5" className="fill-neutral-800 dark:fill-neutral-900" />
              <circle cx="20" cy="8" r="1.5" className="fill-neutral-800 dark:fill-neutral-900" />
              {/* Eye shine */}
              <circle cx="12.5" cy="7.5" r="0.5" className="fill-white" />
              <circle cx="20.5" cy="7.5" r="0.5" className="fill-white" />
              {/* Ears */}
              <ellipse cx="9" cy="5" rx="2" ry="1.5" className="fill-amber-700 dark:fill-amber-600" />
              <ellipse cx="23" cy="5" rx="2" ry="1.5" className="fill-amber-700 dark:fill-amber-600" />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight">
            Cappy<span className="text-amber-600 dark:text-amber-500">UI</span>
          </span>
        </div>
      ),
    },
    links: [
      {
        type: "icon",
        url: "https://github.com",
        text: "GitHub",
        icon: <SiGithub className="w-5 h-5" />,
        external: true,
      },
    ],
  };
}
