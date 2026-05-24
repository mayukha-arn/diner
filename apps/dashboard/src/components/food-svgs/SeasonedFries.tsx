import * as React from "react";

export function SeasonedFries(props: React.SVGProps<SVGSVGElement>) {
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
      <ellipse cx={60} cy={105} rx={40} ry={8} fill="rgba(26,16,8,0.15)" />

      {/* Fries - Back Layer */}
      <g stroke="#1a1008" strokeWidth={2}>
        <rect x={25} y={30} width={12} height={60} rx={2} fill="#EFB118" transform="rotate(-15 31 60)" />
        <rect x={45} y={20} width={12} height={70} rx={2} fill="#F5C842" transform="rotate(-5 51 55)" />
        <rect x={65} y={25} width={12} height={65} rx={2} fill="#EFB118" transform="rotate(5 71 57)" />
        <rect x={85} y={35} width={12} height={55} rx={2} fill="#F5C842" transform="rotate(15 91 62)" />
        
        {/* Fries - Front Layer */}
        <rect x={35} y={40} width={12} height={55} rx={2} fill="#F5C842" transform="rotate(-25 41 67)" />
        <rect x={55} y={35} width={12} height={60} rx={2} fill="#EFB118" />
        <rect x={75} y={45} width={12} height={50} rx={2} fill="#F5C842" transform="rotate(20 81 70)" />
      </g>

      {/* Seasoning/Salt */}
      <g fill="#ffffff" opacity={0.8}>
        {[
          [35, 45], [45, 30], [55, 50], [65, 35], [75, 55], [85, 40],
          [40, 60], [50, 70], [60, 45], [70, 65], [80, 50], [90, 60]
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1.5} />
        ))}
      </g>
      <g fill="#e03020" opacity={0.6}>
        {[
          [30, 50], [50, 40], [60, 60], [70, 40], [80, 60]
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1} />
        ))}
      </g>

      {/* Carton */}
      <path
        d="M20 50L100 50L85 100L35 100Z"
        fill="#E8401C"
        stroke="#1a1008"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      
      {/* Carton Crease Line */}
      <path d="M60 50L60 100" stroke="#1a1008" strokeWidth={2} strokeOpacity={0.3} />
      
      {/* Carton Inner Lip */}
      <path d="M20 50C40 60 80 60 100 50" stroke="#1a1008" strokeWidth={2} fill="none" />

      {/* Heat Wisp */}
      <path d="M50 15Q45 5 50 -5" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" fill="none" opacity={0.6}>
        <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" />
        <animate attributeName="d" values="M50 15Q45 5 50 -5; M50 15Q55 5 50 -5; M50 15Q45 5 50 -5" dur="2s" repeatCount="indefinite" />
      </path>
      <path d="M70 10Q65 0 70 -10" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" fill="none" opacity={0.6}>
        <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2.3s" repeatCount="indefinite" delay="0.5s" />
        <animate attributeName="d" values="M70 10Q65 0 70 -10; M70 10Q75 0 70 -10; M70 10Q65 0 70 -10" dur="2.3s" repeatCount="indefinite" delay="0.5s" />
      </path>
    </svg>
  );
}
