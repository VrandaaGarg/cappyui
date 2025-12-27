"use client";

import React, { memo, useCallback, useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pin, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { BsFillPinAngleFill } from "react-icons/bs";

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
}

interface ListItem {
  id: string;
  type: "heading" | "chat";
  data?: Chat;
  title?: string;
  count?: number;
}

// Sample chat data
const SAMPLE_CHATS: Chat[] = [
  {
    id: "1",
    title: "Architecture of Cloud",
    lastMessage: "AWS vs Azure vs GCP",
    timestamp: "2 min ago",
  },
  {
    id: "2",
    title: "React Best Practices",
    lastMessage: "Optimizing component rendering",
    timestamp: "5 min ago",
  },
  {
    id: "3",
    title: "Database Design",
    lastMessage: "Normalization vs denormalization trade-offs",
    timestamp: "1 hour ago",
  },
  {
    id: "4",
    title: "API Development",
    lastMessage: "RESTful API design principles",
    timestamp: "2 hours ago",
  },
  {
    id: "5",
    title: "DevOps Pipeline",
    lastMessage: "CI/CD best practices and automation",
    timestamp: "1 day ago",
  },
  {
    id: "6",
    title: "Machine Learning",
    lastMessage: "Introduction to neural networks",
    timestamp: "2 days ago",
  },
];

const DEFAULT_PINNED_CHATS = ["1", "2"];
const STORAGE_KEY = "pin-chat-pinned-ids";

interface ChatItemProps {
  chat: Chat;
  isPinned: boolean;
  onTogglePin: (chatId: string) => void;
}

interface HeadingItemProps {
  title: string;
  count: number;
  icon: React.ReactNode;
}

// Heading component with smooth layout animation
const HeadingItem = memo(({ title, count, icon }: HeadingItemProps) => {
  return (
    <motion.div
      layout
      layoutId={`heading-${title}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        layout: {
          type: "spring",
          stiffness: 400,
          damping: 30,
          mass: 0.8,
        },
        opacity: { duration: 0.2 },
      }}
      className="flex items-center gap-2 relative z-10 py-1"
    >
      {icon}
      <span className="text-md text-neutral-800 dark:text-neutral-100">
        {title} ({count})
      </span>
    </motion.div>
  );
});

HeadingItem.displayName = "HeadingItem";

// Chat component with realistic movement animation
const ChatItem = memo(
  ({ chat, isPinned, onTogglePin }: ChatItemProps) => {
    const handleTogglePin = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onTogglePin(chat.id);
      },
      [chat.id, onTogglePin]
    );

    return (
      <motion.div
        layoutId={chat.id}
        layout="position"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: {
            opacity: { duration: 0.25 },
            scale: { type: "spring", stiffness: 300, damping: 25 },
          },
        }}
        exit={{
          opacity: 0,
          scale: 0.9,
          transition: { duration: 0.2 },
        }}
        transition={{
          layout: {
            type: "spring",
            stiffness: 350,
            damping: 30,
            mass: 1,
          },
        }}
        className={cn(
          "group relative flex items-center justify-between rounded-lg border p-2 transition-shadow duration-200 cursor-pointer overflow-hidden",
          "hover:shadow-md hover:shadow-black/10 dark:hover:shadow-white/5",
          "shadow-sm shadow-black/5 dark:shadow-white/5",
          "border-neutral-300 dark:border-neutral-600/50 bg-gradient-to-b from-white via-neutral-50 to-neutral-100 dark:from-neutral-950/30 dark:via-neutral-900/30 dark:to-neutral-800/30"
        )}
        onClick={handleTogglePin}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <motion.div layout className="flex-shrink-0">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-sm border border-neutral-500/50 transition-all duration-200 shadow-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 shadow-neutral-200 dark:shadow-neutral-800"
              )}
            >
              <MessageSquare className="h-5 w-5" />
            </div>
          </motion.div>

          <motion.div
            layout
            className="flex-1 min-w-0 flex justify-between gap-2"
          >
            <span className="text-sm text-neutral-600 dark:text-neutral-300 truncate">
              {chat.lastMessage}
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
              {chat.timestamp}
            </span>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {isPinned && (
            <motion.div
              layout
              className="flex-shrink-0 ml-1.5 md:ml-3"
              initial={{ opacity: 0, scale: 0, rotate: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: 45,
                transition: {
                  type: "spring",
                  stiffness: 500,
                  damping: 25,
                  delay: 0.15,
                },
              }}
              exit={{
                opacity: 0,
                scale: 0,
                rotate: 0,
                transition: { duration: 0.15 },
              }}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border border-neutral-500/50 transition-all duration-200",
                  "shadow-sm hover:shadow-md",
                  "bg-gradient-to-b -rotate-45 from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 text-neutral-600 dark:text-neutral-300 hover:from-neutral-200 hover:to-neutral-300 dark:hover:from-neutral-700 dark:hover:to-neutral-600 shadow-neutral-200 dark:shadow-neutral-800"
                )}
              >
                <BsFillPinAngleFill className="h-4 w-4" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.chat.id === nextProps.chat.id &&
      prevProps.isPinned === nextProps.isPinned
    );
  }
);

ChatItem.displayName = "ChatItem";

const PinChat = memo(function PinChat() {
  const [pinnedChatIds, setPinnedChatIds] =
    useState<string[]>(DEFAULT_PINNED_CHATS);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage after hydration
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPinnedChatIds(JSON.parse(stored));
      }
    } catch (error) {
      console.warn("Failed to load pinned chats from localStorage:", error);
    }
    setIsHydrated(true);
  }, []);

  // Persist pinned chats to localStorage
  useEffect(() => {
    if (!isHydrated) return;

    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pinnedChatIds));
      } catch (error) {
        console.warn("Failed to save pinned chats to localStorage:", error);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [pinnedChatIds, isHydrated]);

  const handleTogglePin = useCallback((chatId: string) => {
    setPinnedChatIds((prev) => {
      if (prev.includes(chatId)) {
        return prev.filter((id) => id !== chatId);
      } else {
        return [...prev, chatId];
      }
    });
  }, []);

  // Create unified list with headings and chats
  const unifiedList = useMemo(() => {
    const pinnedChats = SAMPLE_CHATS.filter((chat) =>
      pinnedChatIds.includes(chat.id)
    );
    const unpinnedChats = SAMPLE_CHATS.filter(
      (chat) => !pinnedChatIds.includes(chat.id)
    );

    const items: ListItem[] = [];

    // Add pinned section if there are pinned chats
    if (pinnedChats.length > 0) {
      items.push({
        id: "pinned-heading",
        type: "heading",
        title: "Pinned Chats",
        count: pinnedChats.length,
      });

      pinnedChats.forEach((chat) => {
        items.push({
          id: chat.id,
          type: "chat",
          data: chat,
        });
      });
    }

    // Add regular chats section
    items.push({
      id: "regular-heading",
      type: "heading",
      title: pinnedChats.length > 0 ? "Other Chats" : "All Chats",
      count: unpinnedChats.length,
    });

    unpinnedChats.forEach((chat) => {
      items.push({
        id: chat.id,
        type: "chat",
        data: chat,
      });
    });

    return items;
  }, [pinnedChatIds]);

  // Show loading state during hydration
  if (!isHydrated) {
    return (
      <div className="flex max-w-lg mx-auto w-full flex-col rounded-3xl border border-neutral-300 dark:border-neutral-600">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <div className="flex gap-3 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 px-3 py-2">
              <Pin className="h-5 w-5" />
              <span className="text-sm font-semibold">Pin Chat</span>
            </div>

            <div className="ml-auto flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              Interactive Demo
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="animate-pulse text-neutral-500 dark:text-neutral-400">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex max-w-lg mx-auto w-full flex-col rounded-xl ">
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full overflow-y-auto no-scrollbar p-4 space-y-3 relative">
          <AnimatePresence initial={false} mode="popLayout">
            {unifiedList.map((item) => {
              if (item.type === "heading") {
                const icon = item.title?.includes("Pinned") ? (
                  <Pin className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                ) : (
                  <MessageSquare className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                );

                return (
                  <HeadingItem
                    key={item.id}
                    title={item.title!}
                    count={item.count!}
                    icon={icon}
                  />
                );
              } else {
                const isPinned = pinnedChatIds.includes(item.id);

                return (
                  <ChatItem
                    key={item.id}
                    chat={item.data!}
                    isPinned={isPinned}
                    onTogglePin={handleTogglePin}
                  />
                );
              }
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
});

PinChat.displayName = "PinChat";

export default PinChat;
