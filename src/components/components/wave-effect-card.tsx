"use client";

import React, {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { HiMiniLockClosed } from "react-icons/hi2";

interface CardItem {
  id: number;
  label: string;
  width: "sm" | "md" | "lg" | "xl";
}

interface CardPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface WaveEffectCardProps {
  items?: string[];
  waveSpeed?: number;
  waveThickness?: number;
  fadeWidth?: number;
  baseOpacity?: number;
  activeOpacity?: number;
  className?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  icon?: React.ReactNode;
  glowDuration?: number;
}

const SECURITY_WORDS = [
  "Encrypt", "Shield", "Guard", "Secure", "Protect",
  "Private", "Safety", "Locked", "Cipher", "Verify",
  "Trust", "Defense", "Firewall", "Auth", "Token",
  "Hash", "SSL", "VPN", "2FA", "Biometric",
  "Access", "Vault", "Key", "Secret", "Stealth",
  "Armor", "Sentinel", "Fortress", "Barrier", "Filter",
  "Sandbox", "Proxy", "Audit", "Comply", "GDPR",
  "Zero-Trust", "E2E", "AES", "RSA", "HTTPS",
];

const DEFAULT_ITEMS = Array(80)
  .fill(null)
  .map((_, i) => SECURITY_WORDS[i % SECURITY_WORDS.length]);

const WIDTH_CLASSES: Record<CardItem["width"], string> = {
  sm: "w-14 sm:w-16",
  md: "w-18 sm:w-20",
  lg: "w-22 sm:w-24",
  xl: "w-26 sm:w-28",
};

const WIDTH_PATTERN: CardItem["width"][] = [
  "md", "lg", "sm", "xl", "md", "sm", "lg", "md", "xl", "sm",
  "lg", "md", "sm", "xl", "lg", "md", "sm", "lg", "lg", "md",
  "sm", "xl", "lg", "md", "sm", "lg", "md", "md", "xl", "sm",
  "lg", "md", "sm", "xl", "lg", "md", "sm", "lg", "xl", "md",
  "sm", "lg", "md", "xl", "sm", "md", "lg", "sm", "xl", "md",
];

// Smooth easing function for wave transitions
const easeInOutSine = (t: number): number => {
  return -(Math.cos(Math.PI * t) - 1) / 2;
};

const calculateOpacity = (
  distance: number,
  innerRadius: number,
  outerRadius: number,
  fadeWidth: number,
  baseOpacity: number,
  activeOpacity: number
): number => {
  const innerFadeStart = innerRadius - fadeWidth;
  const outerFadeEnd = outerRadius + fadeWidth;

  if (distance < innerFadeStart || distance > outerFadeEnd) {
    return baseOpacity;
  }

  if (distance >= innerRadius && distance <= outerRadius) {
    return activeOpacity;
  }

  if (distance >= innerFadeStart && distance < innerRadius) {
    const t = (distance - innerFadeStart) / fadeWidth;
    const easedT = easeInOutSine(t);
    return baseOpacity + (activeOpacity - baseOpacity) * easedT;
  }

  if (distance > outerRadius && distance <= outerFadeEnd) {
    const t = (distance - outerRadius) / fadeWidth;
    const easedT = easeInOutSine(t);
    return activeOpacity - (activeOpacity - baseOpacity) * easedT;
  }

  return baseOpacity;
};

const Card = memo(
  ({
    item,
    opacity,
    cardRef,
  }: {
    item: CardItem;
    opacity: number;
    cardRef: (el: HTMLDivElement | null) => void;
  }) => (
    <div
      ref={cardRef}
      className={cn(
        "h-7 sm:h-8 rounded-md border border-neutral-200/80 dark:border-neutral-700/80",
        "bg-neutral-200/50 dark:bg-neutral-900/80 flex items-center justify-center",
        "text-xs font-mono font-medium text-neutral-500 dark:text-neutral-400",
        "transition-opacity duration-100",
        WIDTH_CLASSES[item.width]
      )}
      style={{ opacity }}
    >
      <span className="truncate px-1.5">{item.label}</span>
    </div>
  )
);

Card.displayName = "Card";

type AnimationPhase = "charging" | "pulse" | "wave" | "idle";

export const WaveEffectCard = memo(
  ({
    items = DEFAULT_ITEMS,
    waveSpeed = 100,
    waveThickness = 80,
    fadeWidth = 50,
    baseOpacity = 0.2,
    activeOpacity = 0.75,
    className,
    title = "We're serious about privacy.",
    subtitle = "Your data is built with privacy at its core.",
    description = "We never train on your data.",
    icon,
    glowDuration = 0.6,
  }: WaveEffectCardProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRefsMap = useRef<Map<number, HTMLDivElement>>(new Map());
    const animationFrameRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);

    const [cardOpacities, setCardOpacities] = useState<Map<number, number>>(new Map());
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [animationPhase, setAnimationPhase] = useState<AnimationPhase>("charging");
    const [rippleKey, setRippleKey] = useState(0);

    const cardItems = useMemo<CardItem[]>(
      () =>
        items.map((label, index) => ({
          id: index,
          label,
          width: WIDTH_PATTERN[index % WIDTH_PATTERN.length],
        })),
      [items]
    );

    const maxRadius = useMemo(() => {
      return Math.sqrt(
        Math.pow(containerSize.width / 2, 2) +
        Math.pow(containerSize.height / 2, 2)
      );
    }, [containerSize]);

    const getCardPosition = useCallback((id: number): CardPosition | null => {
      const card = cardRefsMap.current.get(id);
      const container = containerRef.current;
      if (!card || !container) return null;

      const cardRect = card.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      return {
        x: cardRect.left - containerRect.left + cardRect.width / 2,
        y: cardRect.top - containerRect.top + cardRect.height / 2,
        width: cardRect.width,
        height: cardRect.height,
      };
    }, []);

    // Wave animation loop
    const animate = useCallback(
      (timestamp: number) => {
        if (startTimeRef.current === null) {
          startTimeRef.current = timestamp;
        }

        const elapsed = timestamp - startTimeRef.current;
        const currentRadius = (elapsed * waveSpeed) / 1000;
        const totalCycleDistance = maxRadius + waveThickness + fadeWidth * 2;

        // Check if wave cycle completed
        if (currentRadius >= totalCycleDistance) {
          // Wave complete, reset all opacities to base and transition to charging
          const resetOpacities = new Map<number, number>();
          cardItems.forEach((item) => {
            resetOpacities.set(item.id, baseOpacity);
          });
          setCardOpacities(resetOpacities);

          // Cancel animation and transition phase
          if (animationFrameRef.current !== null) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
          }
          startTimeRef.current = null;
          setAnimationPhase("charging");
          return;
        }

        const innerRadius = Math.max(0, currentRadius - waveThickness);
        const outerRadius = currentRadius;

        const centerX = containerSize.width / 2;
        const centerY = containerSize.height / 2;

        const newOpacities = new Map<number, number>();

        cardItems.forEach((item) => {
          const position = getCardPosition(item.id);
          if (position) {
            const distance = Math.sqrt(
              Math.pow(position.x - centerX, 2) +
              Math.pow(position.y - centerY, 2)
            );

            const opacity = calculateOpacity(
              distance,
              innerRadius,
              outerRadius,
              fadeWidth,
              baseOpacity,
              activeOpacity
            );

            newOpacities.set(item.id, opacity);
          } else {
            newOpacities.set(item.id, baseOpacity);
          }
        });

        setCardOpacities(newOpacities);
        animationFrameRef.current = requestAnimationFrame(animate);
      },
      [
        cardItems,
        containerSize,
        maxRadius,
        waveSpeed,
        waveThickness,
        fadeWidth,
        baseOpacity,
        activeOpacity,
        getCardPosition,
      ]
    );

    // Handle phase transitions - charging builds up, pulse releases, then wave starts
    const handleChargingComplete = useCallback(() => {
      if (animationPhase === "charging") {
        setAnimationPhase("pulse");
        setRippleKey((prev) => prev + 1);
      }
    }, [animationPhase]);

    const handlePulseComplete = useCallback(() => {
      if (animationPhase === "pulse") {
        setAnimationPhase("wave");
      }
    }, [animationPhase]);

    // Start wave animation when phase is "wave"
    useEffect(() => {
      if (animationPhase === "wave" && containerSize.width > 0 && containerSize.height > 0) {
        startTimeRef.current = null;
        animationFrameRef.current = requestAnimationFrame(animate);
      }

      return () => {
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
      };
    }, [animationPhase, animate, containerSize]);

    // Measure container size
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          setContainerSize({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      });

      resizeObserver.observe(container);

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    const setCardRef = useCallback(
      (id: number) => (el: HTMLDivElement | null) => {
        if (el) {
          cardRefsMap.current.set(id, el);
        } else {
          cardRefsMap.current.delete(id);
        }
      },
      []
    );

    // Icon button animation variants - charging builds energy, pulse releases it
    const iconButtonVariants = {
      idle: {
        scale: 1,
        boxShadow: "0 0 0px rgba(59, 130, 246, 0)",
      },
      charging: {
        scale: [1, 1.1, 1.08],
        boxShadow: [
          "0 0 0px rgba(59, 130, 246, 0)",
          "0 0 35px rgba(59, 130, 246, 0.4), 0 0 70px rgba(59, 130, 246, 0.2)",
          "0 0 45px rgba(59, 130, 246, 0.5), 0 0 90px rgba(59, 130, 246, 0.25)",
        ],
      },
      pulse: {
        scale: [1.08, 0.92, 1],
        boxShadow: [
          "0 0 45px rgba(59, 130, 246, 0.5), 0 0 90px rgba(59, 130, 246, 0.25)",
          "0 0 15px rgba(59, 130, 246, 0.2)",
          "0 0 0px rgba(59, 130, 246, 0)",
        ],
      },
    };

    const getIconAnimationState = () => {
      if (animationPhase === "charging") return "charging";
      if (animationPhase === "pulse") return "pulse";
      return "idle";
    };

    return (
      <div className="max-w-xl relative mx-auto h-96 overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-900 bg-white dark:bg-neutral-950 shadow-sm">
        <div
          ref={containerRef}
          className={cn(
            "flex absolute -top-8 -left-8 w-[calc(100%+4rem)] flex-wrap gap-2 justify-center items-center p-4 select-none pointer-events-none",
            "opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]",
            className
          )}
        >
          {cardItems.map((item) => (
            <Card
              key={item.id}
              item={item}
              opacity={cardOpacities.get(item.id) ?? baseOpacity}
              cardRef={setCardRef(item.id)}
            />
          ))}
        </div>

        {/* Center content overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col space-y-4 items-center justify-center pointer-events-none z-10">
          <div className="relative">
            {/* Ripple div that emanates from button with radial fade */}
            <AnimatePresence>
              {(animationPhase === "pulse" || animationPhase === "wave") && (
                <motion.div
                  key={rippleKey}
                  className="absolute inset-0 rounded-full"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{
                    scale: 8,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 1.2,
                    ease: "easeOut",
                  }}
                  style={{
                    transformOrigin: "center",
                    background: "radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(59, 130, 246, 0) 70%)",
                  }}
                />
              )}
            </AnimatePresence>

            {/* Main icon button */}
            <motion.div
              className={cn(
                "relative rounded-2xl p-4",
                "bg-gradient-to-br from-white to-neutral-200 dark:from-neutral-800 dark:to-neutral-900",
                "border-t border-l border-white outline-2 outline-neutral-200/50 dark:outline-neutral-800 dark:border-neutral-600/80",
                "shadow-xl shadow-blue-500/10"
              )}
              variants={iconButtonVariants}
              initial="idle"
              animate={getIconAnimationState()}
              transition={{
                duration: animationPhase === "charging" ? glowDuration : 0.35,
                ease: animationPhase === "charging" ? [0.4, 0, 0.2, 1] : [0.25, 0.1, 0.25, 1],
                times: animationPhase === "charging" ? [0, 0.5, 1] : [0, 0.3, 1],
              }}
              onAnimationComplete={
                animationPhase === "charging"
                  ? handleChargingComplete
                  : animationPhase === "pulse"
                    ? handlePulseComplete
                    : undefined
              }
            >
              {icon || <HiMiniLockClosed className="w-8 h-8 text-blue-500 dark:text-blue-500" />}
            </motion.div>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <span className="text-2xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white text-center">
              {title}
            </span>
            <span className="text-sm sm:text-sm text-neutral-600 dark:text-neutral-400 text-center max-w-sm leading-relaxed">
              {subtitle} {description}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

WaveEffectCard.displayName = "WaveEffectCard";

export default WaveEffectCard;
