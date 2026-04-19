"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

export type StackedGridProps = {
  className?: string;
  gridSize?: number;
  unit?: number;
};

// true 2:1 isometric projection, light from top-left
const iso = (x: number, y: number, z: number, s = 24): [number, number] => [
  (x - y) * s,
  (x + y) * 0.5 * s - z * s,
];

type Cube = { i: number; j: number; h: number; isCenter: boolean; order: number };

// Three height tiers — each maps to a CSS variable trio for theme-aware shading
const tierVars = (h: number) =>
  h > 1.3
    ? { top: "var(--sg-top-3)", left: "var(--sg-left-3)", right: "var(--sg-right-3)" }
    : h > 0.7
      ? { top: "var(--sg-top-2)", left: "var(--sg-left-2)", right: "var(--sg-right-2)" }
      : { top: "var(--sg-top-1)", left: "var(--sg-left-1)", right: "var(--sg-right-1)" };

export default function StackedGrid({
  className,
  gridSize = 6,
  unit = 24,
}: StackedGridProps) {
  const N = gridSize;
  const s = unit;
  const centerI = Math.floor(N / 2) - 1;
  const centerJ = Math.floor(N / 2) - 1;

  const cubes = useMemo<Cube[]>(() => {
    const out: Cube[] = [];
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const dist = Math.sqrt((i - 2.5) ** 2 + (j - 2.5) ** 2);
        const h = Math.max(0, 1.8 - dist * 0.55);
        if (h < 0.08) continue;
        out.push({ i, j, h, isCenter: i === centerI && j === centerJ, order: i + j });
      }
    }
    return out.sort((a, b) => a.order - b.order); // painter's algorithm
  }, [N, centerI, centerJ]);

  const plate = useMemo(() => {
    const [ax, ay] = iso(0, 0, -0.02, s);
    const [bx, by] = iso(N, 0, -0.02, s);
    const [cx, cy] = iso(N, N, -0.02, s);
    const [dx, dy] = iso(0, N, -0.02, s);
    return `M${ax},${ay} L${bx},${by} L${cx},${cy} L${dx},${dy} Z`;
  }, [N, s]);

  const plateLines = useMemo(() => {
    const out: [number, number, number, number][] = [];
    for (let i = 0; i <= N; i++) {
      const [x1, y1] = iso(i, 0, -0.02, s);
      const [x2, y2] = iso(i, N, -0.02, s);
      out.push([x1, y1, x2, y2]);
      const [x3, y3] = iso(0, i, -0.02, s);
      const [x4, y4] = iso(N, i, -0.02, s);
      out.push([x3, y3, x4, y4]);
    }
    return out;
  }, [N, s]);

  return (
    <div className={cn("stacked-grid relative flex items-center justify-center w-full", className)}>
      {/* Theme-aware palette via scoped CSS variables. Brand stays fixed. */}
      <style>{`
        .stacked-grid {
          --sg-plate: #EBEBEB;
          --sg-plate-line: rgba(0,0,0,0.05);
          --sg-stroke: #A3A3A3;
          --sg-top-1: #D4D4D4;  --sg-left-1: #A3A3A3;  --sg-right-1: #BDBDBD;
          --sg-top-2: #C8C8C8;  --sg-left-2: #999999;  --sg-right-2: #B0B0B0;
          --sg-top-3: #BCBCBC;  --sg-left-3: #8C8C8C;  --sg-right-3: #A3A3A3;
        }
        .dark .stacked-grid {
          --sg-plate: #0F0F0F;
          --sg-plate-line: rgba(255,255,255,0.04);
          --sg-stroke: #333;
          --sg-top-1: #1C1C1C;  --sg-left-1: #111;     --sg-right-1: #181818;
          --sg-top-2: #242424;  --sg-left-2: #131313;  --sg-right-2: #1C1C1C;
          --sg-top-3: #2E2E2E;  --sg-left-3: #161616;  --sg-right-3: #222;
        }
      `}</style>
      <svg
        viewBox="-180 -40 370 220"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto max-w-[1400px]"
        role="img"
        aria-label="Isometric stacked grid"
      >
        <defs>
          <linearGradient id="stackedGridGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#1F7A54" />
          </linearGradient>
        </defs>

        {/* base plate */}
        <path d={plate} fill="var(--sg-plate)" />
        {plateLines.map((l, k) => (
          <line key={k} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke="var(--sg-plate-line)" strokeWidth={0.5} />
        ))}

        {/* cubes — painter's algorithm (back-to-front) */}
        <g strokeLinejoin="round">
          {cubes.map(({ i, j, h, isCenter }) => {
            const w = 0.92, d = 0.92;
            const [lbx, lby] = iso(i, j + d, 0, s);
            const [rbx, rby] = iso(i + w, j + d, 0, s);
            const [fbx, fby] = iso(i + w, j, 0, s);
            const [ltx, lty] = iso(i, j + d, h, s);
            const [rtx, rty] = iso(i + w, j + d, h, s);
            const [ftx, fty] = iso(i + w, j, h, s);
            const [btx, bty] = iso(i, j, h, s);
            const t = tierVars(h);
            const topFill = isCenter ? "url(#stackedGridGrad)" : t.top;
            const leftFill = isCenter ? "#0F3D2A" : t.left;
            const rightFill = isCenter ? "#1F7A54" : t.right;
            const stroke = isCenter ? "#34D399" : "var(--sg-stroke)";
            const sw = isCenter ? 1.2 : 0.8;
            return (
              <g key={`${i}-${j}`}>
                <polygon points={`${lbx},${lby} ${rbx},${rby} ${rtx},${rty} ${ltx},${lty}`} fill={leftFill} stroke={stroke} strokeWidth={sw} />
                <polygon points={`${rbx},${rby} ${fbx},${fby} ${ftx},${fty} ${rtx},${rty}`} fill={rightFill} stroke={stroke} strokeWidth={sw} />
                <polygon points={`${ltx},${lty} ${rtx},${rty} ${ftx},${fty} ${btx},${bty}`} fill={topFill} stroke={stroke} strokeWidth={sw} />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
