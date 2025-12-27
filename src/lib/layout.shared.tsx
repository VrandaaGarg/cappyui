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
          <img
            src="https://res.cloudinary.com/dyetf2h9n/image/upload/v1762950787/logo_qu3hmh.png"
            alt="CappyUI Logo"
            className="w-8 h-8 object-contain"
          />
          <span className="font-bold text-lg tracking-tight">
            CappyUI
          </span>
        </div>
      ),
    },
    links: [
      {
        type: "icon",
        url: "https://github.com/VrandaaGarg/cappyui",
        text: "GitHub",
        icon: <SiGithub className="w-5 h-5" />,
        external: true,
      },
    ],
  };
}
