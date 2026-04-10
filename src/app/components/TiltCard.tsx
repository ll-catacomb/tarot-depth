"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import MetallicBadge from "./MetallicBadge";

interface TiltCardProps {
  imageUrl: string;
}

export default function TiltCard({ imageUrl }: TiltCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [gyroActive, setGyroActive] = useState(false);
  const [showGyroPrompt, setShowGyroPrompt] = useState(false);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const animate = useCallback(() => {
    currentRef.current.x +=
      (targetRef.current.x - currentRef.current.x) * 0.08;
    currentRef.current.y +=
      (targetRef.current.y - currentRef.current.y) * 0.08;
    setTilt({ x: currentRef.current.x, y: currentRef.current.y });
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  const requestGyro = useCallback(async () => {
    const DOE = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };
    if (typeof DOE.requestPermission === "function") {
      try {
        const result = await DOE.requestPermission();
        if (result === "granted") {
          setGyroActive(true);
          setShowGyroPrompt(false);
        }
      } catch {
        // denied
      }
    }
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);

    // Check if we're on a touch device
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    // Try to detect if gyro permission is needed (iOS)
    const DOE = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };
    if (isTouchDevice && typeof DOE.requestPermission === "function") {
      // iOS — need to prompt user
      setShowGyroPrompt(true);
    } else if (isTouchDevice) {
      // Android or other — gyro works without permission
      setGyroActive(true);
    }

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (!gyroActive && !isTouchDevice) return;
      const gamma = (e.gamma || 0) / 45;
      const beta = ((e.beta || 0) - 45) / 45;
      targetRef.current = {
        x: Math.max(-1, Math.min(1, gamma)),
        y: Math.max(-1, Math.min(1, -beta)),
      };
    };

    // Mouse for desktop
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
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

    // Touch drag for mobile fallback
    const handleTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      touchStartRef.current = { x: t.clientX, y: t.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartRef.current || !cardRef.current) return;
      e.preventDefault();
      const t = e.touches[0];
      const rect = cardRef.current.getBoundingClientRect();
      const dx = (t.clientX - touchStartRef.current.x) / (rect.width * 0.5);
      const dy = (t.clientY - touchStartRef.current.y) / (rect.height * 0.5);
      targetRef.current = {
        x: Math.max(-1, Math.min(1, dx)),
        y: Math.max(-1, Math.min(1, -dy)),
      };
    };

    const handleTouchEnd = () => {
      touchStartRef.current = null;
      targetRef.current = { x: 0, y: 0 };
    };

    const card = cardRef.current;
    window.addEventListener("deviceorientation", handleOrientation);
    window.addEventListener("mousemove", handleMouseMove);
    card?.addEventListener("mouseleave", handleMouseLeave);
    card?.addEventListener("touchstart", handleTouchStart, { passive: true });
    card?.addEventListener("touchmove", handleTouchMove, { passive: false });
    card?.addEventListener("touchend", handleTouchEnd);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("deviceorientation", handleOrientation);
      window.removeEventListener("mousemove", handleMouseMove);
      card?.removeEventListener("mouseleave", handleMouseLeave);
      card?.removeEventListener("touchstart", handleTouchStart);
      card?.removeEventListener("touchmove", handleTouchMove);
      card?.removeEventListener("touchend", handleTouchEnd);
    };
  }, [animate, gyroActive]);

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
          touchAction: "none",
        }}
      >
        <img
          src={imageUrl}
          alt="Generated tarot card"
          className="w-72 rounded-xl"
          draggable={false}
        />
        <MetallicBadge tiltX={tilt.x} tiltY={tilt.y} />
      </div>
      {showGyroPrompt && !gyroActive && (
        <button
          onClick={requestGyro}
          className="mt-4 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white/70 hover:text-white hover:bg-white/15 transition-all cursor-pointer text-sm"
        >
          Tap to enable tilt
        </button>
      )}
    </div>
  );
}
