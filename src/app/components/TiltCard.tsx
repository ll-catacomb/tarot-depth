"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import MetallicBadge from "./MetallicBadge";

interface TiltCardProps {
  imageUrl: string;
}

export default function TiltCard({ imageUrl }: TiltCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const animate = useCallback(() => {
    currentRef.current.x +=
      (targetRef.current.x - currentRef.current.x) * 0.08;
    currentRef.current.y +=
      (targetRef.current.y - currentRef.current.y) * 0.08;
    setTilt({ x: currentRef.current.x, y: currentRef.current.y });
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);

    const handleOrientation = (e: DeviceOrientationEvent) => {
      const gamma = (e.gamma || 0) / 45;
      const beta = ((e.beta || 0) - 45) / 45;
      targetRef.current = {
        x: Math.max(-1, Math.min(1, gamma)),
        y: Math.max(-1, Math.min(1, -beta)),
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -((e.clientY / window.innerHeight) * 2 - 1);
        targetRef.current = { x, y };
        return;
      }
      const rect = cardRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRef.current = {
        x: Math.max(-1, Math.min(1, x)),
        y: Math.max(-1, Math.min(1, y)),
      };
    };

    const handleMouseLeave = () => {
      targetRef.current = { x: 0, y: 0 };
    };

    const card = cardRef.current;
    window.addEventListener("deviceorientation", handleOrientation);
    window.addEventListener("mousemove", handleMouseMove);
    card?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("deviceorientation", handleOrientation);
      window.removeEventListener("mousemove", handleMouseMove);
      card?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [animate]);

  const rotateY = tilt.x * 15;
  const rotateX = -tilt.y * 15;

  return (
    <div style={{ perspective: "800px" }}>
      <div
        ref={cardRef}
        className="relative inline-block"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.05s linear",
          willChange: "transform",
        }}
      >
        <img
          src={imageUrl}
          alt="Generated tarot card"
          className="w-72 rounded-xl"
        />
        <MetallicBadge tiltX={tilt.x} tiltY={tilt.y} />
      </div>
    </div>
  );
}
