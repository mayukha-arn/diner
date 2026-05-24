import * as React from "react";

export function StrawberrySundae(props: React.SVGProps<SVGSVGElement>) {
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

      {/* Bowl Rim Bottom */}
      <ellipse cx={60} cy={60} rx={50} ry={50} fill="#ddeeff" stroke="#1a1008" strokeWidth={2} />
      
      {/* Dark Chocolate Base (inside bowl) */}
      <ellipse cx={60} cy={60} rx={45} ry={45} fill="#3a1a08" />

      {/* Silver Spoon */}
      <g transform="rotate(-35 85 30)">
        <path d="M85 30L85 10" stroke="#a0a0a0" strokeWidth={4} strokeLinecap="round" />
        <ellipse cx={85} cy={35} rx={8} ry={12} fill="#e0e0e0" stroke="#1a1008" strokeWidth={1} />
        <ellipse cx={83} cy={33} rx={3} ry={6} fill="#ffffff" fillOpacity={0.6} />
      </g>

      {/* Berry Scoop */}
      <circle cx={75} cy={55} r={28} fill="#b07acc" stroke="#1a1008" strokeWidth={2} />
      <ellipse cx={68} cy={48} rx={8} ry={5} transform="rotate(-30 68 48)" fill="#ffffff" fillOpacity={0.4} />

      {/* Vanilla Scoop */}
      <circle cx={45} cy={60} r={32} fill="#faebd0" stroke="#1a1008" strokeWidth={2} />
      <ellipse cx={35} cy={50} rx={10} ry={6} transform="rotate(-40 35 50)" fill="#ffffff" fillOpacity={0.6} />

      {/* Chocolate Drizzle */}
      <path 
        d="M45 35 Q55 45 40 55 T50 70 M30 65 Q45 80 60 75" 
        stroke="#3a1a08" 
        strokeWidth={4} 
        strokeLinecap="round" 
        fill="none" 
      />
      <path 
        d="M80 30 Q70 40 85 50 T75 65 M95 55 Q85 70 70 75" 
        stroke="#3a1a08" 
        strokeWidth={3} 
        strokeLinecap="round" 
        fill="none" 
      />

      {/* Strawberry Center Top */}
      <path 
        d="M55 45 Q60 30 65 45 Q70 60 60 65 Q50 60 55 45 Z" 
        fill="#e03020" 
        stroke="#1a1008" 
        strokeWidth={2} 
        transform="translate(-5, -25)"
      />
      
      {/* Strawberry Seeds */}
      <g fill="#F5C842" transform="translate(-5, -25)">
        <circle cx={60} cy={42} r={1} />
        <circle cx={57} cy={48} r={1} />
        <circle cx={63} cy={48} r={1} />
        <circle cx={58} cy={55} r={1} />
        <circle cx={62} cy={55} r={1} />
        <circle cx={60} cy={60} r={1} />
      </g>

      {/* Green Leaf */}
      <path 
        d="M60 35 Q50 30 55 25 Q60 30 60 35 M60 35 Q70 30 65 25 Q60 30 60 35" 
        fill="#5aa832" 
        stroke="#1a1008" 
        strokeWidth={1}
        transform="translate(-5, -25)"
      />

      {/* Bowl Rim Top Layer */}
      <ellipse cx={60} cy={60} rx={50} ry={50} stroke="#c8e4f8" strokeWidth={4} fill="none" opacity={0.8} />
    </svg>
  );
}
