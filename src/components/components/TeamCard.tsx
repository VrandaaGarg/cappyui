"use client";

import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TeamCardProps {
  className?: string;
}

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

// Team members with basic bio for the callout tags.
const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Raj Gupta",
    role: "Chief Executive Officer",
    image:
      "https://img.freepik.com/premium-photo/happy-proud-prosperous-mid-aged-mature-professional-asian-business-man-ceo-executive-wearing-suit-standing-office-arms-crossed-looking-away-thinking-success-leadership-side-profile-view_220770-5137.jpg",
  },
  {
    name: "Anita Desai",
    role: "Head of Product",
    image:
      "https://img.freepik.com/premium-photo/portrait-business-woman-with-arms-crossed-office_770200-4875.jpg",
  },
  {
    name: "Michael Chen",
    role: "Engineering Director",
    image:
      "https://img.freepik.com/premium-photo/portrait-man-businessman-corporate-man-with-smiling-face_1118350-346.jpg",
  },
  {
    name: "Priya Singh",
    role: "Design Lead",
    image:
      "https://static.vecteezy.com/system/resources/previews/029/771/918/large_2x/portrait-of-a-beautiful-businesswoman-in-modern-office-asian-manager-looking-at-camera-and-smiling-confident-female-ceo-planning-and-managing-company-free-photo.jpeg",
  },
];

// Animation timing - each image is active for 2 seconds
const SCAN_DURATION = 2; // Duration for each image scan
const TOTAL_DURATION = SCAN_DURATION * TEAM_MEMBERS.length; // Total cycle duration

// Sequences keep the scanning frame looping while card content lingers just long enough.
const FRAME_SEQUENCE = [0, 0, 1, 1, 2, 2, 3, 3, 0] as const;
const FRAME_KEYFRAME_TIMES = [0, 0.07, 0.25, 0.32, 0.5, 0.57, 0.75, 0.88, 1];
const CARD_SEQUENCE = [0, 0, 1, 1, 2, 2, 3, 3, 0] as const;
const CARD_KEYFRAME_TIMES = FRAME_KEYFRAME_TIMES;
const SMOOTH_EASE = [0.45, 0, 0.55, 1] as const;

const ACTIVE_IMAGE_SCALE = 1.05;

// Debounce delay for measurements to prevent excessive updates
const MEASUREMENT_DEBOUNCE_MS = 100;

const getImageAnimation = (activeIndex: number) => {
  const filter = CARD_SEQUENCE.map((positionIndex) =>
    positionIndex === activeIndex ? "grayscale(0%)" : "grayscale(100%)"
  );

  const scale = CARD_SEQUENCE.map((positionIndex) =>
    positionIndex === activeIndex ? ACTIVE_IMAGE_SCALE : 1
  );

  return { filter, scale };
};

const getTagAnimation = (activeIndex: number) => {
  const opacity = CARD_SEQUENCE.map((positionIndex) =>
    positionIndex === activeIndex ? 1 : 0
  );

  const y = CARD_SEQUENCE.map((positionIndex) =>
    positionIndex === activeIndex ? 0 : 12
  );

  return { opacity, y };
};

export const TeamCard = memo(({ className }: TeamCardProps) => {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const measurementTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isAnimatingRef = useRef(false);
  const [cardPositions, setCardPositions] = useState<
    { x: number; y: number }[]
  >([]);
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 });
  const [frameRadius, setFrameRadius] = useState(0);

  // Debounced measurement function to prevent excessive updates during animation
  const debouncedUpdateMeasurements = useCallback(() => {
    // Clear existing timeout
    if (measurementTimeoutRef.current) {
      clearTimeout(measurementTimeoutRef.current);
    }

    measurementTimeoutRef.current = setTimeout(() => {
      if (!gridRef.current) {
        return;
      }

      const gridRect = gridRef.current.getBoundingClientRect();
      const positions = cardRefs.current.map((card) => {
        if (!card) {
          return null;
        }

        const rect = card.getBoundingClientRect();

        return {
          x: rect.left - gridRect.left,
          y: rect.top - gridRect.top,
        };
      });

      if (
        positions.length !== TEAM_MEMBERS.length ||
        positions.some((pos) => pos === null)
      ) {
        return;
      }

      const typedPositions = positions as { x: number; y: number }[];

      setCardPositions((previous) => {
        const changed =
          previous.length !== typedPositions.length ||
          previous.some((prevPos, index) => {
            const nextPos = typedPositions[index];
            return (
              Math.abs(prevPos.x - nextPos.x) > 1 ||
              Math.abs(prevPos.y - nextPos.y) > 1
            );
          });

        return changed ? typedPositions : previous;
      });

      const firstCard = cardRefs.current[0];

      if (firstCard) {
        setFrameSize((previous) => {
          const nextWidth = firstCard.offsetWidth;
          const nextHeight = firstCard.offsetHeight;

          if (previous.width !== nextWidth || previous.height !== nextHeight) {
            return { width: nextWidth, height: nextHeight };
          }

          return previous;
        });

        setFrameRadius((previous) => {
          const computedStyle = window.getComputedStyle(firstCard);
          const rawRadius = computedStyle.borderTopLeftRadius || "0";
          const nextRadius = Number.parseFloat(rawRadius) || 0;

          return previous !== nextRadius ? nextRadius : previous;
        });
      }
    }, MEASUREMENT_DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    // Initial measurement
    debouncedUpdateMeasurements();
    window.addEventListener("resize", debouncedUpdateMeasurements);

    return () => {
      window.removeEventListener("resize", debouncedUpdateMeasurements);
      // Clean up timeout on unmount
      if (measurementTimeoutRef.current) {
        clearTimeout(measurementTimeoutRef.current);
      }
    };
  }, [debouncedUpdateMeasurements]);

  // Animation lifecycle management - allow initial measurements
  useEffect(() => {
    // Start with animation flag false to allow initial measurements
    isAnimatingRef.current = false;

    // After initial measurements, we can start preventing updates during animation
    const initTimer = setTimeout(() => {
      // This will be managed by the animation cycle itself
    }, 100);

    return () => {
      clearTimeout(initTimer);
      isAnimatingRef.current = false;
    };
  }, []);

  // Stable border positions - use available positions or fallback to zero
  const borderPositions = useMemo(() => {
    if (cardPositions.length === TEAM_MEMBERS.length) {
      return FRAME_SEQUENCE.map(
        (positionIndex) => cardPositions[positionIndex] || { x: 0, y: 0 }
      );
    }

    return FRAME_SEQUENCE.map(() => ({ x: 0, y: 0 }));
  }, [cardPositions]);

  // Memoize keyframes to prevent recalculation during animation
  const animationKeyframes = useMemo(() => {
    const xKeyframes = borderPositions.map((position) => position.x);
    const yKeyframes = borderPositions.map((position) => position.y);

    return { x: xKeyframes, y: yKeyframes };
  }, [borderPositions]);

  const hasFrameSize = frameSize.width > 0 && frameSize.height > 0;

  const cornerLength = useMemo(() => {
    if (!hasFrameSize) {
      return 16;
    }

    const shortestSide = Math.min(frameSize.width, frameSize.height);
    const desired = shortestSide * 0.15;

    return Math.max(Math.min(desired, shortestSide / 1.8), frameRadius + 8);
  }, [frameSize.height, frameSize.width, frameRadius, hasFrameSize]);

  // Optimized image load handler
  const handleImageLoad = useCallback(() => {
    debouncedUpdateMeasurements();
  }, [debouncedUpdateMeasurements]);

  // Initialize refs array length
  if (cardRefs.current.length !== TEAM_MEMBERS.length) {
    cardRefs.current.length = TEAM_MEMBERS.length;
  }

  return (
    <div
      className={cn("flex flex-col items-center px-6 md:px-8 gap-7", className)}
    >
      {/* Title and Subtitle */}
      <div className="text-center flex flex-col items-center max-w-3xl">
        <span className="text-2xl md:text-4xl  font-bold text-fd-foreground">
          Leadership Spotlight
        </span>
        <span className="text-lg mt-1 md:mt-3 text-fd-muted-foreground">
          Meet the minds shaping our product vision and guiding every launch.
        </span>
      </div>

      {/* 2x2 Grid Container */}
      <div className="relative w-full max-w-md">
        <div ref={gridRef} className="grid grid-cols-2 gap-6 relative">
          {TEAM_MEMBERS.map((member, index) => (
            <motion.div
              key={index}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-black"
              style={{ willChange: "auto", lineHeight: 0 }}
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
            >
              {/* Image */}
              <motion.img
                src={member.image}
                alt={member.name}
                className="absolute inset-0 h-full w-full object-cover block"
                style={{ margin: 0, willChange: "transform, filter" }}
                animate={getImageAnimation(index)}
                transition={{
                  duration: TOTAL_DURATION,
                  times: CARD_KEYFRAME_TIMES,
                  ease: SMOOTH_EASE,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                onLoad={handleImageLoad}
              />

              {/* Active tag */}
              <motion.div
                className="absolute flex flex-col gap-1 text-center inset-x-3 bottom-3 rounded-xl bg-black/75 px-3 py-2 text-white shadow-[0_8px_24px_rgba(15,23,42,0.35)] backdrop-blur"
                style={{ pointerEvents: "none" }}
                animate={getTagAnimation(index)}
                transition={{
                  duration: TOTAL_DURATION,
                  times: CARD_KEYFRAME_TIMES,
                  ease: SMOOTH_EASE,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              >
                <span className="text-[12px] md:text-sm font-semibold leading-tight">
                  {member.name}
                </span>
                <span className="text-[8px] md:text-[12px] font-medium text-white/70 leading-tight">
                  {member.role}
                </span>
              </motion.div>
            </motion.div>
          ))}

          {/* Single Moving Scanning Border */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              width: hasFrameSize ? frameSize.width : "calc(50% - 12px)",
              height: hasFrameSize ? frameSize.height : undefined,
              aspectRatio: hasFrameSize ? undefined : "3/4",
              borderRadius: frameRadius || undefined,
              top: 0,
              left: 0,
              willChange: "transform",
            }}
            animate={{
              x: animationKeyframes.x,
              y: animationKeyframes.y,
            }}
            transition={{
              duration: TOTAL_DURATION,
              times: FRAME_KEYFRAME_TIMES,
              ease: SMOOTH_EASE,
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            <div
              className="absolute inset-0"
              style={{ borderRadius: frameRadius || undefined }}
            >
              {/* Top-left corner */}
              <div
                className="absolute border-[3px] border-blue-500 border-r-0 border-b-0"
                style={{
                  width: cornerLength,
                  height: cornerLength,
                  top: 0,
                  left: 0,
                  borderTopLeftRadius: frameRadius || undefined,
                }}
              />

              {/* Top-right corner */}
              <div
                className="absolute border-[3px] border-blue-500 border-l-0 border-b-0"
                style={{
                  width: cornerLength,
                  height: cornerLength,
                  top: 0,
                  right: 0,
                  borderTopRightRadius: frameRadius || undefined,
                }}
              />

              {/* Bottom-left corner */}
              <div
                className="absolute border-[3px] border-blue-500 border-r-0 border-t-0"
                style={{
                  width: cornerLength,
                  height: cornerLength,
                  bottom: 0,
                  left: 0,
                  borderBottomLeftRadius: frameRadius || undefined,
                }}
              />

              {/* Bottom-right corner */}
              <div
                className="absolute border-[3px] border-blue-500 border-l-0 border-t-0"
                style={{
                  width: cornerLength,
                  height: cornerLength,
                  bottom: 0,
                  right: 0,
                  borderBottomRightRadius: frameRadius || undefined,
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
});

TeamCard.displayName = "TeamCard";
