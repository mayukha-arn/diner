import * as React from "react";

export function SmashBurger(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={120} height={120} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-float drop-shadow-md" {...props}>
      <ellipse cx={60} cy={105} rx={45} ry={10} fill="rgba(26,16,8,0.15)" />
      <path d="M20 60C15 50 30 35 40 40C50 30 70 30 80 40C90 35 105 50 100 60C105 70 90 85 80 80C70 90 50 90 40 80C30 85 15 70 20 60Z" fill="url(#lettuce-grad)" stroke="#1a1008" strokeWidth={2} />
      <defs>
        <radialGradient id="lettuce-grad" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#7bc94a" />
          <stop offset="100%" stopColor="#5aa832" />
        </radialGradient>
      </defs>
      <circle cx={55} cy={55} r={35} fill="#d63020" stroke="#1a1008" strokeWidth={2} />
      <g transform="rotate(20 60 60)">
        <rect x={25} y={25} width={70} height={70} rx={4} fill="#F5C842" stroke="#1a1008" strokeWidth={2} />
      </g>
      <circle cx={65} cy={65} r={38} fill="#5a2e10" stroke="#1a1008" strokeWidth={2} />
      <circle cx={60} cy={60} r={42} fill="url(#bun-grad)" stroke="#1a1008" strokeWidth={2} />
      <defs>
        <radialGradient id="bun-grad" cx="0.4" cy="0.4" r="0.6">
          <stop offset="0%" stopColor="#f5ca70" />
          <stop offset="100%" stopColor="#f0c060" />
        </radialGradient>
      </defs>
      <ellipse cx={45} cy={45} rx={12} ry={8} transform="rotate(-30 45 45)" fill="#ffffff" fillOpacity={0.3} />
    </svg>
  );
}
