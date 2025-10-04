"use client";

import React, { memo, useMemo, useId } from "react";
import { motion, Transition, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface ImagePuzzleProps {
  className?: string;
  imageSrc?: string;
}

// Default gradient SVG as data URL
const DEFAULT_IMAGE = `https://cdn.pulse2.com/cdn/2024/01/Clerk-Logo.jpeg`;

type TabDirection = "flat" | "out" | "in";

interface PieceConfig {
  top: TabDirection;
  right: TabDirection;
  bottom: TabDirection;
  left: TabDirection;
}

interface CornerRadii {
  topLeft?: number;
  topRight?: number;
  bottomRight?: number;
  bottomLeft?: number;
}

interface PieceDefinition {
  key: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  config: PieceConfig;
  corners: CornerRadii;
  translate: { x: number; y: number };
  order: number;
}

const PUZZLE_SIZE = 400;
const PIECE_SIZE = PUZZLE_SIZE / 2;
const TAB_WIDTH = PIECE_SIZE * 0.45;
const TAB_DEPTH = PIECE_SIZE * 0.22;
const CURVE = TAB_WIDTH / 2.6;
const CORNER_RADIUS = PIECE_SIZE * 0.12;

const PIECE_DEFINITIONS: PieceDefinition[] = [
  {
    key: "topLeft",
    config: { top: "flat", right: "out", bottom: "out", left: "flat" },
    corners: { topLeft: CORNER_RADIUS },
    translate: { x: 0, y: 0 },
    order: 2,
  },
  {
    key: "topRight",
    config: { top: "flat", right: "flat", bottom: "out", left: "in" },
    corners: { topRight: CORNER_RADIUS },
    translate: { x: PIECE_SIZE, y: 0 },
    order: 1,
  },
  {
    key: "bottomLeft",
    config: { top: "in", right: "out", bottom: "flat", left: "flat" },
    corners: { bottomLeft: CORNER_RADIUS },
    translate: { x: 0, y: PIECE_SIZE },
    order: 3,
  },
  {
    key: "bottomRight",
    config: { top: "in", right: "flat", bottom: "flat", left: "in" },
    corners: { bottomRight: CORNER_RADIUS },
    translate: { x: PIECE_SIZE, y: PIECE_SIZE },
    order: 4,
  },
];

const formatCoord = (value: number) => Number(value.toFixed(3));
const createPiecePath = (
  { top, right, bottom, left }: PieceConfig,
  corners: CornerRadii
) => {
  const size = PIECE_SIZE;
  const half = size / 2;

  const rTopLeft = corners.topLeft ?? 0;
  const rTopRight = corners.topRight ?? 0;
  const rBottomRight = corners.bottomRight ?? 0;
  const rBottomLeft = corners.bottomLeft ?? 0;

  const topFirst = Math.max(rTopLeft, half - TAB_WIDTH / 2);
  const topSecond = Math.min(size - rTopRight, half + TAB_WIDTH / 2);

  const rightFirst = Math.max(rTopRight, half - TAB_WIDTH / 2);
  const rightSecond = Math.min(size - rBottomRight, half + TAB_WIDTH / 2);

  const bottomFirst = Math.min(size - rBottomRight, half + TAB_WIDTH / 2);
  const bottomSecond = Math.max(rBottomLeft, half - TAB_WIDTH / 2);

  const leftFirst = Math.min(size - rBottomLeft, half + TAB_WIDTH / 2);
  const leftSecond = Math.max(rTopLeft, half - TAB_WIDTH / 2);

  const topSegment = (direction: TabDirection) => {
    if (direction === "flat") {
      return `L ${formatCoord(size - rTopRight)} 0`;
    }

    const dir = direction === "out" ? -1 : 1;
    return [
      `L ${formatCoord(topFirst)} 0`,
      `C ${formatCoord(topFirst + CURVE)} 0 ${formatCoord(
        half - CURVE
      )} ${formatCoord(dir * TAB_DEPTH)} ${formatCoord(half)} ${formatCoord(
        dir * TAB_DEPTH
      )}`,
      `C ${formatCoord(half + CURVE)} ${formatCoord(
        dir * TAB_DEPTH
      )} ${formatCoord(topSecond - CURVE)} 0 ${formatCoord(topSecond)} 0`,
      `L ${formatCoord(size - rTopRight)} 0`,
    ].join(" ");
  };

  const rightSegment = (direction: TabDirection) => {
    if (direction === "flat") {
      return `L ${formatCoord(size)} ${formatCoord(size - rBottomRight)}`;
    }

    const dir = direction === "out" ? 1 : -1;
    return [
      `L ${formatCoord(size)} ${formatCoord(rightFirst)}`,
      `C ${formatCoord(size)} ${formatCoord(rightFirst + CURVE)} ${formatCoord(
        size + dir * TAB_DEPTH
      )} ${formatCoord(half - CURVE)} ${formatCoord(
        size + dir * TAB_DEPTH
      )} ${formatCoord(half)}`,
      `C ${formatCoord(size + dir * TAB_DEPTH)} ${formatCoord(
        half + CURVE
      )} ${formatCoord(size)} ${formatCoord(rightSecond - CURVE)} ${formatCoord(
        size
      )} ${formatCoord(rightSecond)}`,
      `L ${formatCoord(size)} ${formatCoord(size - rBottomRight)}`,
    ].join(" ");
  };

  const bottomSegment = (direction: TabDirection) => {
    if (direction === "flat") {
      return `L ${formatCoord(rBottomLeft)} ${formatCoord(size)}`;
    }

    const dir = direction === "out" ? 1 : -1;
    return [
      `L ${formatCoord(bottomFirst)} ${formatCoord(size)}`,
      `C ${formatCoord(bottomFirst - CURVE)} ${formatCoord(size)} ${formatCoord(
        half + CURVE
      )} ${formatCoord(size + dir * TAB_DEPTH)} ${formatCoord(
        half
      )} ${formatCoord(size + dir * TAB_DEPTH)}`,
      `C ${formatCoord(half - CURVE)} ${formatCoord(
        size + dir * TAB_DEPTH
      )} ${formatCoord(bottomSecond + CURVE)} ${formatCoord(
        size
      )} ${formatCoord(bottomSecond)} ${formatCoord(size)}`,
      `L ${formatCoord(rBottomLeft)} ${formatCoord(size)}`,
    ].join(" ");
  };

  const leftSegment = (direction: TabDirection) => {
    if (direction === "flat") {
      return `L 0 ${formatCoord(rTopLeft)}`;
    }

    const dir = direction === "out" ? -1 : 1;
    return [
      `L 0 ${formatCoord(leftFirst)}`,
      `C 0 ${formatCoord(leftFirst - CURVE)} ${formatCoord(
        dir * TAB_DEPTH
      )} ${formatCoord(half + CURVE)} ${formatCoord(
        dir * TAB_DEPTH
      )} ${formatCoord(half)}`,
      `C ${formatCoord(dir * TAB_DEPTH)} ${formatCoord(
        half - CURVE
      )} 0 ${formatCoord(leftSecond + CURVE)} 0 ${formatCoord(leftSecond)}`,
      `L 0 ${formatCoord(rTopLeft)}`,
    ].join(" ");
  };

  const commands: string[] = [`M ${formatCoord(rTopLeft)} 0`, topSegment(top)];

  if (rTopRight > 0) {
    commands.push(
      `Q ${formatCoord(size)} 0 ${formatCoord(size)} ${formatCoord(rTopRight)}`
    );
  }

  commands.push(rightSegment(right));

  if (rBottomRight > 0) {
    commands.push(
      `Q ${formatCoord(size)} ${formatCoord(size)} ${formatCoord(
        size - rBottomRight
      )} ${formatCoord(size)}`
    );
  }

  commands.push(bottomSegment(bottom));

  if (rBottomLeft > 0) {
    commands.push(
      `Q 0 ${formatCoord(size)} 0 ${formatCoord(size - rBottomLeft)}`
    );
  }

  commands.push(leftSegment(left));

  if (rTopLeft > 0) {
    commands.push(`Q 0 0 ${formatCoord(rTopLeft)} 0`);
  }

  commands.push("Z");

  return commands.join(" ");
};

// Animation constants - defined outside component to prevent recreation
const ANIMATE_IN_DURATION = 2.1;
const HOLD_DURATION = 3.0;
const ANIMATE_OUT_DURATION = 2.0;
const TOTAL_DURATION =
  ANIMATE_IN_DURATION + HOLD_DURATION + ANIMATE_OUT_DURATION;
const PIECE_OFFSET = PIECE_SIZE * 0.32;

// Shared transition config for better performance
const createTransition = (times: number[]): Transition => ({
  duration: TOTAL_DURATION,
  times,
  ease: [0.25, 0.1, 0.25, 1], // Custom cubic-bezier for smoother animation
  repeat: Infinity,
  repeatType: "loop" as const,
});

export const ImagePuzzle = memo(
  ({ className, imageSrc = DEFAULT_IMAGE }: ImagePuzzleProps) => {
    const rawId = useId();
    const clipPathPrefix = useMemo(() => rawId.replace(/:/g, ""), [rawId]);

    const pieces = useMemo(
      () =>
        PIECE_DEFINITIONS.map((piece) => {
          const path = createPiecePath(piece.config, piece.corners ?? {});
          const clipId = `${clipPathPrefix}-${piece.key}`;
          return {
            ...piece,
            path,
            clipId,
            center: {
              x: piece.translate.x + PIECE_SIZE / 2,
              y: piece.translate.y + PIECE_SIZE / 2,
            },
          };
        }).sort((a, b) => a.order - b.order),
      [clipPathPrefix]
    );

    // Memoize animation variants to prevent recreation on each render
    const pieceVariants = useMemo(() => {
      const topLeft: Variants = {
        initial: {
          opacity: 0,
          x: -PIECE_OFFSET,
          y: -PIECE_OFFSET,
          rotate: -15,
        },
        animate: {
          opacity: [0, 1, 1, 1, 0],
          x: [-PIECE_OFFSET, 0, 0, 0, -PIECE_OFFSET],
          y: [-PIECE_OFFSET, 0, 0, 0, -PIECE_OFFSET],
          rotate: [-15, 0, 0, 0, -15],
        },
      };

      const topRight: Variants = {
        initial: { opacity: 0, x: PIECE_OFFSET, y: -PIECE_OFFSET, rotate: 15 },
        animate: {
          opacity: [0, 0, 1, 1, 0],
          x: [PIECE_OFFSET, PIECE_OFFSET, 0, 0, PIECE_OFFSET],
          y: [-PIECE_OFFSET, -PIECE_OFFSET, 0, 0, -PIECE_OFFSET],
          rotate: [15, 15, 0, 0, 15],
        },
      };

      const bottomLeft: Variants = {
        initial: { opacity: 0, x: -PIECE_OFFSET, y: PIECE_OFFSET, rotate: -15 },
        animate: {
          opacity: [0, 0, 1, 1, 0],
          x: [-PIECE_OFFSET, -PIECE_OFFSET, 0, 0, -PIECE_OFFSET],
          y: [PIECE_OFFSET, PIECE_OFFSET, 0, 0, PIECE_OFFSET],
          rotate: [-15, -15, 0, 0, -15],
        },
      };

      const bottomRight: Variants = {
        initial: { opacity: 0, x: PIECE_OFFSET, y: PIECE_OFFSET, rotate: 15 },
        animate: {
          opacity: [0, 0, 1, 1, 0],
          x: [PIECE_OFFSET, PIECE_OFFSET, 0, 0, PIECE_OFFSET],
          y: [PIECE_OFFSET, PIECE_OFFSET, 0, 0, PIECE_OFFSET],
          rotate: [15, 15, 0, 0, 15],
        },
      };

      return { topLeft, topRight, bottomLeft, bottomRight };
    }, []);

    // Memoize transitions to prevent recreation
    const transitions = useMemo(
      () => ({
        topLeft: createTransition([0, 0.1, 0.296, 0.718, 1]),
        topRight: createTransition([0, 0.15, 0.2, 0.718, 1]),
        bottomLeft: createTransition([0, 0.2, 0.25, 0.718, 1]),
        bottomRight: createTransition([0, 0.25, 0.296, 0.718, 1]),
      }),
      []
    );

    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <div className="relative w-full max-w-xs aspect-square overflow-visible">
          <motion.svg
            viewBox={`0 0 ${PUZZLE_SIZE} ${PUZZLE_SIZE}`}
            className="w-full h-full rounded-2xl md:rounded-3xl"
            style={{ overflow: "visible" }}
          >
            <defs>
              {pieces.map((piece) => (
                <clipPath
                  key={piece.clipId}
                  id={piece.clipId}
                  clipPathUnits="userSpaceOnUse"
                >
                  <path
                    d={piece.path}
                    transform={`translate(${piece.translate.x} ${piece.translate.y})`}
                  />
                </clipPath>
              ))}
            </defs>

            {pieces.map((piece) => (
              <motion.g
                key={piece.key}
                variants={pieceVariants[piece.key]}
                initial="initial"
                animate="animate"
                transition={transitions[piece.key]}
                style={{
                  transformOrigin: `${piece.center.x}px ${piece.center.y}px`,
                  willChange: "transform, opacity",
                }}
              >
                <g clipPath={`url(#${piece.clipId})`}>
                  <image
                    href={imageSrc}
                    x="0"
                    y="0"
                    width={PUZZLE_SIZE}
                    height={PUZZLE_SIZE}
                    preserveAspectRatio="xMidYMid slice"
                  />
                </g>
                <path
                  d={piece.path}
                  transform={`translate(${piece.translate.x} ${piece.translate.y})`}
                  fill="none"
                  stroke="rgba(148,163,184,0.20)"
                  strokeWidth={1}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </motion.g>
            ))}
          </motion.svg>
        </div>
      </div>
    );
  }
);

ImagePuzzle.displayName = "ImagePuzzle";

export default ImagePuzzle;
