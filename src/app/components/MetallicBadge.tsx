"use client";

interface MetallicBadgeProps {
  tiltX: number;
  tiltY: number;
}

export default function MetallicBadge({ tiltX, tiltY }: MetallicBadgeProps) {
  // Very subtle shifts — just enough to catch the eye
  const baseAngle = 135;
  const gradAngle = baseAngle + tiltX * 8 - tiltY * 5;
  const highlightX = 40 - tiltX * 8;
  const highlightY = 35 + tiltY * 8;

  const shadowX = tiltX * 0.5;
  const shadowY = -tiltY * 0.5;

  return (
    <div
      className="absolute top-2.5 right-2.5 w-10 h-10 rounded-full flex items-center justify-center"
      style={{
        background: `
          radial-gradient(
            ellipse at ${highlightX}% ${highlightY}%,
            rgba(255,255,255,0.07) 0%,
            transparent 50%
          ),
          conic-gradient(
            from ${gradAngle}deg,
            #848488 0%,
            #8a8a8e 15%,
            #919196 30%,
            #8c8c90 45%,
            #86868a 60%,
            #8e8e93 75%,
            #8a8a8f 90%,
            #848488 100%
          )
        `,
        boxShadow: `
          inset ${shadowX}px ${shadowY}px 1.5px rgba(0,0,0,0.3),
          inset 0 0 2px 0.5px rgba(0,0,0,0.15)
        `,
        border: "1px solid rgba(70,70,75,0.4)",
      }}
    >
      <span
        className="relative z-10 font-bold select-none"
        style={{
          fontFamily: "var(--font-eb-garamond), 'EB Garamond', serif",
          fontSize: "11px",
          letterSpacing: "-0.5px",
          color: "rgba(62,62,67,0.85)",
          textShadow: [
            `0px 0.5px 0px rgba(170,170,175,0.25)`,
            `0px -0.5px 0.5px rgba(0,0,0,0.4)`,
          ].join(", "),
        }}
      >
        {"{yn}"}
      </span>
    </div>
  );
}
