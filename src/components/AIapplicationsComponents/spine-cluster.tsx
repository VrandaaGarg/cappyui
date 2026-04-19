"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

export type SpineClusterProps = {
  className?: string;
};

// true 2:1 isometric projection
const iso = (x: number, y: number, z: number, s = 20): [number, number] => [
  (x - y) * s,
  (x + y) * 0.5 * s - z * s,
];

type Cube = { x: number; y: number; z: number; brand: boolean; order: number };

// brand positions — base center + plus-shape middle layer + cap
const BRAND_SET = new Set<string>([
  "1,1,0",
  "1,0,1",
  "0,1,1",
  "1,1,1",
  "2,1,1",
  "1,2,1",
  "1,1,2",
]);

// top-layer corners omitted (top is cross-shaped only)
const TOP_OMIT = new Set<string>(["0,0,2", "2,0,2", "0,2,2", "2,2,2"]);

export default function SpineCluster({ className }: SpineClusterProps) {
  const s = 20;
  const OFFSET = -1;

  const cubes = useMemo<Cube[]>(() => {
    const out: Cube[] = [];
    for (let z = 0; z < 3; z++) {
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          const key = `${x},${y},${z}`;
          if (z === 2 && TOP_OMIT.has(key)) continue;
          out.push({ x, y, z, brand: BRAND_SET.has(key), order: x + y + z });
        }
      }
    }
    return out.sort((a, b) => a.order - b.order);
  }, []);

  const plate = useMemo(() => {
    const [ax, ay] = iso(-2.5, -2.5, 0, s);
    const [bx, by] = iso(2.5, -2.5, 0, s);
    const [cx, cy] = iso(2.5, 2.5, 0, s);
    const [dx, dy] = iso(-2.5, 2.5, 0, s);
    return `M${ax},${ay} L${bx},${by} L${cx},${cy} L${dx},${dy} Z`;
  }, [s]);

  const plateLines = useMemo(() => {
    const out: [number, number, number, number][] = [];
    for (let i = -2; i <= 2; i++) {
      const [x1, y1] = iso(i, -2.5, 0, s);
      const [x2, y2] = iso(i, 2.5, 0, s);
      out.push([x1, y1, x2, y2]);
      const [x3, y3] = iso(-2.5, i, 0, s);
      const [x4, y4] = iso(2.5, i, 0, s);
      out.push([x3, y3, x4, y4]);
    }
    return out;
  }, [s]);

  return (
    <div className={cn("relative flex items-center justify-center w-full", className)}>
      <svg
        viewBox="-160 -100 320 170"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto max-w-[1200px]"
        role="img"
        aria-label="Isometric spine cluster"
      >
        {/* base plate */}
        <path d={plate} fill="#0D0D0D" />
        {plateLines.map((l, k) => (
          <line key={k} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
        ))}

        {/* cubes — painter's algorithm */}
        <g strokeLinejoin="round">
          {cubes.map(({ x, y, z, brand }) => {
            const w = 0.9, d = 0.9, h = 0.9;
            const X = x + OFFSET, Y = y + OFFSET;
            const [lbx, lby] = iso(X, Y + d, z, s);
            const [rbx, rby] = iso(X + w, Y + d, z, s);
            const [fbx, fby] = iso(X + w, Y, z, s);
            const [ltx, lty] = iso(X, Y + d, z + h, s);
            const [rtx, rty] = iso(X + w, Y + d, z + h, s);
            const [ftx, fty] = iso(X + w, Y, z + h, s);
            const [btx, bty] = iso(X, Y, z + h, s);
            const topFill = brand ? "#34D399" : "#2A2A2A";
            const leftFill = brand ? "#0F3D2A" : "#1A1A1A";
            const rightFill = brand ? "#1F7A54" : "#232323";
            const stroke = brand ? "#34D399" : "#333";
            return (
              <g key={`${x}-${y}-${z}`}>
                <polygon points={`${lbx},${lby} ${rbx},${rby} ${rtx},${rty} ${ltx},${lty}`} fill={leftFill} stroke={stroke} strokeWidth={0.8} />
                <polygon points={`${rbx},${rby} ${fbx},${fby} ${ftx},${fty} ${rtx},${rty}`} fill={rightFill} stroke={stroke} strokeWidth={0.8} />
                <polygon points={`${ltx},${lty} ${rtx},${rty} ${ftx},${fty} ${btx},${bty}`} fill={topFill} stroke={stroke} strokeWidth={0.8} />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
