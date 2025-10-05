"use client";

import {
  memo,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
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

const SHIELD_PATH =
  "M221.013 103.932c52.548 33.306 100.022 49.068 140.763 45.34 7.113 143.916-46.033 228.911-140.213 264.379-90.955-33.199-144.759-114.529-140.766-266.562 52.729 2.762 98.324-10.611 140.216-43.157z";

const LOCK_BODY_PATH =
  "M172.442 230.143h98.117c3.965 0 7.208 3.239 7.208 7.204v76.172c0 3.965-3.243 7.208-7.208 7.208h-98.117c-3.966 0-7.208-3.243-7.208-7.208v-76.172c0-3.965 3.242-7.204 7.208-7.204z";

const LOCK_SHACKLE_PATH =
  "M177.326 218.832v-2.761c0-12.522 4.937-23.938 12.89-32.237 8.018-8.357 19.091-13.549 31.285-13.549 12.197 0 23.272 5.189 31.284 13.549 7.956 8.299 12.893 19.711 12.893 32.237v2.761";

const LOCK_KEYHOLE_PATH =
  "M215.584 280.316l-7.779 20.372h27.386l-7.204-20.65c4.573-2.354 7.701-7.119 7.701-12.618 0-7.836-6.352-14.188-14.19-14.188-7.835 0-14.183 6.352-14.183 14.188-.001 5.722 3.388 10.652 8.269 12.896z";

const OUTER_SECURITY_PATHS = [
  "M116.38 461.989c8.925 0 16.606-5.323 20.044-12.966h30.993c2.766 0 5.283-1.131 7.108-2.958a10.023 10.023 0 002.947-7.101v-20.988a224.772 224.772 0 01-18.86-12.691v26.233l-21.97.003c-3.322-7.913-11.143-13.469-20.262-13.469-12.134 0-21.969 9.835-21.969 21.969 0 12.133 9.835 21.968 21.969 21.968zm96.123 7.596v-34.154a271.6 271.6 0 009.064 3.496 282.389 282.389 0 008.46-3.353v34.486c7.481 3.504 12.662 11.097 12.662 19.904 0 12.134-9.834 21.968-21.968 21.968-12.133 0-21.968-9.834-21.968-21.968 0-9.228 5.689-17.125 13.75-20.379zm71.416-38.067h21.97c3.323-7.911 11.143-13.466 20.262-13.466 12.133 0 21.969 9.835 21.969 21.969 0 12.133-9.836 21.968-21.969 21.968-8.925 0-16.607-5.323-20.045-12.966h-30.992a10.026 10.026 0 01-7.108-2.958 10.023 10.023 0 01-2.947-7.101V417.97a236.442 236.442 0 0018.86-12.667v26.215z",
  "M0 338.667c0-8.926 5.323-16.608 12.967-20.045V287.63c0-2.767 1.13-5.283 2.957-7.108a10.023 10.023 0 017.101-2.947h51.186a313.221 313.221 0 006.206 18.859H30.471v21.971c7.911 3.323 13.466 11.143 13.466 20.262 0 12.133-9.835 21.969-21.969 21.969C9.835 360.636 0 350.8 0 338.667zm30.468-140.201l.003 21.969H62.24a429.26 429.26 0 002.978 18.859H23.025a10.018 10.018 0 01-7.101-2.947 10.023 10.023 0 01-2.957-7.108v-30.991C5.323 194.81 0 187.128 0 178.202c0-12.133 9.835-21.968 21.968-21.968 12.134 0 21.969 9.835 21.969 21.968 0 9.12-5.556 16.941-13.469 20.264z",
  "M116.38 49.944c8.925 0 16.606 5.323 20.044 12.967h30.993a10.03 10.03 0 017.108 2.957 10.023 10.023 0 012.947 7.101v33.021a225.476 225.476 0 01-18.86 8.201V80.415h-21.97c-3.324 7.911-11.144 13.466-20.262 13.466-12.134 0-21.969-9.835-21.969-21.969 0-12.132 9.835-21.968 21.969-21.968zm96.123 35.005V42.347c-8.062-3.254-13.75-11.151-13.75-20.378C198.753 9.836 208.588 0 220.721 0c12.134 0 21.968 9.836 21.968 21.969 0 8.806-5.181 16.4-12.662 19.903v42.422a540.733 540.733 0 01-9.092-5.638 274.673 274.673 0 01-8.432 6.293zm93.385-4.538l-21.969.004v31.771a363.038 363.038 0 01-18.86-8.621V72.969c0-2.768 1.128-5.281 2.947-7.101a10.03 10.03 0 017.108-2.957h30.992c3.438-7.645 11.119-12.967 20.045-12.967 12.133 0 21.969 9.835 21.969 21.968 0 12.134-9.836 21.969-21.969 21.969-9.121 0-16.942-5.557-20.263-13.47z",
  "M443 178.202c0 8.926-5.323 16.608-12.967 20.046v30.991c0 2.767-1.13 5.284-2.957 7.108a10.018 10.018 0 01-7.101 2.947h-40.994a395.636 395.636 0 002.835-18.859h30.713v-21.97c-7.911-3.323-13.466-11.144-13.466-20.263 0-12.133 9.835-21.968 21.969-21.968 12.133 0 21.968 9.835 21.968 21.968zM443 338.667c0-8.926-5.323-16.608-12.967-20.045V287.63c0-2.767-1.13-5.283-2.957-7.108a10.023 10.023 0 00-7.101-2.947h-49.94a299.496 299.496 0 01-6.272 18.859h48.766l.003 21.97c-7.913 3.323-13.469 11.142-13.469 20.263 0 12.133 9.835 21.969 21.969 21.969 12.133 0 21.968-9.836 21.968-21.969z",
];

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
  const [lockOpen, setLockOpen] = useState(false);
  const [vaultOpen, setVaultOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const rawMaskId = useId();
  const maskId = useMemo(() => rawMaskId.replace(/:/g, ""), [rawMaskId]);
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
      setLockOpen(false);
      setVaultOpen(false);
      shineControls.set(shineVariants.initial);

      if (!isMountedRef.current || cancelRef.current) return;
      await sleep(500);

      // Phase 1: Animate circuits from center outward
      for (let i = 0; i < CIRCUIT_STEP_COUNT; i++) {
        if (!isMountedRef.current || cancelRef.current) return;
        setCircuitStep(i + 1);
        await sleep(120);
      }

      if (!isMountedRef.current || cancelRef.current) return;
      await sleep(200);

      // Phase 2: Unlock the lock
      if (!isMountedRef.current || cancelRef.current) return;
      setLockOpen(true);
      await sleep(400);

      if (!isMountedRef.current || cancelRef.current) return;

      // Phase 3: Open the vault
      setVaultOpen(true);

      // Trigger shine effect when vault opens
      if (!isMountedRef.current || cancelRef.current) return;
      shineControls.start("active");

      await sleep(600);

      if (!isMountedRef.current || cancelRef.current) return;

      // Phase 4: Hold open state
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
                className="text-neutral-400 dark:text-neutral-700"
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
                  ? "#22d3ee"
                  : isDark
                  ? "#0a0a0a"
                  : "#d4d4d4",
                boxShadow: vaultOpen
                  ? "0 0 30px rgba(34, 211, 238, 0.2), 0 0 60px rgba(34, 211, 238, 0.2), inset 0 0 20px rgba(34, 211, 238, 0.1)"
                  : "0 0 0px rgba(34, 211, 238, 0)",
                borderWidth: "4px",
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-white dark:bg-neutral-950"
                initial={false}
                animate={{
                  borderColor: vaultOpen
                    ? "#22d3ee"
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
                  className="absolute inset-y-0 -left-8 w-12 bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent"
                  style={{ transform: "skewX(-20deg)" }}
                  animate={shineControls}
                  variants={shineVariants}
                />
              </div>

              <svg viewBox="0 0 443 512" className="relative w-16 h-16">
                <defs>
                  <mask id={maskId}>
                    <motion.circle
                      cx="221.5"
                      cy="256"
                      fill="white"
                      r={0}
                      initial={false}
                      animate={{
                        r:
                          circuitStep === 0
                            ? 0
                            : 40 +
                              (Math.min(circuitStep, CIRCUIT_STEP_COUNT) /
                                CIRCUIT_STEP_COUNT) *
                                320,
                      }}
                      transition={{ duration: 0.45, ease: "easeInOut" }}
                    />
                  </mask>
                </defs>

                <g
                  className="text-neutral-400 dark:text-neutral-300"
                  fill="currentColor"
                >
                  <path d={SHIELD_PATH} opacity={0.25} />
                  <path d={LOCK_BODY_PATH} opacity={0.35} />
                  <path d={LOCK_KEYHOLE_PATH} opacity={0.4} />
                  <path
                    d={LOCK_SHACKLE_PATH}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={13}
                    opacity={0.3}
                  />
                  {OUTER_SECURITY_PATHS.map((outerPath) => (
                    <path key={outerPath} d={outerPath} opacity={0.2} />
                  ))}
                </g>

                <g mask={`url(#${maskId})`}>
                  <g
                    className="text-cyan-500 dark:text-cyan-400"
                    fill="currentColor"
                  >
                    <path d={SHIELD_PATH} />
                    {OUTER_SECURITY_PATHS.map((outerPath) => (
                      <path key={outerPath} d={outerPath} />
                    ))}
                  </g>
                  <g
                    className="text-neutral-700 dark:text-neutral-900"
                    fill="currentColor"
                  >
                    <path d={LOCK_BODY_PATH} />
                  </g>
                  <g
                    className="text-cyan-400 dark:text-cyan-300"
                    style={{ opacity: circuitsComplete ? 1 : 0.4 }}
                    fill="currentColor"
                  >
                    <path d={LOCK_KEYHOLE_PATH} />
                  </g>
                </g>

                <motion.g
                  mask={`url(#${maskId})`}
                  className="text-neutral-700 dark:text-neutral-900"
                  initial={false}
                  animate={{
                    rotate: lockOpen ? -28 : 0,
                    y: lockOpen ? -12 : 0,
                    opacity: circuitsComplete ? 1 : circuitStep > 0 ? 0.4 : 0,
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  style={{ transformOrigin: "221.5px 210px" }}
                >
                  <path
                    d={LOCK_SHACKLE_PATH}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={13}
                  />
                </motion.g>
              </svg>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
});

SecureVault.displayName = "SecureVault";

export default SecureVault;
