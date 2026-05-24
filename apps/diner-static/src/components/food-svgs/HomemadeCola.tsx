import * as React from "react";

export function HomemadeCola(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={120} height={120} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-float drop-shadow-md" {...props}>
      <ellipse cx={60} cy={105} rx={45} ry={10} fill="rgba(26,16,8,0.15)" />
      <ellipse cx={60} cy={60} rx={55} ry={55} fill="#e8d5c0" stroke="#1a1008" strokeWidth={2} />
      <ellipse cx={60} cy={60} rx={42} ry={42} fill="#ddeeff" stroke="#2c1008" strokeWidth={4} />
      <ellipse cx={60} cy={60} rx={38} ry={38} fill="#3a1a08" />
      <g stroke="#ffffff" strokeWidth={1.5} strokeOpacity={0.5}>
        <rect x={30} y={35} width={20} height={20} rx={3} fill="#b8dcf0" opacity={0.8} transform="rotate(15 40 45)" />
        <rect x={65} y={25} width={22} height={22} rx={3} fill="#c8e4f8" opacity={0.8} transform="rotate(-20 76 36)" />
        <rect x={45} y={65} width={18} height={18} rx={3} fill="#b8dcf0" opacity={0.8} transform="rotate(45 54 74)" />
      </g>
      <g>
        <path d="M70 50L105 15" stroke="#F5C842" strokeWidth={8} strokeLinecap="round" />
        <path d="M70 50L105 15" stroke="#1a1008" strokeWidth={2} strokeLinecap="round" />
      </g>
      <ellipse cx={60} cy={60} rx={40} ry={40} stroke="#ffffff" strokeWidth={2} strokeOpacity={0.2} fill="none" />
    </svg>
  );
}
