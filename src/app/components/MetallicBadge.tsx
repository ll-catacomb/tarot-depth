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
            circle at ${highlightX}% ${highlightY}%,
            rgba(255,255,255,0.18) 0%,
            rgba(200,200,210,0.06) 30%,
            transparent 60%
          ),
          conic-gradient(
            from ${gradAngle}deg,
            #78787f 0%,
            #93939a 10%,
            #a8a8b0 18%,
            #8e8e96 28%,
            #7a7a82 38%,
            #96969e 48%,
            #a5a5ad 55%,
            #8a8a92 65%,
            #7c7c84 75%,
            #94949c 85%,
            #a0a0a8 92%,
            #78787f 100%
          )
        `,
        boxShadow: `
          inset ${shadowX}px ${shadowY}px 2px rgba(0,0,0,0.4),
          inset ${-shadowX * 0.3}px ${-shadowY * 0.3}px 1.5px rgba(255,255,255,0.1),
          inset 0 0 3px 1px rgba(0,0,0,0.2)
        `,
        border: "1px solid rgba(60,60,70,0.5)",
      }}
    >
      <span
        className="relative z-10 font-bold select-none"
        style={{
          fontFamily: "var(--font-eb-garamond), 'EB Garamond', serif",
          fontSize: "11px",
          letterSpacing: "-0.5px",
          color: "rgba(55,55,62,0.9)",
          textShadow: [
            `${0.3 - tiltX * 0.1}px ${0.5 + tiltY * 0.1}px 0.5px rgba(200,200,210,0.35)`,
            `${-0.2 + tiltX * 0.08}px ${-0.4 - tiltY * 0.08}px 0.5px rgba(0,0,0,0.5)`,
            `0px -0.3px 1px rgba(0,0,0,0.3)`,
            `0px 0.6px 0px rgba(255,255,255,0.12)`,
          ].join(", "),
        }}
      >
        {"{yn}"}
      </span>
    </div>
  );
}
