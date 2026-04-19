"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

export type DomedGridProps = {
  className?: string;
  gridSize?: number;
  unit?: number;
  maxHeight?: number;
  falloff?: number;
  brandRadius?: number;
};

// true 2:1 isometric projection
const iso = (x: number, y: number, z: number, s = 20): [number, number] => [
  (x - y) * s,
  (x + y) * 0.5 * s - z * s,
];

type Cube = { i: number; j: number; h: number; brand: boolean; order: number };

export default function DomedGrid({
  className,
  gridSize = 9,
  unit = 20,
  maxHeight = 1.6,
  falloff = 0.45,
  brandRadius = 1.5,
}: DomedGridProps) {
  const N = gridSize;
  const s = unit;
  const center = (N - 1) / 2;

  const cubes = useMemo<Cube[]>(() => {
    const out: Cube[] = [];
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const dx = i - center;
        const dy = j - center;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const h = Math.max(0, maxHeight - dist * falloff);
        if (h < 0.1) continue;
        const brand =
          Math.abs(dx) < brandRadius &&
          Math.abs(dy) < brandRadius &&
          (i + j) % 2 === 0;
        out.push({ i, j, h, brand, order: i + j });
      }
    }
    return out.sort((a, b) => a.order - b.order);
  }, [N, maxHeight, falloff, brandRadius, center]);

  const origin = -N / 2;

  const plate = useMemo(() => {
    const [ax, ay] = iso(origin, origin, 0, s);
    const [bx, by] = iso(origin + N, origin, 0, s);
    const [cx, cy] = iso(origin + N, origin + N, 0, s);
    const [dx, dy] = iso(origin, origin + N, 0, s);
    return `M${ax},${ay} L${bx},${by} L${cx},${cy} L${dx},${dy} Z`;
  }, [N, s, origin]);

  const plateLines = useMemo(() => {
    const out: [number, number, number, number][] = [];
    for (let i = 0; i <= N; i++) {
      const [x1, y1] = iso(origin + i, origin, 0, s);
      const [x2, y2] = iso(origin + i, origin + N, 0, s);
      out.push([x1, y1, x2, y2]);
      const [x3, y3] = iso(origin, origin + i, 0, s);
      const [x4, y4] = iso(origin + N, origin + i, 0, s);
      out.push([x3, y3, x4, y4]);
    }
    return out;
  }, [N, s, origin]);

  return (
    <div className={cn("domed-grid w-full h-full", className)}>
      {/* Theme-aware palette via scoped CSS variables. Brand stays fixed. */}
      <style>{`
        .domed-grid {
          --dg-plate: #EBEBEB;
          --dg-plate-edge: #C8C8C8;
          --dg-plate-line: rgba(0,0,0,0.05);
          --dg-stroke: #A3A3A3;
          --dg-top: #D4D4D4;
          --dg-left: #A3A3A3;
          --dg-right: #BDBDBD;
        }
        .dark .domed-grid {
          --dg-plate: #0D0D0D;
          --dg-plate-edge: #262626;
          --dg-plate-line: rgba(255,255,255,0.04);
          --dg-stroke: #333;
          --dg-top: #1C1C1C;
          --dg-left: #0D0D0D;
          --dg-right: #151515;
        }
      `}</style>
      <svg
        viewBox="-280 -140 560 260"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        className="w-full h-full"
      >
        {/* base plate */}
        <path d={plate} fill="var(--dg-plate)" stroke="var(--dg-plate-edge)" strokeWidth={0.2} />
        {plateLines.map((l, k) => (
          <line key={k} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke="var(--dg-plate-line)" strokeWidth={0.5} />
        ))}

        {/* cubes — painter's algorithm (back-to-front) */}
        <g strokeLinejoin="round">
          {cubes.map(({ i, j, h, brand }) => {
            const w = 0.9, d = 0.9;
            const X = origin + i, Y = origin + j;
            const [lbx, lby] = iso(X, Y + d, 0, s);
            const [rbx, rby] = iso(X + w, Y + d, 0, s);
            const [fbx, fby] = iso(X + w, Y, 0, s);
            const [ltx, lty] = iso(X, Y + d, h, s);
            const [rtx, rty] = iso(X + w, Y + d, h, s);
            const [ftx, fty] = iso(X + w, Y, h, s);
            const [btx, bty] = iso(X, Y, h, s);
            const topFill = brand ? "#D96B3F" : "var(--dg-top)";
            const leftFill = brand ? "#6B2A1A" : "var(--dg-left)";
            const rightFill = brand ? "#A9432A" : "var(--dg-right)";
            const stroke = brand ? "#D96B3F" : "var(--dg-stroke)";
            const sw = brand ? 0.9 : 0.6;
            const op = brand ? 0.95 : 0.8;
            return (
              <g key={`${i}-${j}`} opacity={op}>
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

// ----------------------------------------------------------------------------
// Showcase wrapper — DomedGrid inside a theme-aware rounded card.
// ----------------------------------------------------------------------------
export function DomedGridShowcase() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-neutral-300/60 dark:border-[#262626] bg-white dark:bg-[#0A0A0A] h-[420px]">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <DomedGrid />
      </div>
    </section>
  );
}
