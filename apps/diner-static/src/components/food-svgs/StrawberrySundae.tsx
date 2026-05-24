import * as React from "react";

export function StrawberrySundae(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={120} height={120} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-float drop-shadow-md" {...props}>
      <ellipse cx={60} cy={105} rx={45} ry={10} fill="rgba(26,16,8,0.15)" />
      <ellipse cx={60} cy={60} rx={50} ry={50} fill="#ddeeff" stroke="#1a1008" strokeWidth={2} />
      <ellipse cx={60} cy={60} rx={45} ry={45} fill="#3a1a08" />
      <g transform="rotate(-35 85 30)">
        <path d="M85 30L85 10" stroke="#a0a0a0" strokeWidth={4} strokeLinecap="round" />
        <ellipse cx={85} cy={35} rx={8} ry={12} fill="#e0e0e0" stroke="#1a1008" strokeWidth={1} />
      </g>
      <circle cx={75} cy={55} r={28} fill="#b07acc" stroke="#1a1008" strokeWidth={2} />
      <circle cx={45} cy={60} r={32} fill="#faebd0" stroke="#1a1008" strokeWidth={2} />
      <path d="M45 35 Q60 30 65 45 Q70 60 60 65 Q50 60 55 45 Z" fill="#e03020" stroke="#1a1008" strokeWidth={2} transform="translate(-5, -25)" />
      <path d="M60 35 Q50 30 55 25 Q60 30 60 35 M60 35 Q70 30 65 25 Q60 30 60 35" fill="#5aa832" stroke="#1a1008" strokeWidth={1} transform="translate(-5, -25)" />
      <ellipse cx={60} cy={60} rx={50} ry={50} stroke="#c8e4f8" strokeWidth={4} fill="none" opacity={0.8} />
    </svg>
  );
}
