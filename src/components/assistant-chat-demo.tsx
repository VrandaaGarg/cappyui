"use client";

import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, useInView } from "framer-motion";
import { Bot, MessageSquareText, User } from "lucide-react";
import ShikiHighlighter from "react-shiki";

import { cn } from "@/lib/utils";

// Optimized: Memoized theme detection with reduced re-renders
function useThemeDetection() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof document === "undefined") return false;
    const root = document.documentElement;
    return (
      root.classList.contains("dark") ||
      root.classList.contains("capybara-dark")
    );
  });

  useEffect(() => {
    const computeIsDark = () => {
      const root = document.documentElement;
      return (
        root.classList.contains("dark") ||
        root.classList.contains("capybara-dark")
      );
    };

    const observer = new MutationObserver(() => {
      const isDark = computeIsDark();
      setIsDarkMode((prev) => (prev !== isDark ? isDark : prev)); // Only update if changed
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"], // Only watch class changes
    });

    return () => observer.disconnect();
  }, []);

  return isDarkMode;
}

export interface ChatDemoMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  thinkingDelay?: number;
  nextDelay?: number;
}

const DEMO_MESSAGES: ChatDemoMessage[] = [
  {
    role: "user",
    content: "What is React?",
    timestamp: "10:24 AM",
    thinkingDelay: 1500,
  },
  {
    role: "assistant",
    content:
      "React is a JavaScript library for building user interfaces. It lets you create reusable components and efficiently update the UI when your data changes. It's maintained by Meta and widely used for web applications.",
    timestamp: "10:24 AM",
    nextDelay: 1200,
  },
  {
    role: "user",
    content: "Can you show me a simple example?",
    timestamp: "10:26 AM",
    thinkingDelay: 1200,
  },
  {
    role: "assistant",
    content:
      'Sure! Here\'s a basic React component:\n\n```tsx\nfunction Welcome({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}```\n\nYou can use it like this: `<Welcome name="Sarah" />` and it will display "Hello, Sarah!"',
    timestamp: "10:27 AM",
    nextDelay: 1200,
  },
  {
    role: "user",
    content: "That's helpful! What makes React so popular?",
    timestamp: "10:28 AM",
    thinkingDelay: 1200,
  },
  {
    role: "assistant",
    content:
      "React is popular because it's simple to learn, has a huge community, and makes building interactive UIs easy. The component-based approach helps you break down complex interfaces into smaller, manageable pieces. Plus, it has great performance and works well with other tools!",
    timestamp: "10:29 AM",
    nextDelay: 1200,
  },
  {
    role: "user",
    content: "Thanks! This makes sense now.",
    timestamp: "10:30 AM",
    thinkingDelay: 1000,
  },
  {
    role: "assistant",
    content:
      "You're welcome! Feel free to ask if you have more questions. Happy coding! 🚀",
    timestamp: "10:30 AM",
    nextDelay: 1200,
  },
];

interface TypingTextProps {
  text: string;
  isVisible: boolean;
  delay?: number;
  speed?: number;
  onComplete?: () => void;
}

const TypingText = ({
  text,
  isVisible,
  delay = 0,
  speed = 20,
  onComplete,
}: TypingTextProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setDisplayedText("");
      setCurrentIndex(0);
      setHasStarted(false);
      return;
    }

    if (!hasStarted) {
      setHasStarted(true);
      setDisplayedText("");
      setCurrentIndex(0);
    }
  }, [isVisible, hasStarted]);

  useEffect(() => {
    if (!isVisible || !hasStarted) return;

    const timer = window.setTimeout(
      () => {
        if (currentIndex < text.length) {
          setDisplayedText((prev) => prev + text[currentIndex]);
          setCurrentIndex((prev) => prev + 1);
        } else if (onComplete && currentIndex === text.length) {
          onComplete();
        }
      },
      currentIndex === 0 ? delay : speed
    );

    return () => window.clearTimeout(timer);
  }, [isVisible, hasStarted, currentIndex, text, delay, speed, onComplete]);

  return <span className="">{displayedText}</span>;
};

interface TypingCodeBlockProps {
  code: string;
  isVisible: boolean;
  delay?: number;
  speed?: number;
  onComplete?: () => void;
  isDarkMode: boolean;
}

const TypingCodeBlock = ({
  code,
  isVisible,
  delay = 0,
  speed = 12,
  onComplete,
  isDarkMode,
}: TypingCodeBlockProps) => {
  const [displayedCode, setDisplayedCode] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setDisplayedCode("");
      setCurrentIndex(0);
      setHasStarted(false);
      return;
    }

    if (!hasStarted) {
      setHasStarted(true);
      setDisplayedCode("");
      setCurrentIndex(0);
    }
  }, [isVisible, hasStarted]);

  useEffect(() => {
    if (!isVisible || !hasStarted) return;

    const timer = window.setTimeout(
      () => {
        if (currentIndex < code.length) {
          setDisplayedCode((prev) => prev + code[currentIndex]);
          setCurrentIndex((prev) => prev + 1);
        } else if (onComplete && currentIndex === code.length) {
          onComplete();
        }
      },
      currentIndex === 0 ? delay : speed
    );

    return () => window.clearTimeout(timer);
  }, [isVisible, hasStarted, currentIndex, code, delay, speed, onComplete]);

  return (
    <div className="rounded-lg border border-muted-foreground/20 bg-muted/40 dark:bg-background/40 overflow-x-auto">
      <ShikiHighlighter
        language="tsx"
        theme={isDarkMode ? "github-dark" : "github-light"}
        className="text-sm font-mono overflow-x-auto bg-transparent min-w-0 max-w-full"
        showLanguage={false}
      >
        {displayedCode}
      </ShikiHighlighter>
    </div>
  );
};

// Optimized: Memoized component for static code blocks
const StaticCodeBlock = memo(
  ({
    code,
    language,
    isDarkMode,
  }: {
    code: string;
    language: string;
    isDarkMode: boolean;
  }) => (
    <div className="my-3">
      <div className="rounded-lg border border-muted-foreground/20 bg-muted/40 dark:bg-background/40 overflow-x-auto">
        <ShikiHighlighter
          language={language}
          theme={isDarkMode ? "github-dark" : "github-light"}
          className="text-sm font-mono overflow-x-auto bg-transparent min-w-0 max-w-full"
          showLanguage={false}
        >
          {code}
        </ShikiHighlighter>
      </div>
    </div>
  )
);
StaticCodeBlock.displayName = "StaticCodeBlock";

const renderStaticSegments = (content: string, isDarkMode: boolean) => {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // Create new regex instance to avoid global state issues
  const codeBlockRegex = /```(tsx|jsx|javascript|js)?\n([\s\S]*?)```/g;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      const textPortion = content.slice(lastIndex, match.index).trim();
      if (textPortion) {
        nodes.push(
          <span key={`text-${nodes.length}`} className="mb-2 leading-relaxed ">
            {renderMarkdown(textPortion)}
          </span>
        );
      }
    }

    const codeContent = match[2];
    const language = match[1] || "tsx";

    nodes.push(
      <StaticCodeBlock
        key={`code-${nodes.length}`}
        code={codeContent}
        language={language}
        isDarkMode={isDarkMode}
      />
    );

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    const remaining = content.slice(lastIndex).trim();
    if (remaining) {
      nodes.push(
        <span key={`text-${nodes.length}`} className="leading-relaxed ">
          {renderMarkdown(remaining)}
        </span>
      );
    }
  }

  return <>{nodes}</>;
};

// Helper function to render markdown (bold, inline code)
const renderMarkdown = (text: string) => {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  // Match **bold** and `inline code`
  const regex = /(\*\*(.+?)\*\*)|(`(.+?)`)/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[2]) {
      // Bold text
      parts.push(
        <strong key={match.index} className="font-semibold text-foreground">
          {match[2]}
        </strong>
      );
    } else if (match[4]) {
      // Inline code
      parts.push(
        <code
          key={match.index}
          className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-xs"
        >
          {match[4]}
        </code>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};

// Optimized: Memoized content splitting with LRU cache
class LRUCache<K, V> {
  private cache = new Map<K, V>();
  private maxSize: number;

  constructor(maxSize: number = 50) {
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove least recently used (first item)
      const iterator = this.cache.keys();
      const firstResult = iterator.next();
      if (!firstResult.done) {
        this.cache.delete(firstResult.value);
      }
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }
}

const contentCache = new LRUCache<
  string,
  Array<{ type: "text" | "code"; value: string; delay: number }>
>();

const splitContent = (content: string) => {
  // Check cache first
  const cached = contentCache.get(content);
  if (cached) {
    return cached;
  }

  const segments: Array<
    | { type: "text"; value: string; delay: number }
    | { type: "code"; value: string; delay: number }
  > = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let cursor = 0;

  // Create new regex instance to avoid global state issues
  const codeBlockRegex = /```(tsx|jsx|javascript|js)?\n([\s\S]*?)```/g;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      const text = content.slice(lastIndex, match.index);
      segments.push({ type: "text", value: text, delay: cursor * 5 });
      cursor += text.length;
    }

    const code = match[2];
    segments.push({ type: "code", value: code, delay: cursor * 5 });
    cursor += code.length;

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    const remaining = content.slice(lastIndex);
    segments.push({ type: "text", value: remaining, delay: cursor * 5 });
  }

  // Cache the result
  contentCache.set(content, segments);

  return segments;
};

const AssistantChatDemo = memo(function AssistantChatDemo() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isProgrammatic = useRef(false);
  const timeoutsRef = useRef<number[]>([]);
  const shouldAutoScroll = useRef(true);

  const isInView = useInView(containerRef, { amount: 0.3, once: true });
  const isDarkMode = useThemeDetection();

  const [currentIndex, setCurrentIndex] = useState(-1);
  const [completedMessages, setCompletedMessages] = useState<Set<number>>(
    () => new Set()
  );
  const [isTyping, setIsTyping] = useState(false);
  const [showThinking, setShowThinking] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [completedSegments, setCompletedSegments] = useState<Set<number>>(
    () => new Set()
  );

  const scheduleTimeout = useCallback((handler: () => void, delay: number) => {
    const id = window.setTimeout(() => {
      handler();
      timeoutsRef.current = timeoutsRef.current.filter(
        (storedId) => storedId !== id
      );
    }, delay);

    timeoutsRef.current.push(id);
    return id;
  }, []);

  const clearScheduled = useCallback(() => {
    timeoutsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  const checkIfAtBottom = useCallback(() => {
    const node = scrollRef.current;
    if (!node) return true;

    const threshold = 50; // pixels from bottom
    const isAtBottom =
      node.scrollHeight - node.scrollTop - node.clientHeight <= threshold;
    return isAtBottom;
  }, []);

  const scrollToBottom = useCallback(() => {
    const node = scrollRef.current;
    if (!node) return;

    isProgrammatic.current = true;
    node.scrollTop = node.scrollHeight;

    // Use setTimeout to ensure flag is cleared after scroll event
    setTimeout(() => {
      isProgrammatic.current = false;
    }, 100);
  }, []);

  useEffect(
    () => () => {
      clearScheduled();
      // Clear cache when component unmounts to prevent memory leaks
      contentCache.clear();
    },
    [clearScheduled]
  );

  useEffect(() => {
    if (isInView && currentIndex === -1 && !isFinished) {
      scheduleTimeout(() => {
        setCurrentIndex(0);
        setIsTyping(true);
        shouldAutoScroll.current = true; // Ensure auto-scroll is on when starting
      }, 400);
    }
  }, [currentIndex, isFinished, isInView, scheduleTimeout]);

  useEffect(() => {
    // Auto-scroll only if shouldAutoScroll is true
    if (shouldAutoScroll.current) {
      scrollToBottom();
    }
  }, [currentIndex, isTyping, showThinking, scrollToBottom]);

  // Auto-scroll during typing with throttled MutationObserver
  useEffect(() => {
    const node = scrollRef.current;
    if (!node || !isTyping) return;

    let timeoutId: NodeJS.Timeout | null = null;
    let lastScrollTime = 0;

    const observer = new MutationObserver(() => {
      // Don't scroll if user has disabled auto-scroll
      if (!shouldAutoScroll.current) return;

      // Throttle to prevent rapid scrolling
      const now = Date.now();
      if (now - lastScrollTime < 100) return; // Increased throttle to 100ms

      if (timeoutId) return;

      timeoutId = setTimeout(() => {
        if (shouldAutoScroll.current) {
          lastScrollTime = Date.now();
          scrollToBottom();
        }
        timeoutId = null;
      }, 100);
    });

    observer.observe(node, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isTyping, scrollToBottom]);

  // Smart scroll detection: allow user to scroll, but resume auto-scroll when at bottom
  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    const handleScroll = () => {
      // Ignore programmatic scrolls
      if (isProgrammatic.current) return;

      // User is manually scrolling - disable auto-scroll immediately
      shouldAutoScroll.current = false;

      // Check if user scrolled back to bottom
      const atBottom = checkIfAtBottom();

      // Re-enable auto-scroll only if at bottom
      if (atBottom) {
        shouldAutoScroll.current = true;
      }
    };

    node.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      node.removeEventListener("scroll", handleScroll);
    };
  }, [checkIfAtBottom]);

  const handleSegmentComplete = useCallback(
    (segmentIndex: number, totalSegments: number) => {
      setCompletedSegments((prev) => {
        const next = new Set(prev);
        next.add(segmentIndex);
        return next;
      });

      // If this is the last segment, complete the message
      if (segmentIndex === totalSegments - 1) {
        // Reset segment tracking for next message
        setCurrentSegmentIndex(0);
        setCompletedSegments(new Set());

        if (currentIndex < 0) return;

        setCompletedMessages((prev) => {
          const next = new Set(prev);
          next.add(currentIndex);
          return next;
        });
        setIsTyping(false);

        const nextIndex = currentIndex + 1;
        const currentMessage = DEMO_MESSAGES[currentIndex];
        const nextMessage = DEMO_MESSAGES[nextIndex];

        if (!nextMessage) {
          setIsFinished(true);
          setShowThinking(false);
          setCurrentIndex(-1);
          return;
        }

        if (
          currentMessage.role === "user" &&
          nextMessage.role === "assistant"
        ) {
          setShowThinking(true);
          scheduleTimeout(() => {
            setShowThinking(false);
            setCurrentIndex(nextIndex);
            setIsTyping(true);
            shouldAutoScroll.current = true; // Re-enable auto-scroll for new message
          }, currentMessage.thinkingDelay ?? 1400);
          return;
        }

        scheduleTimeout(() => {
          setCurrentIndex(nextIndex);
          setIsTyping(true);
          shouldAutoScroll.current = true; // Re-enable auto-scroll for new message
        }, currentMessage.nextDelay ?? 1400);
      } else {
        // Move to next segment
        setCurrentSegmentIndex(segmentIndex + 1);
      }
    },
    [currentIndex, scheduleTimeout]
  );

  const handleReplay = useCallback(() => {
    clearScheduled();
    setCurrentIndex(-1);
    setCompletedMessages(new Set());
    setIsTyping(false);
    setShowThinking(false);
    setIsFinished(false);
    setCurrentSegmentIndex(0);
    setCompletedSegments(new Set());
  }, [clearScheduled]);

  const visibleMessages = useMemo(() => {
    if (currentIndex === -1) {
      return Array.from(completedMessages.values()).sort((a, b) => a - b);
    }
    const baseline = new Set(completedMessages);
    baseline.add(currentIndex);
    return Array.from(baseline.values()).sort((a, b) => a - b);
  }, [completedMessages, currentIndex]);

  return (
    <div
      ref={containerRef}
      className="flex h-[480px] w-full flex-col rounded-3xl border border-ring/40 bg-card/40 backdrop-blur"
    >
      <div className="mb-4 p-6 flex items-center gap-3 border-b border-ring/30 ">
        <div className="flex gap-3 items-center justify-center rounded-full bg-primary/15 text-primary">
          <MessageSquareText className="h-5 w-5" />
          <span className="text-sm font-semibold">Assistant Chat Demo</span>
        </div>

        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          Live Demo
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 p-4 space-y-4 overflow-y-auto overflow-x-auto scrollbar-visible"
      >
        {visibleMessages.map((index) => {
          const message = DEMO_MESSAGES[index];
          const isCurrent = index === currentIndex;
          const isComplete = completedMessages.has(index);
          const show = isCurrent || isComplete;

          if (!show) return null;

          const segments = splitContent(message.content);

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/15 text-primary">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={cn(
                  "relative max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                  message.role === "user"
                    ? "rounded-br-sm bg-secondary text-secondary-foreground"
                    : "rounded-bl-sm border border-border/20 bg-muted/60 text-muted-foreground"
                )}
              >
                <div className="leading-relaxed">
                  {isComplete
                    ? renderStaticSegments(message.content, isDarkMode)
                    : segments.map((segment, segmentIndex) => {
                        const isCurrentSegment =
                          segmentIndex === currentSegmentIndex;
                        const isCompletedSegment =
                          completedSegments.has(segmentIndex);
                        const shouldShow =
                          isCurrent && (isCurrentSegment || isCompletedSegment);
                        const shouldAnimate =
                          isCurrent && isCurrentSegment && isTyping;

                        if (segment.type === "text") {
                          return (
                            <span key={`text-${segmentIndex}`}>
                              {isCompletedSegment ? (
                                <span className="">{segment.value}</span>
                              ) : shouldShow ? (
                                <TypingText
                                  text={segment.value}
                                  isVisible={shouldAnimate}
                                  delay={0}
                                  speed={25}
                                  onComplete={() =>
                                    handleSegmentComplete(
                                      segmentIndex,
                                      segments.length
                                    )
                                  }
                                />
                              ) : null}
                            </span>
                          );
                        }

                        return (
                          <div key={`code-${segmentIndex}`} className="my-3">
                            {isCompletedSegment ? (
                              <div className="rounded-lg border border-muted-foreground/20 bg-muted/40 dark:bg-background/40 overflow-x-auto">
                                <ShikiHighlighter
                                  language="tsx"
                                  theme={
                                    isDarkMode ? "github-dark" : "github-light"
                                  }
                                  className="text-sm font-mono overflow-x-auto bg-transparent min-w-0 max-w-full"
                                  showLanguage={false}
                                >
                                  {segment.value}
                                </ShikiHighlighter>
                              </div>
                            ) : shouldShow ? (
                              <TypingCodeBlock
                                code={segment.value}
                                isVisible={shouldAnimate}
                                delay={0}
                                speed={12}
                                onComplete={() =>
                                  handleSegmentComplete(
                                    segmentIndex,
                                    segments.length
                                  )
                                }
                                isDarkMode={isDarkMode}
                              />
                            ) : null}
                          </div>
                        );
                      })}
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground/70">
                  <span>{message.timestamp}</span>
                </div>
              </div>
              {message.role === "user" && (
                <div className="mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
                  <User className="h-4 w-4" />
                </div>
              )}
            </motion.div>
          );
        })}

        {showThinking && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex justify-start gap-3"
          >
            <div className="mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/15 text-primary">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-2xl rounded-bl-md border border-border/20 bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Assistant is thinking</span>
                <motion.span
                  className="flex items-center gap-1"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                >
                  ···
                </motion.span>
              </div>
            </div>
          </motion.div>
        )}

        {isFinished && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mt-6 flex justify-center"
          >
            <button
              type="button"
              onClick={handleReplay}
              className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/15"
            >
              <MessageSquareText className="h-4 w-4" />
              Replay Demo
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
});

AssistantChatDemo.displayName = "AssistantChatDemo";

export default AssistantChatDemo;
