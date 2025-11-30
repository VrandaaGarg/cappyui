"use client";

import React, { memo, useEffect, useState, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  MessageSquare,
  Link,
  ExternalLink,
} from "lucide-react";
import { BsCursorFill } from "react-icons/bs";
import { MdOutlineTextDecrease, MdOutlineTextIncrease } from "react-icons/md";

type AnimationPhase =
  | "idle"
  | "selecting"
  | "bold"
  | "italic"
  | "underline"
  | "textColorRed"
  | "textColorBlue"
  | "textColorGreen"
  | "hold1"
  | "selectAll"
  | "alignCenter"
  | "alignRight"
  | "alignLeft"
  | "hold2";

type TextAlignment = "left" | "center" | "right";

interface FormattingState {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  textColorClass: string;
}

const INITIAL_FORMATTING: FormattingState = {
  isBold: false,
  isItalic: false,
  isUnderline: false,
  textColorClass: "",
};

const SPRING_CONFIG = {
  type: "spring" as const,
  stiffness: 350,
  damping: 30,
};

interface ToolbarButtonProps {
  children: React.ReactNode;
  isActive?: boolean;
  showCursor?: boolean;
  className?: string;
}

const ToolbarButton = memo(
  ({ children, isActive = false, showCursor = false, className }: ToolbarButtonProps) => (
    <div className="relative flex flex-col items-center">
      {showCursor && (
        <motion.div
          layoutId="toolbar-bg"
          className="absolute inset-0 bg-blue-500/20 rounded-md border border-blue-500/30"
          transition={SPRING_CONFIG}
        />
      )}
      <motion.button
        className={cn(
          "relative z-10 p-1.5 rounded-md transition-colors duration-200",
          isActive
            ? "text-blue-800 dark:text-blue-400 bg-blue-500/15 hover:bg-blue-500/30"
            : "text-black dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-300 hover:bg-neutral-400/50 dark:hover:bg-neutral-700/50",
          className
        )}
      >
        {children}
      </motion.button>
      {showCursor && (
        <motion.div
          layoutId="cursor-icon"
          className="absolute -bottom-5 drop-shadow-[0_0_4px_rgba(59,130,246,0.6)]"
          transition={SPRING_CONFIG}
        >
          <BsCursorFill className="w-3 h-3 -rotate-[60deg] text-black dark:text-white" />
        </motion.div>
      )}
    </div>
  )
);

ToolbarButton.displayName = "ToolbarButton";

interface ColorPickerProps {
  color: string;
  isActive?: boolean;
}

const ColorPicker = memo(({ color, isActive = false }: ColorPickerProps) => (
  <motion.div
    className={cn(
      "w-5 h-5 rounded-full border-2 cursor-pointer transition-all duration-300",
      isActive ? "border-blue-400 ring-2 ring-blue-500/50" : "border-neutral-600",
      !isActive && "bg-black dark:bg-white"
    )}
    style={isActive ? { backgroundColor: color } : undefined}
    animate={isActive ? { scale: [1, 1.2, 1] } : { scale: 1 }}
    transition={{ duration: 0.3 }}
  />
));

ColorPicker.displayName = "ColorPicker";

interface SelectionLineProps {
  index: number;
  totalLines: number;
  isVisible: boolean;
  selectionDuration: number;
}

const SelectionLine = memo(({ index, totalLines, isVisible, selectionDuration }: SelectionLineProps) => {
  const staggerDelay = (index / totalLines) * selectionDuration;
  
  return (
    <motion.div
      className="bg-blue-500/30 rounded-[2px] origin-left will-change-transform"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: isVisible ? 1 : 0 }}
      transition={{
        duration: selectionDuration / totalLines / 1000,
        delay: isVisible ? staggerDelay / 1000 : 0,
        ease: "easeOut",
      }}
      style={{ height: `${100 / totalLines}%` }}
    />
  );
});

SelectionLine.displayName = "SelectionLine";

interface SelectionOverlayProps {
  lineCount: number;
  isVisible: boolean;
  selectionDuration: number;
}

const SelectionOverlay = memo(({ lineCount, isVisible, selectionDuration }: SelectionOverlayProps) => {
  const lines = useMemo(() => Array.from({ length: lineCount }, (_, i) => i), [lineCount]);
  
  return (
    <AnimatePresence>
      {isVisible && (
        <div className="absolute inset-0 -m-2 p-2 flex flex-col pointer-events-none z-0">
          {lines.map((index) => (
            <SelectionLine
              key={index}
              index={index}
              totalLines={lineCount}
              isVisible={isVisible}
              selectionDuration={selectionDuration}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
});

SelectionOverlay.displayName = "SelectionOverlay";

interface RealTimeEditorProps {
  className?: string;
  selectionDelay?: number;
  formatDelay?: number;
  holdDelay?: number;
  textContent?: string;
  selectedText?: string;
}

export const RealTimeEditor = memo(
  ({
    className,
    selectionDelay = 800,
    formatDelay = 600,
    holdDelay = 1000,
    textContent = "The art of crafting beautiful interfaces lies in the Details Matter philosophy. Every pixel, every animation, and every interaction should feel intentional and purposeful. Great design isn't just about aesthetics—it's about creating experiences that users genuinely enjoy. When we focus on the small things, the big picture naturally falls into place...",
    selectedText = "Details Matter",
  }: RealTimeEditorProps) => {
    const [phase, setPhase] = useState<AnimationPhase>("idle");
    const [selectionProgress, setSelectionProgress] = useState(0);
    const [formatting, setFormatting] = useState<FormattingState>(INITIAL_FORMATTING);
    const [isFullTextSelected, setIsFullTextSelected] = useState(false);
    const [textAlignment, setTextAlignment] = useState<TextAlignment>("left");
    const [activeColor, setActiveColor] = useState("");
    const [lineCount, setLineCount] = useState(7);
    
    const textRef = useRef<HTMLDivElement>(null);
    const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
    const animationFrameRef = useRef<number | null>(null);

    const clearAllTimeouts = useCallback(() => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }, []);

    // Debounced line calculation
    useEffect(() => {
      let resizeTimeout: NodeJS.Timeout;
      
      const calculateLines = () => {
        if (textRef.current) {
          const lineHeight = parseFloat(getComputedStyle(textRef.current).lineHeight) || 20;
          const height = textRef.current.offsetHeight;
          const lines = Math.ceil(height / lineHeight);
          setLineCount(Math.max(1, lines));
        }
      };

      const debouncedCalculate = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(calculateLines, 100);
      };

      calculateLines();
      window.addEventListener("resize", debouncedCalculate);
      
      return () => {
        window.removeEventListener("resize", debouncedCalculate);
        clearTimeout(resizeTimeout);
      };
    }, [textContent, textAlignment]);

    const resetAnimation = useCallback(() => {
      setPhase("idle");
      setSelectionProgress(0);
      setFormatting(INITIAL_FORMATTING);
      setIsFullTextSelected(false);
      setTextAlignment("left");
      setActiveColor("");
    }, []);

    // Smooth selection progress animation using requestAnimationFrame
    const animateSelection = useCallback((
      startTime: number,
      duration: number,
      onProgress: (progress: number) => void,
      onComplete: () => void
    ) => {
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        onProgress(progress);
        
        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          onComplete();
        }
      };
      
      animationFrameRef.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
      const addTimeout = (callback: () => void, delay: number) => {
        const timeout = setTimeout(callback, delay);
        timeoutsRef.current.push(timeout);
        return timeout;
      };

      const runAnimation = () => {
        clearAllTimeouts();
        resetAnimation();

        let currentTime = 500;

        // Phase 1: Selection animation with smooth progress
        addTimeout(() => {
          setPhase("selecting");
          const startTime = performance.now();
          animateSelection(
            startTime,
            selectionDelay,
            (progress) => setSelectionProgress(progress),
            () => {}
          );
        }, currentTime);

        currentTime += selectionDelay + 200;

        // Phase 2: Bold
        addTimeout(() => {
          setPhase("bold");
          setFormatting(prev => ({ ...prev, isBold: true }));
        }, currentTime);
        currentTime += formatDelay;

        // Phase 3: Italic
        addTimeout(() => {
          setPhase("italic");
          setFormatting(prev => ({ ...prev, isItalic: true }));
        }, currentTime);
        currentTime += formatDelay;

        // Phase 4: Underline
        addTimeout(() => {
          setPhase("underline");
          setFormatting(prev => ({ ...prev, isUnderline: true }));
        }, currentTime);
        currentTime += formatDelay;

        // Phase 5: Text Color Red
        addTimeout(() => {
          setPhase("textColorRed");
          setFormatting(prev => ({ ...prev, textColorClass: "text-rose-400" }));
          setActiveColor("#f43f5e");
        }, currentTime);
        currentTime += formatDelay;

        // Phase 6: Text Color Blue
        addTimeout(() => {
          setPhase("textColorBlue");
          setFormatting(prev => ({ ...prev, textColorClass: "text-blue-400" }));
          setActiveColor("#3b82f6");
        }, currentTime);
        currentTime += formatDelay;

        // Phase 7: Text Color Green
        addTimeout(() => {
          setPhase("textColorGreen");
          setFormatting(prev => ({ ...prev, textColorClass: "text-emerald-400" }));
          setActiveColor("#34d399");
        }, currentTime);
        currentTime += formatDelay;

        // Phase 8: Hold 1
        addTimeout(() => setPhase("hold1"), currentTime);
        currentTime += holdDelay;

        // Phase 9: Select All - Framer Motion handles the animation
        addTimeout(() => {
          setPhase("selectAll");
          setIsFullTextSelected(true);
        }, currentTime);
        currentTime += selectionDelay * 1.2 + 200;

        // Phase 10: Align Center
        addTimeout(() => {
          setPhase("alignCenter");
          setTextAlignment("center");
        }, currentTime);
        currentTime += formatDelay;

        // Phase 11: Align Right
        addTimeout(() => {
          setPhase("alignRight");
          setTextAlignment("right");
        }, currentTime);
        currentTime += formatDelay;

        // Phase 12: Align Left
        addTimeout(() => {
          setPhase("alignLeft");
          setTextAlignment("left");
        }, currentTime);
        currentTime += formatDelay;

        // Phase 13: Hold 2
        addTimeout(() => setPhase("hold2"), currentTime);
        currentTime += holdDelay;

        // Restart animation
        addTimeout(runAnimation, currentTime);
      };

      runAnimation();

      return clearAllTimeouts;
    }, [selectionDelay, formatDelay, holdDelay, resetAnimation, clearAllTimeouts, animateSelection]);

    // Memoized derived values
    const cursorTarget = useMemo((): string | null => {
      switch (phase) {
        case "bold": return "bold";
        case "italic": return "italic";
        case "underline": return "underline";
        case "textColorRed":
        case "textColorBlue":
        case "textColorGreen": return "color";
        case "alignLeft": return "alignLeft";
        case "alignCenter": return "alignCenter";
        case "alignRight": return "alignRight";
        default: return null;
      }
    }, [phase]);

    const isColorPickerActive = useMemo(() => 
      !isFullTextSelected && (phase === "textColorRed" || phase === "textColorBlue" || phase === "textColorGreen"),
      [isFullTextSelected, phase]
    );

    const isAlignLeftActive = useMemo(() => 
      textAlignment === "left" && (phase === "alignLeft" || phase === "hold2" || (!isFullTextSelected && phase !== "alignCenter" && phase !== "alignRight")),
      [textAlignment, phase, isFullTextSelected]
    );

    const isAlignCenterActive = useMemo(() => 
      phase === "alignCenter" || (textAlignment === "center" && phase !== "alignLeft" && phase !== "alignRight"),
      [phase, textAlignment]
    );

    const isAlignRightActive = useMemo(() => phase === "alignRight", [phase]);

    const isBoldActive = useMemo(() => 
      !isFullTextSelected && (phase === "bold" || formatting.isBold),
      [isFullTextSelected, phase, formatting.isBold]
    );

    const isItalicActive = useMemo(() => 
      !isFullTextSelected && (phase === "italic" || (formatting.isItalic && phase !== "bold")),
      [isFullTextSelected, phase, formatting.isItalic]
    );

    const isUnderlineActive = useMemo(() => 
      !isFullTextSelected && (phase === "underline" || (formatting.isUnderline && phase !== "bold" && phase !== "italic")),
      [isFullTextSelected, phase, formatting.isUnderline]
    );

    // Memoized text content computation
    const { beforeText, afterText, selectedIndex } = useMemo(() => {
      const idx = textContent.indexOf(selectedText);
      return {
        selectedIndex: idx,
        beforeText: idx !== -1 ? textContent.slice(0, idx) : "",
        afterText: idx !== -1 ? textContent.slice(idx + selectedText.length) : "",
      };
    }, [textContent, selectedText]);

    const renderTextWithSelection = useCallback(() => {
      if (selectedIndex === -1) {
        return <span>{textContent}</span>;
      }

      const isSelecting = phase !== "idle";
      const charactersToShow = Math.floor(selectionProgress * selectedText.length);

      const selectedTextStyles = cn(
        "relative z-10 transition-all duration-200",
        isSelecting && !isFullTextSelected && "border-l-2 border-r-2 border-blue-500/60",
        formatting.isBold && "font-bold",
        formatting.isItalic && "italic",
        formatting.isUnderline && "underline decoration-2 underline-offset-2",
        formatting.textColorClass
      );

      if (isFullTextSelected) {
        return textContent;
      }

      return (
        <>
          <span>{beforeText}</span>
          <span className="relative inline">
            {isSelecting && (
              <motion.span
                className="absolute inset-0 bg-blue-500/30 rounded-sm will-change-transform"
                initial={{ width: 0 }}
                animate={{ width: `${selectionProgress * 100}%` }}
                transition={{ duration: 0.016, ease: "linear" }}
                style={{ display: "inline-block", height: "100%" }}
              />
            )}
            <span className={selectedTextStyles}>
              {phase === "selecting" && selectionProgress < 1
                ? selectedText.slice(0, charactersToShow)
                : selectedText}
              {phase === "selecting" && selectionProgress < 1 && (
                <span className="opacity-100">
                  {selectedText.slice(charactersToShow)}
                </span>
              )}
            </span>
          </span>
          <span>{afterText}</span>
        </>
      );
    }, [
      selectedIndex, textContent, selectedText, phase, selectionProgress,
      isFullTextSelected, formatting, beforeText, afterText
    ]);

    return (
      <div
        className={cn(
          "relative w-full max-w-2xl overflow-hidden mx-auto rounded-2xl",
          "dark:bg-neutral-950 bg-white",
          "border border-neutral-300/70 dark:border-neutral-700/30 shadow-2xl shadow-neutral-200/50 dark:shadow-neutral-900/50",
          className
        )}
      >
        <div className="max-w-xl p-4 md:my-8 relative mx-auto">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full bg-gradient-to-r from-blue-500/20 via-cyan-500/10 to-blue-500/20 blur-3xl pointer-events-none" />

          {/* Toolbar */}
          <div className="relative z-10 p-[1px] rounded-xl bg-gradient-to-r from-blue-500/20 via-cyan-500/15 to-blue-700/20 shadow-neutral-100 dark:shadow-neutral-950 shadow-sm">
            <div className="relative flex-wrap justify-center flex items-center gap-1 px-4 py-3 rounded-xl bg-neutral-50 dark:bg-[#111111] backdrop-blur-sm">
              
              {/* Format buttons */}
              <div className="flex items-center gap-0.5">
                <ToolbarButton isActive={isBoldActive} showCursor={cursorTarget === "bold"}>
                  <Bold className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton isActive={isItalicActive} showCursor={cursorTarget === "italic"}>
                  <Italic className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton isActive={isUnderlineActive} showCursor={cursorTarget === "underline"}>
                  <Underline className="w-4 h-4" />
                </ToolbarButton>
              </div>

              {/* Color picker */}
              <div className="relative flex flex-col items-center mx-2">
                {cursorTarget === "color" && (
                  <motion.div
                    layoutId="toolbar-bg"
                    className="absolute inset-[-4px] bg-blue-500/20 rounded-full border border-blue-500/30"
                    transition={SPRING_CONFIG}
                  />
                )}
                <div className="relative z-10">
                  <ColorPicker color={activeColor} isActive={isColorPickerActive} />
                </div>
                {cursorTarget === "color" && (
                  <motion.div
                    layoutId="cursor-icon"
                    className="absolute -bottom-5 drop-shadow-[0_0_4px_rgba(59,130,246,0.6)]"
                    transition={SPRING_CONFIG}
                  >
                    <BsCursorFill className="w-3 h-3 -rotate-[60deg] text-black dark:text-white" />
                  </motion.div>
                )}
              </div>

              <div className="w-px h-5 bg-neutral-600 mx-1" />

              {/* Alignment buttons */}
              <div className="flex items-center gap-0.5">
                <ToolbarButton isActive={isAlignLeftActive} showCursor={cursorTarget === "alignLeft"}>
                  <AlignLeft className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton isActive={isAlignCenterActive} showCursor={cursorTarget === "alignCenter"}>
                  <AlignCenter className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton isActive={isAlignRightActive} showCursor={cursorTarget === "alignRight"}>
                  <AlignRight className="w-4 h-4" />
                </ToolbarButton>
              </div>

              <div className="w-px h-5 bg-neutral-600 mx-1" />

              {/* Font size buttons */}
              <div className="flex items-center gap-0.5">
                <ToolbarButton>
                  <MdOutlineTextIncrease className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton>
                  <MdOutlineTextDecrease className="w-4 h-4" />
                </ToolbarButton>
              </div>

              <div className="w-px h-5 bg-neutral-600 mx-1" />

              {/* Comment button */}
              <div className="flex items-center gap-1 px-2 py-1 rounded-md text-black dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-400/50 dark:hover:bg-neutral-700/50 cursor-pointer">
                <MessageSquare className="w-4 h-4" />
                <span className="text-xs">Comment</span>
              </div>

              <ToolbarButton>
                <ExternalLink className="w-4 h-4" />
              </ToolbarButton>

              <ToolbarButton>
                <Link className="w-4 h-4" />
              </ToolbarButton>
            </div>
          </div>

          {/* Content area */}
          <div className="relative p-[1px] mt-3 rounded-xl bg-gradient-to-r from-blue-500/20 via-cyan-500/15 to-blue-700/20 shadow-neutral-100 dark:shadow-neutral-950 shadow-sm">
            <div className="relative overflow-hidden rounded-xl bg-neutral-50 dark:bg-[#111111] z-10 pb-12 p-6">
              <div className="relative">
                <SelectionOverlay
                  lineCount={lineCount}
                  isVisible={isFullTextSelected}
                  selectionDuration={selectionDelay * 1.2}
                />
                <motion.div
                  ref={textRef}
                  className="text-black dark:text-neutral-200 text-sm leading-relaxed font-light relative z-10"
                  animate={{ textAlign: textAlignment }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {renderTextWithSelection()}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

RealTimeEditor.displayName = "RealTimeEditor";

export default RealTimeEditor;
