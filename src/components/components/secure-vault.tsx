"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { cn } from "@/lib/utils";

interface SecureVaultProps {
  className?: string;
}

type PathSegment = {
  cmd: "M" | "L" | "Q" | "Z";
  pts?: number[];
};

const VIEWBOX_WIDTH = 850;
const VIEWBOX_HEIGHT = 450;

const serializePath = (segments: PathSegment[]) =>
  segments
    .map(({ cmd, pts }) =>
      pts && pts.length ? `${cmd} ${pts.join(" ")}` : cmd
    )
    .join(" ");

const mirrorSegments = (segments: PathSegment[]): PathSegment[] =>
  segments.map(({ cmd, pts }) => ({
    cmd,
    pts:
      pts && pts.length
        ? pts.map((value, index) =>
            index % 2 === 1 ? VIEWBOX_HEIGHT - value : value
          )
        : undefined,
  }));

// Vault door SVG path - curved design with smooth bends on both ends
const VAULT_DOOR_PATH =
  "M 400 300 L 400 300 L 400 200 L 350 150 L 400 100 L 400 50 Q 350 0 300 50 L 300 50 L 300 50 L 300 250 L 350 300 L 300 350 L 300 400 Q 350 450 400 400 L 400 400 L 400 400 L 400 300 ";

const DOOR_PATH_SEGMENTS: PathSegment[] = [
  { cmd: "M", pts: [-100, 420] },
  { cmd: "L", pts: [220, 420] },
  { cmd: "Q", pts: [236, 420, 252, 404] },
  { cmd: "L", pts: [280, 368] },
  { cmd: "Q", pts: [296, 352, 314, 352] },
  { cmd: "L", pts: [436, 352] },
  { cmd: "Q", pts: [454, 352, 470, 368] },
  { cmd: "L", pts: [498, 404] },
  { cmd: "Q", pts: [514, 420, 526, 420] },
  { cmd: "L", pts: [VIEWBOX_WIDTH, 420] },
];

const TOP_DOOR_PATH = serializePath(DOOR_PATH_SEGMENTS);
const BOTTOM_DOOR_PATH = serializePath(mirrorSegments(DOOR_PATH_SEGMENTS));

const TOP_DOOR_FILL_PATH = serializePath([
  ...DOOR_PATH_SEGMENTS,
  { cmd: "L", pts: [VIEWBOX_WIDTH, 0] },
  { cmd: "L", pts: [-100, 0] },
  { cmd: "Z" },
]);

const BOTTOM_DOOR_FILL_PATH = serializePath([
  ...mirrorSegments(DOOR_PATH_SEGMENTS),
  { cmd: "L", pts: [VIEWBOX_WIDTH, VIEWBOX_HEIGHT] },
  { cmd: "L", pts: [-100, VIEWBOX_HEIGHT] },
  { cmd: "Z" },
]);

const CIRCUIT_STEP_COUNT = 8;

const shineVariants = {
  initial: { x: "-200%", opacity: 0 },
  active: {
    x: "200%",
    opacity: [0, 0.8, 0],
    transition: {
      duration: 1.2,
      ease: "easeInOut" as const,
    },
  },
};

export const SecureVault = memo(({ className }: SecureVaultProps) => {
  const [circuitStep, setCircuitStep] = useState(0);
  const [vaultOpen, setVaultOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const circuitsComplete = circuitStep >= CIRCUIT_STEP_COUNT;
  const shineControls = useAnimationControls();

  // Detect theme changes
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const cancelRef = useRef(false);
  const timeoutsRef = useRef<number[]>([]);
  const isMountedRef = useRef(true);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    timeoutsRef.current = [];
  }, []);

  const sleep = useCallback((ms: number) => {
    return new Promise<void>((resolve) => {
      const timeoutId = window.setTimeout(() => {
        timeoutsRef.current = timeoutsRef.current.filter(
          (id) => id !== timeoutId
        );
        resolve();
      }, ms);
      timeoutsRef.current.push(timeoutId);
    });
  }, []);

  const runSequence = useCallback(async () => {
    try {
      // Reset to idle
      if (!isMountedRef.current || cancelRef.current) return;
      setCircuitStep(0);
      setVaultOpen(false);
      shineControls.set(shineVariants.initial);

      if (!isMountedRef.current || cancelRef.current) return;
      await sleep(500);

      // Phase 1: Animate circuits (icon fading in)
      for (let i = 0; i < CIRCUIT_STEP_COUNT; i++) {
        if (!isMountedRef.current || cancelRef.current) return;
        setCircuitStep(i + 1);
        await sleep(120);
      }

      if (!isMountedRef.current || cancelRef.current) return;
      await sleep(300);

      // Phase 2: Rotate vault door and open
      if (!isMountedRef.current || cancelRef.current) return;
      setVaultOpen(true);

      // Trigger shine effect when vault opens
      if (!isMountedRef.current || cancelRef.current) return;
      shineControls.start("active");

      await sleep(800);

      if (!isMountedRef.current || cancelRef.current) return;

      // Phase 3: Hold open state
      await sleep(1500);

      if (!isMountedRef.current || cancelRef.current) return;
    } catch (error) {
      // Silently catch errors from cancelled animations
      if (!isMountedRef.current || cancelRef.current) return;
      throw error;
    }
  }, [shineControls, sleep]);

  useEffect(() => {
    isMountedRef.current = true;
    cancelRef.current = false;

    const loop = async () => {
      while (isMountedRef.current && !cancelRef.current) {
        try {
          await runSequence();
        } catch (error) {
          // Break loop on error
          if (!isMountedRef.current || cancelRef.current) break;
          console.error("Animation sequence error:", error);
          break;
        }
      }
    };

    loop();

    return () => {
      isMountedRef.current = false;
      cancelRef.current = true;
      clearAllTimeouts();
      // Stop any ongoing animations
      shineControls.stop();
    };
  }, [clearAllTimeouts, runSequence, shineControls]);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center mx-auto h-[300px] w-full max-w-xs overflow-hidden",
        className
      )}
    >
      {/* Main vault container */}
      <div className="relative w-full h-full">
        <div className="absolute left-4 right-4 top-2 bottom-2 md:left-8 md:right-8 md:top-6 md:bottom-6 border border-neutral-300/40 dark:border-neutral-800/20 outline outline-neutral-200 dark:outline-neutral-900 rounded-[32px] overflow-hidden">
          <div className="absolute inset-0 bg-white dark:bg-neutral-950" />

          <div className="relative w-full h-full flex items-center justify-center">
            {/* Top vault opening line */}
            <motion.svg
              className="absolute top-0 left-0 w-full h-[60%] pointer-events-none z-10"
              viewBox="0 0 750 450"
              initial={{ y: -15 }}
              animate={{ y: vaultOpen ? -60 : -15 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <defs>
                {/* Dark theme gradient */}
                <linearGradient
                  id="topDoorGradientDark"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#171717" />
                  <stop offset="20%" stopColor="#262626" />
                  <stop offset="100%" stopColor="#171717" />
                </linearGradient>
                {/* Light theme gradient */}
                <linearGradient
                  id="topDoorGradientLight"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#e5e5e5" />
                  <stop offset="20%" stopColor="#f5f5f5" />
                  <stop offset="100%" stopColor="#e5e5e5" />
                </linearGradient>
              </defs>
              <motion.path
                d={TOP_DOOR_FILL_PATH}
                fill={
                  isDark
                    ? "url(#topDoorGradientDark)"
                    : "url(#topDoorGradientLight)"
                }
                initial={{ opacity: 1 }}
                animate={{ opacity: vaultOpen ? 0.85 : 1 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
              <motion.path
                d={TOP_DOOR_PATH}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-neutral-300 dark:text-neutral-700"
                initial={{ opacity: 0.85 }}
                animate={{ opacity: vaultOpen ? 1 : 0.85 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
            </motion.svg>

            {/* Bottom vault opening line (inverted) */}
            <motion.svg
              className="absolute bottom-0 left-0 w-full h-[60%] pointer-events-none z-10"
              viewBox="0 0 750 450"
              initial={{ y: 15 }}
              animate={{ y: vaultOpen ? 60 : 15 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <defs>
                {/* Dark theme gradient */}
                <linearGradient
                  id="bottomDoorGradientDark"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#171717" />
                  <stop offset="80%" stopColor="#262626" />
                  <stop offset="100%" stopColor="#171717" />
                </linearGradient>
                {/* Light theme gradient */}
                <linearGradient
                  id="bottomDoorGradientLight"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#e5e5e5" />
                  <stop offset="80%" stopColor="#f5f5f5" />
                  <stop offset="100%" stopColor="#e5e5e5" />
                </linearGradient>
              </defs>
              <motion.path
                d={BOTTOM_DOOR_FILL_PATH}
                fill={
                  isDark
                    ? "url(#bottomDoorGradientDark)"
                    : "url(#bottomDoorGradientLight)"
                }
                initial={{ opacity: 1 }}
                animate={{ opacity: vaultOpen ? 0.85 : 1 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
              <motion.path
                d={BOTTOM_DOOR_PATH}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-neutral-400 dark:text-neutral-700"
                initial={{ opacity: 0.85 }}
                animate={{ opacity: vaultOpen ? 1 : 0.85 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
            </motion.svg>

            {/* Center security icon container */}
            <motion.div
              className="relative z-10 w-24 h-24 flex rounded-full outline-2 outline-neutral-300 dark:outline-neutral-800 items-center justify-center"
              initial={false}
              animate={{
                borderColor: vaultOpen
                  ? isDark
                    ? "#FFFFFF"
                    : "#696969"
                  : isDark
                  ? "#0a0a0a"
                  : "#d4d4d4",
                boxShadow: vaultOpen
                  ? isDark
                    ? "0 0 30px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.15)"
                    : "0 0 30px rgba(0, 0, 0, 0.2), 0 0 60px rgba(0, 0, 0, 0.15), inset 0 0 20px rgba(0, 0, 0, 0.1)"
                  : "0 0 0px rgba(0, 0, 0, 0)",
                borderWidth: "4px",
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-white dark:bg-neutral-950"
                initial={false}
                animate={{
                  borderColor: vaultOpen
                    ? isDark
                      ? "#FFFFFF"
                      : "#000000"
                    : isDark
                    ? "#404040"
                    : "#a3a3a3",
                  borderWidth: "1px",
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{ borderStyle: "solid" }}
              />

              {/* Shine effect overlay */}
              <div className="absolute inset-0 z-20 overflow-hidden rounded-full">
                <motion.div
                  className={`absolute inset-y-0 -left-8 w-12 ${
                    isDark
                      ? "bg-gradient-to-r from-transparent via-white to-transparent"
                      : "bg-gradient-to-r from-transparent via-neutral-200 to-transparent"
                  }`}
                  style={{ transform: "skewX(-20deg)" }}
                  animate={shineControls}
                  variants={shineVariants}
                />
              </div>
              <div
                className="relative rounded-full flex items-center justify-center h-[74px] w-[74px]"
                style={{
                  background: isDark
                    ? "radial-gradient(circle at 30% 30%, #525252 0%, #404040 30%, #262626 60%, #171717 100%)"
                    : "radial-gradient(circle at 30% 30%, #d4d4d4 0%, #a3a3a3 30%, #737373 60%, #525252 100%)",
                }}
              >
                {/* Concentric circles background */}
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  {[...Array(12)].map((_, i) => {
                    const isEven = i % 2 === 0;
                    return (
                      <div
                        key={i}
                        className={`absolute rounded-full ${
                          isEven
                            ? "border border-neutral-400/30 dark:border-neutral-900/20"
                            : "border border-neutral-500/20 dark:border-neutral-800/20"
                        }`}
                        style={{
                          top: `${i * 8.33}%`,
                          left: `${i * 8.33}%`,
                          right: `${i * 8.33}%`,
                          bottom: `${i * 8.33}%`,
                          background: isEven
                            ? isDark
                              ? "radial-gradient(circle at 35% 35%, rgba(64, 64, 64, 0.3) 0%, rgba(38, 38, 38, 0.15) 50%, rgba(23, 23, 23, 0.2) 100%)"
                              : "radial-gradient(circle at 35% 35%, rgba(212, 212, 212, 0.3) 0%, rgba(163, 163, 163, 0.15) 50%, rgba(115, 115, 115, 0.2) 100%)"
                            : isDark
                            ? "radial-gradient(circle at 65% 65%, rgba(38, 38, 38, 0.25) 0%, rgba(64, 64, 64, 0.1) 50%, rgba(82, 82, 82, 0.15) 100%)"
                            : "radial-gradient(circle at 65% 65%, rgba(115, 115, 115, 0.25) 0%, rgba(163, 163, 163, 0.1) 50%, rgba(212, 212, 212, 0.15) 100%)",
                        }}
                      />
                    );
                  })}
                </div>

                {/* SVG Icon */}
                <motion.svg
                  viewBox="250 -25 200 500"
                  className="relative z-10 w-10 h-10"
                  initial={false}
                  animate={{
                    rotate: vaultOpen ? 90 : 0,
                  }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  <motion.path
                    d={VAULT_DOOR_PATH}
                    className={`${isDark ? "text-white" : "text-black"}`}
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={false}
                    animate={{
                      opacity:
                        circuitStep === 0
                          ? 0.3
                          : circuitsComplete
                          ? 1
                          : 0.5 + (circuitStep / CIRCUIT_STEP_COUNT) * 0.5,
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </motion.svg>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
});

SecureVault.displayName = "SecureVault";

export default SecureVault;
