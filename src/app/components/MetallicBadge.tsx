"use client";

interface MetallicBadgeProps {
  tiltX: number;
  tiltY: number;
}

export default function MetallicBadge({ tiltX, tiltY }: MetallicBadgeProps) {
  // Invert tilt so the highlight moves opposite to card rotation
  // (simulates a fixed overhead light source)
  const gradAngle = Math.atan2(-tiltY, -tiltX) * (180 / Math.PI) + 180;
  const highlightX = 50 - tiltX * 35;
  const highlightY = 50 + tiltY * 35;

  // Inset shadow shifts with tilt to reinforce the "pressed in" look
  const shadowX = tiltX * 2;
  const shadowY = -tiltY * 2;

  return (
    <div
      className="absolute top-2.5 right-2.5 w-10 h-10 rounded-full flex items-center justify-center"
      style={{
        background: `
          radial-gradient(
            circle at ${highlightX}% ${highlightY}%,
            rgba(255,255,255,0.35) 0%,
            rgba(180,180,190,0.15) 25%,
            transparent 55%
          ),
          conic-gradient(
            from ${gradAngle}deg,
            #6a6a72 0%,
            #a0a0aa 12%,
            #c0c0c8 18%,
            #8a8a92 25%,
            #5a5a62 35%,
            #9a9aa2 45%,
            #b5b5be 50%,
            #7a7a82 58%,
            #5c5c64 65%,
            #a5a5ae 75%,
            #bfbfc8 82%,
            #7a7a85 90%,
            #6a6a72 100%
          )
        `,
        boxShadow: `
          inset ${shadowX}px ${shadowY}px 3px rgba(0,0,0,0.5),
          inset ${-shadowX * 0.5}px ${-shadowY * 0.5}px 2px rgba(255,255,255,0.15),
          inset 0 0 4px 1px rgba(0,0,0,0.25)
        `,
        border: "1px solid rgba(60,60,70,0.6)",
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
            // Light catch on the bottom edge of the engraved cut
            `${0.3 - tiltX * 0.4}px ${0.6 + tiltY * 0.4}px 0.5px rgba(200,200,210,0.45)`,
            // Dark shadow on the top inside wall of the cut
            `${-0.3 + tiltX * 0.3}px ${-0.5 - tiltY * 0.3}px 0.5px rgba(0,0,0,0.6)`,
            // Deeper inner shadow for more depth
            `${-0.1 + tiltX * 0.2}px ${-0.3 - tiltY * 0.2}px 1px rgba(0,0,0,0.35)`,
            // Subtle outer light rim
            `${0.5 - tiltX * 0.5}px ${0.8 + tiltY * 0.5}px 0px rgba(255,255,255,0.2)`,
          ].join(", "),
        }}
      >
        {"{yn}"}
      </span>
    </div>
  );
}
