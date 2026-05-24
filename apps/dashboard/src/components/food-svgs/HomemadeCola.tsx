import * as React from "react";

export function HomemadeCola(props: React.SVGProps<SVGSVGElement>) {
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

      {/* Coaster */}
      <ellipse cx={60} cy={60} rx={55} ry={55} fill="#e8d5c0" stroke="#1a1008" strokeWidth={2} />
      <ellipse cx={60} cy={60} rx={48} ry={48} stroke="#1a1008" strokeWidth={1} strokeOpacity={0.2} strokeDasharray="4 4" fill="none" />

      {/* Glass Rim Base */}
      <ellipse cx={60} cy={60} rx={42} ry={42} fill="#ddeeff" stroke="#2c1008" strokeWidth={4} />

      {/* Cola Surface */}
      <ellipse cx={60} cy={60} rx={38} ry={38} fill="#3a1a08" />

      {/* Ice Cubes */}
      <g stroke="#ffffff" strokeWidth={1.5} strokeOpacity={0.5}>
        <rect x={30} y={35} width={20} height={20} rx={3} fill="#b8dcf0" opacity={0.8} transform="rotate(15 40 45)" />
        <rect x={65} y={25} width={22} height={22} rx={3} fill="#c8e4f8" opacity={0.8} transform="rotate(-20 76 36)" />
        <rect x={45} y={65} width={18} height={18} rx={3} fill="#b8dcf0" opacity={0.8} transform="rotate(45 54 74)" />
      </g>

      {/* Liquid Sheen */}
      <ellipse cx={45} cy={45} rx={18} ry={8} transform="rotate(-40 45 45)" fill="#ffffff" fillOpacity={0.15} />

      {/* Animated Bubbles */}
      <g fill="#ffffff" opacity={0.4}>
        <circle cx={35} cy={65} r={2}>
          <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx={75} cy={60} r={1.5}>
          <animate attributeName="r" values="1.5;3.5;1.5" dur="1.5s" repeatCount="indefinite" delay="0.5s" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="1.5s" repeatCount="indefinite" delay="0.5s" />
        </circle>
        <circle cx={55} cy={35} r={2.5}>
          <animate attributeName="r" values="2.5;5;2.5" dur="2.5s" repeatCount="indefinite" delay="1s" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite" delay="1s" />
        </circle>
        <circle cx={65} cy={80} r={1.5}>
          <animate attributeName="r" values="1.5;3;1.5" dur="1.8s" repeatCount="indefinite" delay="0.2s" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="1.8s" repeatCount="indefinite" delay="0.2s" />
        </circle>
      </g>

      {/* Static Bubble Ring */}
      <g fill="none" stroke="#ffffff" strokeOpacity={0.3} strokeWidth={1}>
        <circle cx={38} cy={38} r={2} />
        <circle cx={80} cy={45} r={3} />
        <circle cx={70} cy={75} r={2} />
        <circle cx={40} cy={80} r={2.5} />
        <circle cx={28} cy={55} r={1.5} />
      </g>

      {/* Straw from Upper Right */}
      <g>
        <path d="M70 50L105 15" stroke="#F5C842" strokeWidth={8} strokeLinecap="round" />
        <path d="M70 50L105 15" stroke="#1a1008" strokeWidth={2} strokeLinecap="round" />
        <path d="M75 52L108 17" stroke="#ffffff" strokeWidth={1.5} opacity={0.5} strokeLinecap="round" />
        {/* Straw Cross Section */}
        <ellipse cx={105} cy={15} rx={4} ry={2} transform="rotate(45 105 15)" fill="#1a1008" />
      </g>

      {/* Glass Inner Reflection */}
      <ellipse cx={60} cy={60} rx={40} ry={40} stroke="#ffffff" strokeWidth={2} strokeOpacity={0.2} fill="none" />
    </svg>
  );
}
