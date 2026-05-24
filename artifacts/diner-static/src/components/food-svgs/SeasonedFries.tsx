import * as React from "react";

export function SeasonedFries(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={120} height={120} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-float drop-shadow-md" {...props}>
      <ellipse cx={60} cy={105} rx={40} ry={8} fill="rgba(26,16,8,0.15)" />
      <g stroke="#1a1008" strokeWidth={2}>
        <rect x={25} y={30} width={12} height={60} rx={2} fill="#EFB118" transform="rotate(-15 31 60)" />
        <rect x={45} y={20} width={12} height={70} rx={2} fill="#F5C842" transform="rotate(-5 51 55)" />
        <rect x={65} y={25} width={12} height={65} rx={2} fill="#EFB118" transform="rotate(5 71 57)" />
        <rect x={85} y={35} width={12} height={55} rx={2} fill="#F5C842" transform="rotate(15 91 62)" />
        <rect x={35} y={40} width={12} height={55} rx={2} fill="#F5C842" transform="rotate(-25 41 67)" />
        <rect x={55} y={35} width={12} height={60} rx={2} fill="#EFB118" />
        <rect x={75} y={45} width={12} height={50} rx={2} fill="#F5C842" transform="rotate(20 81 70)" />
      </g>
      <path d="M20 50L100 50L85 100L35 100Z" fill="#E8401C" stroke="#1a1008" strokeWidth={2} strokeLinejoin="round" />
      <path d="M60 50L60 100" stroke="#1a1008" strokeWidth={2} strokeOpacity={0.3} />
      <path d="M20 50C40 60 80 60 100 50" stroke="#1a1008" strokeWidth={2} fill="none" />
    </svg>
  );
}
