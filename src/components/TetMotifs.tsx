import React from 'react';

/**
 * Realistic double-loop wire spiral binding with paper hole punches and metallic sheen
 */
export const SpiralCoilRow = ({
  count = 19,
  ringColor = '#C59A45',
}: {
  count?: number;
  ringColor?: string;
}) => {
  const rings = Array.from({ length: count }, (_, i) => i);
  return (
    <div
      className="relative z-20 flex w-full items-end justify-between px-5 sm:px-7 pointer-events-none select-none -mb-3"
      aria-hidden="true"
    >
      {rings.map((idx) => (
        <div key={idx} className="flex flex-col items-center group">
          {/* Metallic spiral loop */}
          <div
            className="w-2.5 h-6 rounded-full border-[1.5px] shadow-sm transform transition-transform"
            style={{
              borderColor: ringColor,
              background: `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, ${ringColor} 50%, rgba(60,30,10,0.85) 100%)`,
              boxShadow: '0 2px 4px rgba(0,0,0,0.35)',
            }}
          />
          {/* Paper punched hole */}
          <div className="w-2 h-2.5 rounded-sm bg-neutral-900/80 -mt-1.5 border border-black/30 shadow-inner" />
        </div>
      ))}
    </div>
  );
};

/**
 * Realistic Wall Calendar Hanger with wall cord, nail peg, and industrial brass/matte clips
 */
export const WallClipsRow = () => (
  <div
    className="relative z-20 flex w-full flex-col items-center pointer-events-none select-none -mb-1.5"
    aria-hidden="true"
  >
    {/* Wall nail and triangle hanging cord */}
    <div className="flex flex-col items-center -mb-2">
      <div className="w-2.5 h-2.5 rounded-full bg-amber-700 border border-amber-900 shadow-md" />
      <svg width="120" height="24" viewBox="0 0 120 24" fill="none" className="opacity-75">
        <path d="M60 2 L12 24 M60 2 L108 24" stroke="#78716C" strokeWidth="1.5" strokeDasharray="2 2" />
      </svg>
    </div>

    {/* Clamps bar */}
    <div className="flex w-full items-end justify-between px-10 sm:px-14">
      {[0, 1].map((idx) => (
        <div key={idx} className="flex flex-col items-center">
          <svg width="40" height="34" viewBox="0 0 40 34" fill="none">
            <rect x="8" y="2" width="24" height="6" rx="2" fill="#B45309" stroke="#78350F" strokeWidth="1" />
            <path d="M4 8 L36 8 L38 28 L2 28 Z" fill="#1C1917" stroke="#292524" strokeWidth="1" />
            <rect x="18" y="14" width="4" height="4" rx="2" fill="#D97706" />
            <rect x="6" y="26" width="28" height="4" rx="1" fill="#44403C" />
          </svg>
        </div>
      ))}
    </div>
  </div>
);

/**
 * Traditional Vietnamese Golden Apricot Blossom (Hoa Mai Vàng)
 */
export const HoaMaiCorner = ({
  color = '#F59E0B',
  className = '',
}: {
  color?: string;
  className?: string;
}) => (
  <svg viewBox="0 0 140 140" className={className} fill="none" aria-hidden="true">
    {/* Twig */}
    <path
      d="M2 14 Q44 26 76 62 Q102 92 136 102"
      stroke="#543315"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M48 36 Q64 20 90 18"
      stroke="#543315"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <path
      d="M84 72 Q108 58 126 56"
      stroke="#543315"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    {[
      { cx: 34, cy: 26, r: 12 },
      { cx: 86, cy: 20, r: 10 },
      { cx: 76, cy: 62, r: 14 },
      { cx: 114, cy: 56, r: 9 },
      { cx: 120, cy: 92, r: 11 },
    ].map((f, i) => (
      <g key={i} transform={`translate(${f.cx}, ${f.cy})`}>
        {/* 5 rounded petals */}
        {[0, 72, 144, 216, 288].map((angle, pi) => (
          <ellipse
            key={pi}
            cx="0"
            cy={-f.r * 0.58}
            rx={f.r * 0.44}
            ry={f.r * 0.52}
            fill={color}
            transform={`rotate(${angle})`}
            opacity="0.95"
          />
        ))}
        {/* Core & stamens */}
        <circle cx="0" cy="0" r={f.r * 0.28} fill="#B45309" />
        <circle cx="0" cy="0" r={f.r * 0.16} fill="#FDE68A" />
      </g>
    ))}
  </svg>
);

/**
 * Traditional Vietnamese Lacquer Seal (Triện Đỏ Xuân Tết)
 */
export const ZodiacSeal = ({
  year,
  accentColor = '#B91C1C',
}: {
  year: number;
  accentColor: string;
}) => {
  const isMui = year === 2027;
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" aria-hidden="true">
      {/* Ornate octagonal stamp border */}
      <rect
        x="6"
        y="6"
        width="88"
        height="88"
        rx="8"
        fill="none"
        stroke={accentColor}
        strokeWidth="3"
      />
      <rect
        x="11"
        y="11"
        width="78"
        height="78"
        rx="5"
        fill="none"
        stroke={accentColor}
        strokeWidth="1.2"
        strokeDasharray="4 2"
      />
      {/* Decorative corners */}
      <path d="M6 18 L18 6 M82 6 L94 18 M94 82 L82 94 M18 94 L6 82" stroke={accentColor} strokeWidth="2" />
      <text
        x="50"
        y="42"
        textAnchor="middle"
        fill={accentColor}
        fontSize="17"
        fontWeight="800"
        fontFamily="Georgia, serif"
        letterSpacing="1"
      >
        {isMui ? 'ĐINH MÙI' : 'BÍNH NGỌ'}
      </text>
      <text
        x="50"
        y="62"
        textAnchor="middle"
        fill={accentColor}
        fontSize="16"
        fontWeight="700"
        fontFamily="sans-serif"
      >
        {year}
      </text>
      <text
        x="50"
        y="78"
        textAnchor="middle"
        fill={accentColor}
        fontSize="10"
        fontWeight="600"
        letterSpacing="2"
      >
        TÂN NIÊN
      </text>
    </svg>
  );
};

/**
 * Dong Son Bronze Drum Motif Watermark (Họa tiết Trống Đồng Đông Sơn)
 */
export const DongSonWatermark = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" aria-hidden="true">
    <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
    <circle cx="100" cy="100" r="82" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
    <circle cx="100" cy="100" r="66" stroke="currentColor" strokeWidth="1" strokeDasharray="5 3" opacity="0.6" />
    <circle cx="100" cy="100" r="48" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
    <circle cx="100" cy="100" r="26" stroke="currentColor" strokeWidth="1" opacity="0.8" />
    {/* 12-ray Sun Star */}
    {Array.from({ length: 12 }, (_, i) => {
      const angle = (i * 30 * Math.PI) / 180;
      const x2 = 100 + 44 * Math.cos(angle);
      const y2 = 100 + 44 * Math.sin(angle);
      return <line key={i} x1="100" y1="100" x2={x2} y2={y2} stroke="currentColor" strokeWidth="1.5" opacity="0.8" />;
    })}
    <circle cx="100" cy="100" r="10" fill="currentColor" opacity="0.6" />
  </svg>
);
