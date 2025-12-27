"use client";

import { useEffect, useRef } from "react";
import type React from "react";
import { annotate } from "rough-notation";
import type { RoughAnnotation } from "rough-notation/lib/model";

type AnnotationAction =
  | "highlight"
  | "underline"
  | "box"
  | "circle"
  | "strike-through"
  | "crossed-off"
  | "bracket";

interface HighlighterProps {
  children: React.ReactNode;
  action?: AnnotationAction;
  color?: string;
  strokeWidth?: number;
  animationDuration?: number;
  iterations?: number;
  padding?: number;
  multiline?: boolean;
  delay?: number;
}

export function Highlighter({
  children,
  action = "highlight",
  color = "#a3a3a3",
  strokeWidth = 1.5,
  animationDuration = 800,
  iterations = 2,
  padding = 2,
  multiline = true,
  delay = 800,
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const annotationRef = useRef<RoughAnnotation | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Delay to wait for any parent animations to complete
    const timeout = setTimeout(() => {
      if (annotationRef.current) return;

      const annotation = annotate(element, {
        type: action,
        color,
        strokeWidth,
        animationDuration,
        iterations,
        padding,
        multiline,
      });

      annotationRef.current = annotation;
      annotation.show();
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [
    action,
    color,
    strokeWidth,
    animationDuration,
    iterations,
    padding,
    multiline,
    delay,
  ]);

  return (
    <span
      ref={elementRef}
      style={{
        display: "inline",
        position: "relative",
        verticalAlign: "baseline"
      }}
    >
      {children}
    </span>
  );
}
