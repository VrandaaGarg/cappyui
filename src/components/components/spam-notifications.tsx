"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Mail,
  Star,
  Gift,
  Zap,
  Trophy,
  Shield,
  Rocket,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationMessage {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  time: string;
  color: string;
}

const ALL_NOTIFICATION_MESSAGES: NotificationMessage[] = [
  {
    id: "1",
    icon: Gift,
    title: "Amazon",
    time: "6 min ago",
    subtitle:
      "Congratulations! You've won a $1,000 gift card.Offer ends in 2 days. So hurry up and claim it before it's too late!",
    color: "bg-orange-500/90",
  },
  {
    id: "2",
    icon: Mail,
    time: "10 min ago",
    title: "Security Alert",
    subtitle:
      "Unusual activity detected. Verify your identity now to avoid account suspension. Offer ends in 2 days. So hurry up and claim it before it's too late!",
    color: "bg-red-500/90",
  },
  {
    id: "3",
    icon: Bell,
    time: "15 min ago",
    title: "Dating App",
    subtitle:
      "You have 23 new matches.nearby Offer ends in 2 days. So hurry up and claim it before it's too late!",
    color: "bg-pink-500/90",
  },
  {
    id: "4",
    icon: Zap,
    time: "24 min ago",
    title: "Flash Sale",
    subtitle:
      "90% off everything - ends in 5 minutes. you should claimed it before it's too late!",
    color: "bg-yellow-500/90",
  },
  {
    id: "5",
    icon: Shield,
    time: "2:48 PM",
    title: "McAfee Security",
    subtitle:
      "3 viruses detected on your device.Go and remove them before it's too late!",
    color: "bg-blue-500/90",
  },
  {
    id: "6",
    icon: Trophy,
    time: "3:12 PM",
    title: "Apple Store",
    subtitle:
      "You're our millionth visitor! Claim your iPhone. It is the best deal!",
    color: "bg-purple-500/90",
  },
  {
    id: "7",
    icon: Rocket,
    time: "3:15 PM",
    title: "Investment Opportunity",
    subtitle:
      "Make $5,000/day working from home.Just click the link and start earning now!",
    color: "bg-green-500/90",
  },
  {
    id: "8",
    icon: Star,
    time: "3:17 PM",
    title: "Exclusive Reward",
    subtitle:
      "Spin the wheel to unlock hidden bonuses.You can win a lifetime supply of apple products.",
    color: "bg-amber-500/90",
  },
];

const MAX_NOTIFICATIONS = 8;
const STAGGER_DELAY = 450;
const DISPLAY_DURATION = 4500;
const FADE_DURATION = 1200;

interface SpamNotificationsProps {
  className?: string;
}

export default function SpamNotifications({
  className,
}: SpamNotificationsProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<
    NotificationMessage[]
  >([]);
  const [animationPhase, setAnimationPhase] = useState<
    "stacking" | "displaying" | "fading"
  >("stacking");
  const [animationCycle, setAnimationCycle] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const isActiveRef = useRef(false);
  const timeoutIdsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const messagesToDisplay = useMemo(
    () => ALL_NOTIFICATION_MESSAGES.slice(0, MAX_NOTIFICATIONS),
    []
  );

  const scheduleTimeout = useCallback((handler: () => void, delay: number) => {
    const timeoutId = setTimeout(() => {
      timeoutIdsRef.current.delete(timeoutId);
      handler();
    }, delay);

    timeoutIdsRef.current.add(timeoutId);
    return timeoutId;
  }, []);

  const clearAllTimeouts = useCallback(() => {
    timeoutIdsRef.current.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    timeoutIdsRef.current.clear();
  }, []);

  const startAnimation = useCallback(() => {
    if (!isActiveRef.current) {
      return;
    }

    clearAllTimeouts();
    setVisibleNotifications([]);
    setAnimationPhase("stacking");

    // Update cycle first, then add notifications after a small delay
    setAnimationCycle((prev) => {
      const newCycle = prev + 1;

      // Add notifications one by one with staggered timing
      messagesToDisplay.forEach((notification, index) => {
        scheduleTimeout(() => {
          if (!isActiveRef.current) {
            return;
          }
          setVisibleNotifications((prev) => [...prev, notification]);
        }, index * STAGGER_DELAY + 150); // Small delay to ensure cycle is updated
      });

      return newCycle;
    });

    const totalMessages = messagesToDisplay.length;
    const stackingDuration = totalMessages * STAGGER_DELAY + 650;

    // After all notifications are added, allow them to linger before fading out
    scheduleTimeout(() => {
      if (!isActiveRef.current) {
        return;
      }
      setAnimationPhase("displaying");
      scheduleTimeout(() => {
        if (!isActiveRef.current) {
          return;
        }
        setAnimationPhase("fading");
        scheduleTimeout(() => {
          if (!isActiveRef.current) {
            return;
          }
          setVisibleNotifications([]); // Clear notifications first
          scheduleTimeout(() => {
            if (!isActiveRef.current) {
              return;
            }
            startAnimation(); // Restart the cycle after clearing
          }, 200);
        }, FADE_DURATION);
      }, DISPLAY_DURATION);
    }, stackingDuration); // Updated to account for the delay offset
  }, [clearAllTimeouts, messagesToDisplay, scheduleTimeout]);

  useEffect(() => {
    isActiveRef.current = true;
    setIsMounted(true);

    return () => {
      isActiveRef.current = false;
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  useEffect(() => {
    if (isMounted) {
      startAnimation();
    }
  }, [isMounted, startAnimation]);

  const positions = useMemo(
    () => [
      { x: 0, y: 0, rotate: 0 },
      { x: 30, y: -40, rotate: 5 },
      { x: -35, y: 35, rotate: -6 },
      { x: 85, y: -20, rotate: 3 },
      { x: -70, y: 55, rotate: -4 },
      { x: 100, y: -60, rotate: 4 },
      { x: -25, y: 20, rotate: -3 },
      { x: 0, y: 0, rotate: 0 },
    ],
    []
  );

  const fallbackPosition = useMemo(() => ({ x: 0, y: 0, rotate: 0 }), []);

  const getNotificationPosition = useCallback(
    (index: number) => positions[index] || fallbackPosition,
    [fallbackPosition, positions]
  );

  return (
    <div
      className={cn(
        "relative flex items-center justify-center min-h-[400px] w-full  rounded-xl overflow-hidden",
        className
      )}
    >
      <div className="relative w-full max-w-4xl h-[400px]">
        <AnimatePresence>
          {isMounted &&
            visibleNotifications.map((notification, index) => {
              const position = getNotificationPosition(index);
              const IconComponent = notification.icon;

              return (
                <motion.div
                  key={`${animationCycle}-${notification.id}-${index}`}
                  className="absolute left-1/2 top-1/2 w-52 md:w-80"
                  initial={{
                    opacity: 0,
                    scale: 0.5,
                    x: "-50%",
                    y: "-50%",
                    rotate: 0,
                  }}
                  animate={{
                    opacity: animationPhase === "fading" ? 0 : 1,
                    scale: animationPhase === "fading" ? 0.5 : 1,
                    x: `calc(-50% + ${position.x}px)`,
                    y: `calc(-50% + ${position.y}px)`,
                    rotate: position.rotate,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.5,
                    transition: { duration: 0.4, ease: "easeIn" },
                  }}
                  transition={{
                    duration: 0.8,
                    ease: [0.2, 0.8, 0.2, 1],
                    delay: 0,
                  }}
                  style={{
                    zIndex: index + 1,
                    willChange: "transform, opacity",
                  }}
                >
                  <div className="relative overflow-hidden rounded-lg md:rounded-2xl border border-neutral-300/70 dark:border-white/20 shadow-2xl shadow-white/70 dark:shadow-black/30 backdrop-blur-2xl bg-white/80 dark:bg-neutral-900/80">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-white/5 dark:to-transparent" />
                    <div className="relative p-3 md:p-4">
                      <div className=" gap-2 md:gap-3">
                        <div className="flex-shrink-0 flex">
                          <div className="flex items-center">
                            <div
                              className={cn(
                                "md:w-5 md:h-5 w-3.5 h-3.5 rounded-sm md:rounded-md flex items-center relative justify-center shadow-lg",
                                notification.color
                              )}
                            >
                              {/* <FaBell className="w-4 h-4 text-yellow-400 absolute -top-2 -left-2" /> */}
                              <IconComponent className="md:w-3 md:h-3 h-2 w-2 text-white" />
                            </div>
                            <span className="font-semibold ml-2 my-auto text-neutral-900 dark:text-white text-xs md:text-sm mb-0.5 truncate">
                              {notification.title}
                            </span>
                          </div>

                          <div className="ml-auto text-xs text-neutral-500 dark:text-neutral-400">
                            {notification.time}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 md:pt-0.5">
                          <p className="text-[10px] md:text-xs text-neutral-700 dark:text-neutral-300 line-clamp-2 leading-relaxed">
                            {notification.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>
    </div>
  );
}
