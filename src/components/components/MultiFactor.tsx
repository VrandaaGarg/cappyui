"use client";

import React, { memo, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MultiFactorProps {
  className?: string;
}

// Animation constants
const MOVE_DURATION = 0.3; // Duration to move border to next field
const DIGIT_DELAY = 0.2; // Delay after border arrives before digit appears
const COMPLETE_DELAY = 0.15; // Delay before showing all borders
const POP_DURATION = 0.4; // Duration for popping animation
const HOLD_DURATION = 0.5; // How long to hold the complete code
const CYCLE_DELAY = 0.4; // Delay before starting next cycle

// Sample OTP digits that will be animated
const OTP_DIGITS = ["3", "5", "8", "1", "2", "9"];

// Pre-create arrays to avoid re-creating on every render
const BORDER_INDICES = Array.from({ length: 6 }, (_, i) => i);
const EMPTY_DIGITS = Array(6).fill("");

export const MultiFactor = memo(({ className }: MultiFactorProps) => {
  const [displayedDigits, setDisplayedDigits] =
    useState<string[]>(EMPTY_DIGITS);
  const [borderPosition, setBorderPosition] = useState(-1);
  const [isAllComplete, setIsAllComplete] = useState(false);
  const [poppingIndices, setPoppingIndices] = useState<Set<number>>(new Set());
  const [isDesktop, setIsDesktop] = useState(false);

  // Store all timeout IDs for proper cleanup
  const timeoutIdsRef = useRef<Set<NodeJS.Timeout>>(new Set());

  // Track screen size for responsive spacing with debounce
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;

    const checkScreenSize = () => {
      const isDesktopSize = window.innerWidth >= 768;
      if (isDesktopSize !== isDesktop) {
        setIsDesktop(isDesktopSize);
      }
    };

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkScreenSize, 150);
    };

    checkScreenSize();
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [isDesktop]);

  useEffect(() => {
    // Capture the current ref value to avoid the warning about ref changing during cleanup
    const timeoutIds = timeoutIdsRef.current;

    const addTimeout = (id: NodeJS.Timeout) => {
      timeoutIds.add(id);
    };

    const runAnimation = () => {
      // Reset state
      setDisplayedDigits([...EMPTY_DIGITS]);
      setBorderPosition(-1);
      setIsAllComplete(false);
      setPoppingIndices(new Set());

      const startClearingSequence = () => {
        // Hold complete state briefly, then clear all at once
        const holdTimeout = setTimeout(() => {
          setIsAllComplete(false);
          setDisplayedDigits([...EMPTY_DIGITS]);

          // Restart animation after clearing
          const cycleTimeout = setTimeout(() => {
            runAnimation();
          }, CYCLE_DELAY * 1000);
          addTimeout(cycleTimeout);
        }, HOLD_DURATION * 1000);
        addTimeout(holdTimeout);
      };

      const animateNextDigit = (index: number) => {
        if (index >= 6) {
          // All digits are filled, show borders on all fields
          setBorderPosition(-1); // Hide moving border
          setIsAllComplete(true);

          // Start simultaneous popping animation
          const completeTimeout = setTimeout(() => {
            // Pop all borders at once
            setPoppingIndices(new Set([0, 1, 2, 3, 4, 5]));

            // After pop completes, start clearing sequence
            const popTimeout = setTimeout(() => {
              startClearingSequence();
            }, POP_DURATION * 1000);
            addTimeout(popTimeout);
          }, COMPLETE_DELAY * 1000);
          addTimeout(completeTimeout);
          return;
        }

        // Move border to current position
        setBorderPosition(index);

        // After border moves, show the digit
        const moveTimeout = setTimeout(() => {
          setDisplayedDigits((prev) => {
            const newDigits = [...prev];
            newDigits[index] = OTP_DIGITS[index];
            return newDigits;
          });

          // Move to next digit after a short delay
          const digitTimeout = setTimeout(() => {
            animateNextDigit(index + 1);
          }, DIGIT_DELAY * 1000);
          addTimeout(digitTimeout);
        }, MOVE_DURATION * 1000);
        addTimeout(moveTimeout);
      };

      // Start the animation sequence
      const initialTimeout = setTimeout(() => {
        animateNextDigit(0);
      }, 500); // Initial delay
      addTimeout(initialTimeout);
    };

    runAnimation();

    // Cleanup all timeouts on unmount
    return () => {
      timeoutIds.forEach((id) => clearTimeout(id));
      timeoutIds.clear();
    };
  }, []);

  return (
    <div
      className={cn("flex items-center justify-center p-3 md:p-8", className)}
    >
      <div className="w-full max-w-lg mx-auto">
        {/* Container with rounded border */}
        <div className="relative p-6 md:p-12 rounded-sm md:rounded-xl border border-neutral-300/40 dark:border-neutral-700/30 outline-2 outline-neutral-200/70 dark:outline-neutral-800/40  bg-white dark:bg-neutral-900/40">
          {/* OTP Input Fields */}
          <div className="flex justify-center mb-8">
            <div className="relative flex gap-3 md:gap-4">
              {/* Moving blue Border */}
              <motion.div
                className="absolute w-9 h-12 md:w-16 md:h-20 rounded-sm md:rounded-xl border-[3px] border-blue-400 dark:border-blue-500 bg-blue-50/30 dark:bg-blue-950/30 shadow-lg shadow-blue-500/50 pointer-events-none z-10"
                initial={{ opacity: 0, scale: 1, x: 0 }}
                animate={{
                  opacity: borderPosition >= 0 && !isAllComplete ? 1 : 0,
                  scale: borderPosition >= 0 ? [1, 1.08, 1] : 1,
                  x:
                    borderPosition >= 0
                      ? borderPosition * (isDesktop ? 80 : 48)
                      : borderPosition === -1 && isAllComplete
                      ? 5 * (isDesktop ? 80 : 48)
                      : 0,
                }}
                transition={{
                  x: {
                    duration: MOVE_DURATION,
                    ease: [0.25, 0.1, 0.25, 1],
                  },
                  scale: {
                    duration: MOVE_DURATION,
                    ease: [0.34, 1.56, 0.64, 1],
                  },
                  opacity: {
                    duration: 0.15,
                    ease: "easeOut",
                  },
                }}
              >
                <motion.div
                  className="absolute bottom-2 h-[1.5px] w-[70%] left-1/2 -translate-x-1/2 bg-blue-500 "
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                />
              </motion.div>

              {/* Individual Borders for Complete State - Same styling as moving border */}
              {BORDER_INDICES.map((index) => {
                const isPopping = poppingIndices.has(index);
                return (
                  <motion.div
                    key={`border-${index}`}
                    className="absolute w-9 h-12 md:w-16 md:h-20 rounded-sm md:rounded-xl border-[2.5px] border-blue-400 dark:border-blue-500 bg-blue-50/30 dark:bg-blue-950/30 shadow-lg shadow-blue-500/50 pointer-events-none z-10"
                    initial={{ opacity: 0, scale: 1 }}
                    animate={{
                      opacity: isPopping ? [1, 0] : isAllComplete ? 1 : 0,
                      scale: isPopping ? [1, 1.3] : 1,
                    }}
                    style={{
                      left: `${index * (isDesktop ? 80 : 48)}px`,
                      top: 0,
                    }}
                    transition={{
                      opacity: {
                        duration: 0.5,
                        ease: "easeOut",
                      },
                      scale: {
                        duration: 0.5,
                        ease: [0.34, 1.56, 0.64, 1],
                      },
                    }}
                  />
                );
              })}

              {/* Input Fields */}
              {BORDER_INDICES.map((index) => {
                const isPopping = poppingIndices.has(index);
                const hasDigit = !!displayedDigits[index];
                return (
                  <div
                    key={index}
                    className={cn(
                      "relative w-9 h-12 md:w-16 md:h-20 rounded-sm md:rounded-xl border",
                      "flex items-center justify-center text-xl md:text-2xl font-bold",
                      "border-neutral-300 dark:border-neutral-700/50 bg-white dark:bg-neutral-900 shadow-lg shadow-neutral-400/10"
                    )}
                  >
                    {/* Digit Display */}
                    <motion.span
                      key={`${index}-${displayedDigits[index]}`}
                      initial={{ opacity: 0, scale: 0.3, y: 10 }}
                      animate={{
                        opacity: hasDigit ? (isPopping ? [1, 0] : 1) : 0,
                        scale: hasDigit ? (isPopping ? [1, 1.15] : 1) : 0.3,
                        y: hasDigit ? 0 : 10,
                      }}
                      transition={{
                        opacity: {
                          duration: isPopping ? 0.5 : 0.2,
                          ease: "easeOut",
                        },
                        scale: {
                          duration: isPopping ? 0.5 : 0.2,
                          ease: isPopping ? [0.34, 1.56, 0.64, 1] : "easeOut",
                        },
                        y: { duration: 0.2, ease: "easeOut" },
                      }}
                      className="text-neutral-900 text-[12px] md:text-base font-mono dark:text-neutral-100"
                    >
                      {displayedDigits[index]}
                    </motion.span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Description Text */}
          <div className="text-center font-mono flex flex-col gap-1 mt-12">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.3 }}
              className="text-sm  text-neutral-900 dark:text-neutral-100"
            >
              Enter the OTP sent to your Email
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="text-xs text-neutral-600 dark:text-neutral-400"
            >
              Check your inbox for the 6-digit verification code
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  );
});

MultiFactor.displayName = "MultiFactor";
