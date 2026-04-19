"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

export type IsoMemoryHeroCard = {
  label: string;
  sub: string;
  tone?: "brand" | "neutral";
  position: [number, number];
  connector: [number, number, number, number];
};

export type IsoMemoryHeroProps = {
  className?: string;
  gridSize?: number;
  unit?: number;
  showCards?: boolean;
  cards?: IsoMemoryHeroCard[];
  centerBadge?: string | null;
};

// true 2:1 isometric projection, light from top-left
const iso = (x: number, y: number, z: number, s = 24): [number, number] => [
  (x - y) * s,
  (x + y) * 0.5 * s - z * s,
];

type Cube = { i: number; j: number; h: number; isCenter: boolean; order: number };

const shade = (h: number) =>
  h > 1.3
    ? { top: "#2E2E2E", left: "#161616", right: "#222" }
    : h > 0.7
      ? { top: "#242424", left: "#131313", right: "#1C1C1C" }
      : { top: "#1C1C1C", left: "#111", right: "#181818" };

const DEFAULT_CARDS: IsoMemoryHeroCard[] = [
  { label: "Claude", sub: "mem_021 · synced", tone: "brand", position: [-240, -80], connector: [130, 22, 188, 8] },
  { label: "Cursor", sub: "mem_048 · live", tone: "neutral", position: [160, -110], connector: [0, 22, -50, 12] },
];

const SANS = 'Geist, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';
const MONO = '"Geist Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

export default function IsoMemoryHero({
  className,
  gridSize = 6,
  unit = 24,
  showCards = false,
  cards = DEFAULT_CARDS,
  centerBadge = null,
}: IsoMemoryHeroProps) {
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
    <div
      className={cn("relative flex items-center justify-center w-full", className)}
      style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(169,67,42,0.08), transparent 60%)" }}
    >
      <svg
        viewBox="-155 -20 310 180"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto max-w-[1400px]"
        role="img"
        aria-label="Isometric memory grid illustration"
      >
        <defs>
          <linearGradient id="brandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D96B3F" />
            <stop offset="100%" stopColor="#A9432A" />
          </linearGradient>
        </defs>

        {/* base plate */}
        <path d={plate} fill="#0F0F0F" />
        {plateLines.map((l, k) => (
          <line key={k} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
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
            const sh = shade(h);
            const topFill = isCenter ? "url(#brandGrad)" : sh.top;
            const leftFill = isCenter ? "#6B2A1A" : sh.left;
            const rightFill = isCenter ? "#A9432A" : sh.right;
            const stroke = isCenter ? "#D96B3F" : "#333";
            const sw = isCenter ? 1.2 : 0.8;
            const cx = (ltx + rtx + ftx + btx) / 4;
            const cy = (lty + rty + fty + bty) / 4;
            return (
              <g key={`${i}-${j}`}>
                <polygon points={`${lbx},${lby} ${rbx},${rby} ${rtx},${rty} ${ltx},${lty}`} fill={leftFill} stroke={stroke} strokeWidth={sw} />
                <polygon points={`${rbx},${rby} ${fbx},${fby} ${ftx},${fty} ${rtx},${rty}`} fill={rightFill} stroke={stroke} strokeWidth={sw} />
                <polygon points={`${ltx},${lty} ${rtx},${rty} ${ftx},${fty} ${btx},${bty}`} fill={topFill} stroke={stroke} strokeWidth={sw} />
                {isCenter && (
                  <>
                    <circle cx={cx} cy={cy - 2} r={11} fill="none" stroke="#D96B3F" strokeWidth={1.2} opacity={0.8} />
                    <circle cx={cx} cy={cy - 2} r={5} fill="#FFFFFF" opacity={0.95} />
                  </>
                )}
              </g>
            );
          })}
        </g>

        {/* floating cards */}
        {showCards &&
          cards.map((card, idx) => {
            const [px, py] = card.position;
            const [cx1, cy1, cx2, cy2] = card.connector;
            const iconFill = card.tone === "brand" ? "#A9432A" : "#1F1F1F";
            return (
              <g key={idx} transform={`translate(${px},${py})`}>
                <line x1={cx1} y1={cy1} x2={cx2} y2={cy2} stroke="#D96B3F" strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />
                <rect width={130} height={44} rx={8} fill="#1A1A1A" stroke="#333" strokeWidth={1} />
                <rect x={10} y={12} width={20} height={20} rx={4} fill={iconFill} />
                {card.label === "Cursor" && <path d="M17 18 L20 24 L23 18 Z" fill="#E6E4E1" />}
                <text x={38} y={20} fontFamily={SANS} fontSize={11} fontWeight={500} fill="#FFFFFF">{card.label}</text>
                <text x={38} y={33} fontFamily={MONO} fontSize={9} fill="#6B6762">{card.sub}</text>
              </g>
            );
          })}

        {/* center pill badge */}
        {centerBadge && (
          <g transform="translate(-52,110)">
            <rect width={104} height={30} rx={15} fill="rgba(169,67,42,0.18)" stroke="#A9432A" strokeWidth={1} />
            <circle cx={14} cy={15} r={4} fill="#D96B3F" />
            <text x={24} y={19} fontFamily={MONO} fontSize={11} fill="#D96B3F">{centerBadge}</text>
          </g>
        )}
      </svg>
    </div>
  );
}
