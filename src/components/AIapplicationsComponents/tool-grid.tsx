"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  SiClaude,
  SiOpenai,
  SiMeta,
  SiClerk,
  SiAppwrite,
  SiNotion,
} from "react-icons/si";
import { RiFirebaseFill, RiGeminiFill, RiReactjsFill } from "react-icons/ri";
import { FaGithubAlt } from "react-icons/fa";
import { VscVscodeInsiders } from "react-icons/vsc";

interface ToolGridProps {
  className?: string;
}

interface GridIcon {
  row: number;
  col: number;
  icon: React.ReactNode;
  name: string;
  bgColor: string;
}

// Define which positions should have icons (0-indexed)
const ICON_POSITIONS: GridIcon[] = [
  {
    row: 3,
    col: 3,
    icon: <SiClaude />,
    name: "Claude",
    bgColor: "#D97757",
  },
  {
    row: 0,
    col: 1,
    icon: <VscVscodeInsiders />,
    name: "OpenAI",
    bgColor: "#31C2AB",
  },
  {
    row: 0,
    col: 3,
    icon: <RiGeminiFill />,
    name: "Gemini",
    bgColor: "#4693E4",
  },
  {
    row: 1,
    col: 0,
    icon: <SiMeta />,
    name: "Meta",
    bgColor: "#2B61E1",
  },
  {
    row: 1,
    col: 2,
    icon: <SiOpenai />,
    name: "Mistral",
    bgColor: "#12A37F",
  },
  {
    row: 1,
    col: 3,
    icon: <FaGithubAlt />,
    name: "Brain",
    bgColor: "#000000",
  },
  {
    row: 2,
    col: 1,
    icon: <SiClerk />,
    name: "AI Brain",
    bgColor: "#000000",
  },
  {
    row: 2,
    col: 2,
    icon: <SiNotion />,
    name: "Sparkles",
    bgColor: "#000000",
  },
  {
    row: 3,
    col: 0,
    icon: <RiFirebaseFill />,
    name: "Robot",
    bgColor: "#FFCC01",
  },
  {
    row: 1,
    col: 1,
    icon: <SiAppwrite />,
    name: "Bot",
    bgColor: "#F12E64",
  },
  {
    row: 3,
    col: 1,
    icon: <RiReactjsFill />,
    name: "Anthropic",
    bgColor: "#00D8FF",
  },
];

// Define custom animation sequence (indices of ICON_POSITIONS array)
const ANIMATION_SEQUENCE = [0, 3, 1, 5, 9, 2, 7, 4, 10, 6, 8];

const ToolGrid = ({ className }: ToolGridProps) => {
  const [activeSequenceIndex, setActiveSequenceIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSequenceIndex((prev) => (prev + 1) % ANIMATION_SEQUENCE.length);
    }, 2000); // Change active icon every 2000ms

    return () => clearInterval(interval);
  }, []);

  // Create a 4x4 grid
  const grid = Array.from({ length: 4 }, (_, rowIndex) =>
    Array.from({ length: 4 }, (_, colIndex) => {
      // Find if this position has an icon
      const iconData = ICON_POSITIONS.find(
        (pos) => pos.row === rowIndex && pos.col === colIndex
      );
      return iconData;
    })
  );

  // Define different neutral shades for empty cells
  const getEmptyBgColor = (rowIndex: number, colIndex: number) => {
    const shades = [
      "bg-neutral-50/80 dark:bg-neutral-900",
      "bg-neutral-50 dark:bg-neutral-800/40",
      "bg-neutral-50 dark:bg-neutral-900/50",
      "bg-neutral-200/50 dark:bg-neutral-950/80",
    ];
    return shades[(rowIndex + colIndex) % shades.length];
  };

  return (
    <div className={cn("flex items-center justify-center ", className)}>
      <div className="grid grid-cols-4 gap-3  p-3 rounded-xl bg-neutral-100 dark:bg-neutral-900/40 border-2 border-neutral-200/60 outline outline-neutral-100 dark:outline-neutral-800/30 dark:border-neutral-800/30">
        {grid.map((row, rowIndex) =>
          row.map((iconData, colIndex) => {
            const key = `${rowIndex}-${colIndex}`;

            // Find the index in ICON_POSITIONS array if this cell has an icon
            const iconIndex = iconData
              ? ICON_POSITIONS.findIndex(
                  (pos) => pos.row === rowIndex && pos.col === colIndex
                )
              : -1;

            // Check if this icon is the currently active one based on sequence
            const currentActiveIconIndex =
              ANIMATION_SEQUENCE[activeSequenceIndex];
            const isActive = iconIndex === currentActiveIconIndex;

            return (
              <motion.div
                key={key}
                className={cn(
                  "relative w-14 h-14  rounded-lg transition-all duration-500",
                  "flex items-center justify-center",
                  iconData
                    ? "border border-neutral-200 dark:border-neutral-700/30 bg-white dark:bg-neutral-800/50"
                    : "border border-neutral-200 dark:border-neutral-800/20 bg-gradient-to-br from-neutral-50 via-neutral-200 to-neutral-200 dark:from-neutral-800/20 dark:via-neutral-900/20 dark:to-black/30"
                )}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: (rowIndex * 4 + colIndex) * 0.05,
                  duration: 1,
                }}
              >
                {/* Inner rounded square */}
                <motion.div
                  className={cn(
                    "w-11 h-11  rounded-lg flex items-center justify-center text-2xl ",
                    iconData
                      ? isActive
                        ? "text-white shadow-lg shadow-neutral-400/50 dark:shadow-neutral-900/80"
                        : "bg-gradient-to-br from-neutral-200 via-neutral-200 to-neutral-400/60 dark:from-neutral-700/50 dark:via-neutral-600/40 dark:to-neutral-600/80 text-neutral-600 dark:text-neutral-400"
                      : getEmptyBgColor(rowIndex, colIndex)
                  )}
                  style={
                    iconData && isActive
                      ? { backgroundColor: iconData.bgColor }
                      : undefined
                  }
                  animate={{
                    opacity: iconData && isActive ? 1 : iconData ? 0.6 : 1,
                    scale: iconData && isActive ? 1.1 : 1,
                  }}
                  transition={{
                    duration: 1.2,
                    ease: "easeInOut",
                  }}
                >
                  {iconData && iconData.icon}
                </motion.div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ToolGrid;
