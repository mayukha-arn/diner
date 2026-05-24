import * as React from "react";

export function SmashBurger(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={120}
      height={120}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-float drop-shadow-md"
      {...props}
    >
      {/* Drop shadow */}
      <ellipse cx={60} cy={105} rx={45} ry={10} fill="rgba(26,16,8,0.15)" />
      
      {/* Lettuce */}
      <path
        d="M20 60C15 50 30 35 40 40C50 30 70 30 80 40C90 35 105 50 100 60C105 70 90 85 80 80C70 90 50 90 40 80C30 85 15 70 20 60Z"
        fill="url(#lettuce-grad)"
        stroke="#1a1008"
        strokeWidth={2}
      />
      <defs>
        <radialGradient id="lettuce-grad" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#7bc94a" />
          <stop offset="100%" stopColor="#5aa832" />
        </radialGradient>
      </defs>

      {/* Tomato */}
      <circle cx={55} cy={55} r={35} fill="#d63020" stroke="#1a1008" strokeWidth={2} />
      <circle cx={55} cy={55} r={25} stroke="#1a1008" strokeWidth={1} strokeOpacity={0.3} />
      <path d="M55 20L55 90 M20 55L90 55 M30 30L80 80 M80 30L30 80" stroke="#1a1008" strokeWidth={1} strokeOpacity={0.3} />

      {/* Cheese */}
      <g transform="rotate(20 60 60)">
        <rect x={25} y={25} width={70} height={70} rx={4} fill="#F5C842" stroke="#1a1008" strokeWidth={2} />
      </g>

      {/* Patty */}
      <circle cx={65} cy={65} r={38} fill="#5a2e10" stroke="#1a1008" strokeWidth={2} />
      <path d="M40 50L90 50 M35 65L95 65 M40 80L90 80" stroke="#1a1008" strokeWidth={2} strokeOpacity={0.5} strokeLinecap="round" />

      {/* Bun */}
      <circle cx={60} cy={60} r={42} fill="url(#bun-grad)" stroke="#1a1008" strokeWidth={2} />
      <defs>
        <radialGradient id="bun-grad" cx="0.4" cy="0.4" r="0.6">
          <stop offset="0%" stopColor="#f5ca70" />
          <stop offset="100%" stopColor="#f0c060" />
        </radialGradient>
      </defs>

      {/* Bun Highlight */}
      <ellipse cx={45} cy={45} rx={12} ry={8} transform="rotate(-30 45 45)" fill="#ffffff" fillOpacity={0.3} />

      {/* Sesame Seeds */}
      {[
        [40, 30], [60, 25], [80, 35],
        [30, 45], [50, 40], [70, 45], [90, 55],
        [35, 65], [60, 60], [85, 70],
        [45, 80], [70, 80]
      ].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={2} ry={1} transform={`rotate(${i * 45} ${x} ${y})`} fill="#f0ecd0" />
      ))}

      {/* Steam */}
      <path d="M40 20Q35 10 40 0" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" fill="none" opacity={0.6}>
        <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" />
        <animate attributeName="d" values="M40 20Q35 10 40 0; M40 20Q45 10 40 0; M40 20Q35 10 40 0" dur="2s" repeatCount="indefinite" />
      </path>
      <path d="M60 15Q55 5 60 -5" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" fill="none" opacity={0.6}>
        <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2.5s" repeatCount="indefinite" delay="0.5s" />
        <animate attributeName="d" values="M60 15Q55 5 60 -5; M60 15Q65 5 60 -5; M60 15Q55 5 60 -5" dur="2.5s" repeatCount="indefinite" delay="0.5s" />
      </path>
      <path d="M80 20Q75 10 80 0" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" fill="none" opacity={0.6}>
        <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2.2s" repeatCount="indefinite" delay="1s" />
        <animate attributeName="d" values="M80 20Q75 10 80 0; M80 20Q85 10 80 0; M80 20Q75 10 80 0" dur="2.2s" repeatCount="indefinite" delay="1s" />
      </path>
    </svg>
  );
}
