"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import { MdEmail } from "react-icons/md";
import { SiAppwrite } from "react-icons/si";
import { FaApple } from "react-icons/fa";
import { SiClerk } from "react-icons/si";

import { RiFirebaseFill } from "react-icons/ri";

import { cn } from "@/lib/utils";
import { SiMongodb } from "react-icons/si";

const fingerprintPaths = [
  "M32.18,105.73c0.7-1.11,2.16-1.44,3.27-0.74c1.11,0.7,1.44,2.16,0.74,3.27l-4.81,7.68c-0.7,1.11-2.16,1.44-3.27,0.74c-1.11-0.7-1.44-2.16-0.74-3.27L32.18,105.73L32.18,105.73z",
  "M6.57,75.32c0.33,1.27-0.42,2.57-1.69,2.9c-1.27,0.33-2.57-0.42-2.9-1.69c-0.39-1.5-0.73-3.01-1.02-4.54c-0.28-1.52-0.5-3.03-0.66-4.54c-0.1-0.98-0.18-1.98-0.22-2.99C0.02,63.37,0,62.36,0,61.44C0,44.47,6.88,29.11,18,18C29.11,6.88,44.47,0,61.44,0c16.97,0,32.34,6.83,43.47,17.91c11.11,11.06,17.97,26.36,17.97,43.3c0,1.31-1.07,2.38-2.38,2.38c-1.31,0-2.38-1.07-2.38-2.38c0-15.64-6.33-29.74-16.56-39.93C91.3,11.06,77.12,4.76,61.44,4.76c-15.65,0-29.82,6.34-40.08,16.6C11.11,31.62,4.76,45.79,4.76,61.44c0,1.04,0.02,1.97,0.06,2.8c0.04,0.91,0.11,1.82,0.2,2.73c0.15,1.4,0.35,2.79,0.61,4.17C5.89,72.51,6.2,73.9,6.57,75.32L6.57,75.32z",
  "M12.97,96.87c-0.99,0.86-2.49,0.75-3.35-0.24c-0.86-0.99-0.75-2.49,0.24-3.35c0.6-0.52,1.13-1.14,1.58-1.86c0.47-0.74,0.86-1.61,1.17-2.6c1.59-5.06,0.63-10.34-0.34-15.69c-0.66-3.64-1.33-7.31-1.3-11.14c0.12-19.6,12.38-35.58,28.42-43.77c6.73-3.44,14.15-5.5,21.63-5.89c7.51-0.39,15.08,0.93,22.07,4.25C98.7,24,111.38,41.37,114.02,72.13c0.11,1.31-0.87,2.46-2.18,2.57c-1.31,0.11-2.46-0.87-2.57-2.18c-2.47-28.79-14.02-44.89-28.21-51.64c-6.26-2.98-13.05-4.15-19.8-3.81c-6.79,0.35-13.55,2.24-19.71,5.38C26.96,29.89,15.82,44.34,15.71,62c-0.02,3.4,0.61,6.86,1.23,10.29c1.08,5.94,2.14,11.8,0.21,17.95c-0.43,1.38-1,2.62-1.69,3.72C14.76,95.07,13.92,96.04,12.97,96.87L12.97,96.87z",
  "M109.22,82.01c0-1.32,1.07-2.38,2.38-2.38s2.38,1.07,2.38,2.38v9.98c0,1.32-1.07,2.38-2.38,2.38s-2.38-1.07-2.38-2.38V82.01L109.22,82.01z",
  "M20.01,106.56c-0.98,0.87-2.48,0.78-3.35-0.2c-0.87-0.98-0.78-2.48,0.2-3.35c2.95-2.6,5.1-5.96,6.34-10.17c1.28-4.34,1.6-9.61,0.85-15.92c-1.38-6.78-1.63-13.04-0.82-18.69c0.84-5.91,2.84-11.15,5.89-15.63c0.74-1.08,2.22-1.36,3.3-0.62c1.08,0.74,1.36,2.22,0.62,3.3c-2.64,3.87-4.37,8.44-5.11,13.62c-0.73,5.13-0.5,10.84,0.77,17.07c0.03,0.12,0.06,0.24,0.07,0.36c0.84,6.97,0.45,12.88-1.01,17.85C26.26,99.28,23.63,103.36,20.01,106.56L20.01,106.56z",
  "M44.18,34.97c-1.14,0.66-2.59,0.27-3.25-0.87c-0.66-1.14-0.27-2.59,0.87-3.25c2.66-1.54,5.5-2.76,8.43-3.65c8.04-2.44,16.77-2.37,24.71,0.41c7.98,2.8,15.15,8.32,20.03,16.77c1.63,2.81,3,5.96,4.06,9.45c1.51,4.98,2.54,10.54,3.07,16.65c0.52,6.01,0.55,12.61,0.09,19.79c0,0.07-0.01,0.13-0.02,0.2l-1.66,16.38c-0.13,1.3-1.29,2.26-2.6,2.13c-1.3-0.13-2.26-1.29-2.13-2.6l1.66-16.4l0-0.01c0.44-6.91,0.41-13.29-0.09-19.1c-0.5-5.82-1.46-11.05-2.86-15.66c-0.94-3.11-2.17-5.92-3.63-8.45c-4.27-7.4-10.53-12.23-17.48-14.67c-6.99-2.45-14.68-2.51-21.77-0.36C49.04,32.53,46.55,33.6,44.18,34.97L44.18,34.97z",
  "M38.95,98.15c-0.23,1.29-1.46,2.16-2.75,1.93c-1.29-0.23-2.16-1.46-1.93-2.75c0.55-3.08,0.86-6.53,0.97-10.29c0.11-3.81,0.02-7.98-0.24-12.44c-0.05-0.96-0.14-2.15-0.22-3.31c-0.54-7.59-0.97-13.71,3.47-21.6c0.98-1.74,2.15-3.36,3.55-4.84c1.4-1.48,3.01-2.82,4.84-3.99c0.12-0.08,0.24-0.14,0.37-0.19c2.71-1.3,5.4-2.31,8.09-2.97c2.77-0.68,5.52-0.98,8.23-0.83c1.31,0.07,2.32,1.18,2.25,2.49c-0.07,1.31-1.18,2.32-2.49,2.25c-2.25-0.12-4.54,0.13-6.87,0.7c-2.32,0.57-4.7,1.46-7.12,2.62c-1.47,0.95-2.75,2.01-3.84,3.17c-1.12,1.19-2.07,2.49-2.86,3.91c-3.74,6.66-3.36,12.14-2.88,18.94c0.07,1,0.14,2.04,0.22,3.38c0.26,4.54,0.35,8.84,0.24,12.83C39.85,91.22,39.53,94.9,38.95,98.15L38.95,98.15z",
  "M72.44,44.51c-1.12-0.68-1.47-2.15-0.79-3.26c0.68-1.12,2.14-1.47,3.26-0.79c0.73,0.45,1.44,0.93,2.13,1.45c0.68,0.51,1.35,1.07,2.02,1.68c9.06,8.23,12.13,21.46,12.33,35.3c0.19,13.48-2.34,27.54-4.66,37.91c-0.28,1.28-1.55,2.09-2.83,1.8c-1.28-0.28-2.09-1.55-1.8-2.83c2.26-10.12,4.74-23.81,4.55-36.83c-0.18-12.66-2.88-24.65-10.79-31.84c-0.55-0.5-1.12-0.97-1.69-1.4C73.6,45.25,73.02,44.86,72.44,44.51L72.44,44.51z",
  "M43.15,119.69c-0.76,1.07-2.24,1.33-3.31,0.57c-1.07-0.76-1.33-2.24-0.57-3.31c1.68-2.37,3.1-4.97,4.26-7.79c1.16-2.84,2.06-5.93,2.68-9.27c1.16-6.23,0.61-14.17,0.08-21.67c-0.18-2.53-0.35-5-0.46-7.54c-0.16-3.71-0.23-7.35,0.46-10.66c0.75-3.61,2.37-6.74,5.62-9.02c0.73-0.51,1.52-0.97,2.37-1.36c0.85-0.39,1.77-0.74,2.76-1.02c0.74-0.21,1.47-0.38,2.18-0.5c4.87-0.83,8.73,0.43,11.71,3.03c2.83,2.47,4.75,6.11,5.93,10.24c0.35,1.24,0.64,2.53,0.87,3.85c0.12,0.72,0.23,1.45,0.31,2.18c0.08,0.72,0.15,1.46,0.2,2.22c0.5,7.54,0.17,16.95-0.85,26.16c-0.98,8.83-2.6,17.53-4.75,24.3c-0.4,1.25-1.73,1.94-2.98,1.55c-1.25-0.4-1.94-1.73-1.55-2.98c2.04-6.43,3.59-14.81,4.54-23.38c0.99-8.95,1.31-18.06,0.83-25.34c-0.04-0.63-0.1-1.29-0.18-1.97c-0.07-0.64-0.17-1.28-0.28-1.91c-0.2-1.14-0.45-2.26-0.75-3.35c-0.94-3.31-2.4-6.15-4.48-7.96c-1.92-1.67-4.47-2.47-7.77-1.91c-0.53,0.09-1.09,0.22-1.68,0.39c-0.77,0.22-1.46,0.47-2.07,0.76c-0.62,0.29-1.17,0.6-1.64,0.93c-2.09,1.46-3.16,3.59-3.68,6.09c-0.58,2.79-0.51,6.1-0.37,9.49c0.1,2.25,0.28,4.81,0.46,7.43c0.54,7.78,1.12,16.01-0.16,22.85c-0.68,3.65-1.67,7.04-2.96,10.2C46.64,114.11,45.04,117.02,43.15,119.69L43.15,119.69z",
  "M59.44,62.15c-0.24-1.29,0.62-2.53,1.91-2.76c1.29-0.24,2.53,0.62,2.76,1.91c1.21,6.52,1.79,13.11,1.81,19.73c0.02,6.59-0.52,13.21-1.54,19.84c-0.2,1.29-1.41,2.18-2.71,1.98c-1.29-0.2-2.18-1.41-1.98-2.71c0.99-6.38,1.51-12.76,1.49-19.11C61.16,74.7,60.6,68.4,59.44,62.15L59.44,62.15z",
  "M56.72,108.31c0.28-1.28,1.55-2.09,2.83-1.8c1.28,0.28,2.09,1.55,1.8,2.83l-2.08,9.37c-0.28,1.28-1.55,2.09-2.83,1.8c-1.28-0.28-2.09-1.55-1.8-2.83L56.72,108.31L56.72,108.31z",
];

interface SecureAppProps {
  className?: string;
}

interface OrbitNodeConfig {
  id: string;
  direction: "left" | "right" | "center";
  icon: IconType;
  position: { x: number; y: number };
  connector: string;
}

const ORBIT_CONFIG: OrbitNodeConfig[] = [
  {
    id: "top-left",
    direction: "left",
    icon: MdEmail,
    position: { x: 150, y: 180 },
    connector: "M150 180 H206 Q 220 186 238 220 T 256 256",
  },
  {
    id: "top-right",
    direction: "right",
    icon: SiAppwrite,
    position: { x: 362, y: 180 },
    connector: "M362 180 H306 Q 292 186 274 220 T 256 256",
  },
  {
    id: "mid-right",
    direction: "right",
    icon: FaApple,
    position: { x: 362, y: 260 },
    connector: "M362 260 L 256 256",
  },
  {
    id: "bottom-right",
    direction: "right",
    icon: SiMongodb,
    position: { x: 362, y: 332 },
    connector: "M362 332 H306 Q 292 326 274 292 T 256 256",
  },
  {
    id: "bottom-left",
    direction: "left",
    icon: SiClerk,
    position: { x: 150, y: 332 },
    connector: "M150 332 H206 Q 220 326 238 292 T 256 256",
  },
  {
    id: "mid-left",
    direction: "left",
    icon: RiFirebaseFill,
    position: { x: 150, y: 260 },
    connector: "M150 260 L 256 256",
  },
];

const RINGS = [
  {
    scale: (240 / 512) * 100,
    className: "border border-neutral-200/20 dark:border-white/5",
  },
  {
    scale: (340 / 512) * 100,
    className: "border border-neutral-300/30 dark:border-white/10",
  },
  {
    scale: (440 / 512) * 100,
    className: "border border-neutral-400/40 dark:border-neutral-400/15",
  },
  {
    scale: (540 / 512) * 100,
    className: "border border-neutral-500/30 dark:border-neutral-500/10",
  },
];

const DASHED_RING = {
  scale: (208 / 512) * 100,
  className:
    "border border-neutral-400/40 dark:border-neutral-400/20 border-dashed",
};

const CORE_RING = {
  scale: (72 / 512) * 100,
  className:
    "border border-neutral-300/50 dark:border-neutral-300/30 bg-white/80 dark:bg-black/80",
};
const DIRECTION_SHIFT: Record<OrbitNodeConfig["direction"], number> = {
  left: -12,
  right: 12,
  center: 0,
};

const FINGERPRINT_VARIANTS = {
  idle: {
    stroke: "transparent",
    fill: "rgba(115,115,115,0.15)",
    opacity: 0.4,
  },
  active: {
    stroke: "transparent",
    fill: "#000000", // Black for light mode, will be overridden in dark mode
    opacity: 1,
  },
  activeDark: {
    stroke: "transparent",
    fill: "#ffffff", // White for dark mode
    opacity: 1,
  },
};

const BEAM_DURATION_MS = 900;
const NODE_NUDGE_DURATION = 190;

type OrbitPhase = "scanning" | "beam" | "hold";

export const SecureApp = memo(({ className }: SecureAppProps) => {
  const [fingerprintStep, setFingerprintStep] = useState(0);
  const [scanIteration, setScanIteration] = useState(0);
  const [beamCycle, setBeamCycle] = useState(0);
  const [beamActive, setBeamActive] = useState(false);
  const [nodesShifted, setNodesShifted] = useState(false);
  const [phase, setPhase] = useState<OrbitPhase>("scanning");

  const cancelRef = useRef(false);
  const timeoutsRef = useRef<number[]>([]);

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

  const orbitNodes = useMemo(() => ORBIT_CONFIG, []);

  const runSequence = useCallback(async () => {
    setPhase("scanning");
    setFingerprintStep(0);
    if (cancelRef.current) return;

    await sleep(220);
    const totalPaths = fingerprintPaths.length;
    for (let i = 0; i < totalPaths; i++) {
      if (cancelRef.current) return;
      setFingerprintStep(i + 1);
      await sleep(95);
    }

    setFingerprintStep(totalPaths);

    if (cancelRef.current) return;
    await sleep(200);

    if (cancelRef.current) return;
    setPhase("beam");
    setBeamActive(true);
    setBeamCycle((iteration) => iteration + 1);

    await sleep(Math.floor(BEAM_DURATION_MS * 0.6));
    if (cancelRef.current) return;

    setNodesShifted(true);
    await sleep(NODE_NUDGE_DURATION);
    if (cancelRef.current) return;

    setNodesShifted(false);
    const remainingBeam = Math.max(
      0,
      Math.floor(BEAM_DURATION_MS * 0.4) - NODE_NUDGE_DURATION
    );
    if (remainingBeam > 0) {
      await sleep(remainingBeam);
      if (cancelRef.current) return;
    }

    setBeamActive(false);
    setPhase("hold");

    await sleep(480);

    if (cancelRef.current) return;
    setScanIteration((iteration) => iteration + 1);
  }, [sleep]);

  useEffect(() => {
    cancelRef.current = false;

    const loop = async () => {
      while (!cancelRef.current) {
        await runSequence();
      }
    };

    loop();

    return () => {
      cancelRef.current = true;
      clearAllTimeouts();
    };
  }, [clearAllTimeouts, runSequence]);

  const fingerprintPathsMemo = useMemo(() => fingerprintPaths, []);
  const totalFingerprintPaths = fingerprintPathsMemo.length;
  const isScanningPhase =
    phase === "scanning" && fingerprintStep < totalFingerprintPaths;

  return (
    <div>
      <div
        className={cn(
          "relative flex items-center mx-auto  justify-center h-[200px] md:h-[300px] max-w-lg  overflow-hidden rounded-[28px] ",
          className
        )}
      >
        <div className="relative aspect-square w-full max-w-lg overflow-hidden rounded-[24px] ">
          <div className="absolute inset-0 " />
          <div className="absolute inset-0">
            <div className="pointer-events-none absolute inset-0"></div>
            <svg viewBox="0 0 512 512" className="relative z-10 h-full w-full">
              <defs>
                {/* Grey connector gradients for both modes */}
                <linearGradient
                  id="connectorGradient"
                  x1="256"
                  y1="256"
                  x2="470"
                  y2="470"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#9CA3AF" stopOpacity="0.75" />
                  <stop offset="45%" stopColor="#6B7280" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#4B5563" stopOpacity="0.1" />
                </linearGradient>

                {/* Light mode beam gradient */}
                <linearGradient
                  id="beamGradientLight"
                  x1="256"
                  y1="256"
                  x2="460"
                  y2="460"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#000000" stopOpacity="1" />
                  <stop offset="45%" stopColor="#000000" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </linearGradient>

                {/* Dark mode beam gradient */}
                <linearGradient
                  id="beamGradientDark"
                  x1="256"
                  y1="256"
                  x2="460"
                  y2="460"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                  <stop offset="45%" stopColor="#ffffff" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
              </defs>

              {orbitNodes.map((node) => (
                <path
                  key={node.id}
                  d={node.connector}
                  fill="none"
                  stroke="url(#connectorGradient)"
                  strokeWidth={1}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}

              {beamActive &&
                orbitNodes.map((node) => (
                  <g key={`${node.id}-beam-${beamCycle}`}>
                    <motion.path
                      d={node.connector}
                      fill="none"
                      stroke="url(#beamGradientLight)"
                      strokeWidth={1}
                      strokeLinecap="round"
                      initial={{ pathLength: 0.08, pathOffset: 1, opacity: 0 }}
                      animate={{
                        pathLength: 0.1,
                        pathOffset: 0.1,
                        opacity: [0, 0.9, 0],
                      }}
                      transition={{
                        duration: BEAM_DURATION_MS / 1000,
                        ease: "easeInOut",
                      }}
                      className="dark:hidden"
                    />
                    <motion.path
                      d={node.connector}
                      fill="none"
                      stroke="url(#beamGradientDark)"
                      strokeWidth={1}
                      strokeLinecap="round"
                      initial={{ pathLength: 0.08, pathOffset: 1, opacity: 0 }}
                      animate={{
                        pathLength: 0.1,
                        pathOffset: 0.1,
                        opacity: [0, 0.9, 0],
                      }}
                      transition={{
                        duration: BEAM_DURATION_MS / 1000,
                        ease: "easeInOut",
                      }}
                      className="hidden dark:block"
                    />
                  </g>
                ))}
            </svg>
          </div>

          <div className="pointer-events-none absolute left-1/2 top-1/2 z-50 flex h-12 w-12 md:h-20 md:w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-700 bg-gradient-to-br from-neutral-200 via-neutral-300 to-neutral-400 dark:from-neutral-800 dark:via-neutral-900 dark:to-black">
            {/* Animated border overlay */}
            <motion.div
              className="absolute inset-0 rounded-full border-[2px] border-neutral-400/70 dark:border-neutral-400/30 bg-neutral-200/20 dark:bg-neutral-100/10 pointer-events-none"
              initial={{ opacity: 0, scale: 1 }}
              animate={{
                opacity: nodesShifted ? 1 : 0,
                scale: nodesShifted ? [1, 1.15, 1.08] : 1,
              }}
              transition={{
                scale: {
                  duration: 0.4,
                  ease: [0.34, 1.56, 0.64, 1],
                },
                opacity: {
                  duration: 0.2,
                  ease: "easeOut",
                },
              }}
            />
            <div className="relative h-9 w-9 md:h-16 md:w-16">
              {isScanningPhase ? (
                <motion.div
                  key={`scan-halo-${scanIteration}`}
                  className="absolute inset-0 rounded-full border border-black/20 dark:border-white/20"
                  initial={{ opacity: 0.35, scale: 0.92 }}
                  animate={{
                    opacity: [0.4, 0.1, 0.4],
                    scale: [0.92, 1.05, 0.92],
                  }}
                  transition={{
                    duration: 1.8,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                />
              ) : (
                <div className="absolute inset-0 rounded-full border border-black/18 dark:border-white/18 opacity-40" />
              )}
              <motion.svg
                viewBox="0 0 128 128"
                className="absolute inset-0"
                strokeWidth={1}
                fill="none"
                style={{ transform: "scale(0.8)", transformOrigin: "center" }}
              >
                {fingerprintPathsMemo.map((d, index) => (
                  <g key={d}>
                    {/* Light mode fingerprint */}
                    <motion.path
                      d={d}
                      variants={FINGERPRINT_VARIANTS}
                      initial="idle"
                      animate={fingerprintStep > index ? "active" : "idle"}
                      transition={{ duration: 0.32, ease: "easeOut" }}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="dark:hidden"
                    />
                    {/* Dark mode fingerprint */}
                    <motion.path
                      d={d}
                      variants={FINGERPRINT_VARIANTS}
                      initial="idle"
                      animate={fingerprintStep > index ? "activeDark" : "idle"}
                      transition={{ duration: 0.32, ease: "easeOut" }}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="hidden dark:block"
                    />
                  </g>
                ))}
              </motion.svg>
              {isScanningPhase ? (
                <motion.div
                  key={`scan-bar-${scanIteration}`}
                  className="absolute inset-0 rounded-full bg-[radial-gradient(circle,_rgba(0,0,0,0.28)_0%,_rgba(255,255,255,0)_70%)] dark:bg-[radial-gradient(circle,_rgba(255,255,255,0.28)_0%,_rgba(0,0,0,0)_70%)]"
                  initial={{ opacity: 0.15, scale: 0.85 }}
                  animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.85, 1, 0.85] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ) : (
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,_rgba(0,0,0,0.22)_0%,_rgba(255,255,255,0.18)_55%,_rgba(255,255,255,0)_85%)] dark:bg-[radial-gradient(circle,_rgba(255,255,255,0.22)_0%,_rgba(0,0,0,0.18)_55%,_rgba(0,0,0,0)_85%)]" />
              )}
            </div>
          </div>

          {orbitNodes.map((node) => (
            <motion.div
              key={node.id}
              className="pointer-events-none absolute z-50 backdrop-blur-2xl flex md:h-14 w-11 h-11 md:w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-300/75 dark:border-neutral-600/75 bg-gradient-to-br from-neutral-200/85 via-neutral-300/90 to-neutral-400/95 dark:from-neutral-800/85 dark:via-neutral-900/90 dark:to-black/95 shadow-[0_8px_24px_rgba(0,0,0,0.25)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.55)]"
              animate={{
                x: nodesShifted ? DIRECTION_SHIFT[node.direction] : 0,
              }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 16,
              }}
              style={{
                left: `${(node.position.x / 512) * 100}%`,
                top: `${(node.position.y / 512) * 100}%`,
              }}
            >
              <node.icon className="md:h-6 md:w-6 w-5 h-5 text-black dark:text-white" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
});

SecureApp.displayName = "SecureApp";

export default SecureApp;
