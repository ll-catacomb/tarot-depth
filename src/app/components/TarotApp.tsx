"use client";

import { useState, useCallback } from "react";
import TiltCard from "./TiltCard";

type Stage = "input" | "generating" | "viewer";

export default function TarotApp() {
  const [word, setWord] = useState("");
  const [stage, setStage] = useState<Stage>("input");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [orientationGranted, setOrientationGranted] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const log = useCallback((msg: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  }, []);

  const requestGyroscope = useCallback(async () => {
    const DOE = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };
    if (typeof DOE.requestPermission === "function") {
      try {
        const result = await DOE.requestPermission();
        if (result === "granted") {
          setOrientationGranted(true);
        }
      } catch {
        // Permission denied, fallback to mouse
      }
    } else {
      setOrientationGranted(true);
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    log(`Button clicked. word="${word}"`);

    if (!word.trim()) {
      setError("Type a word first");
      return;
    }

    setError(null);
    setStage("generating");
    log("Generating...");

    try {
      const genRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: word.trim() }),
      });
      log(`Response: ${genRes.status}`);

      if (!genRes.ok) {
        const data = await genRes.json();
        throw new Error(data.error || "Failed to generate tarot card");
      }

      const { imageUrl: cardUrl } = await genRes.json();
      log(`Card URL: ${cardUrl}`);
      setImageUrl(cardUrl);
      setStage("viewer");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      log(`ERROR: ${msg}`);
      setError(msg);
      setStage("input");
    }
  }, [word, log]);

  const handleReset = useCallback(() => {
    setWord("");
    setStage("input");
    setImageUrl(null);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-black">
      <h1 className="font-bold text-white mb-2 tracking-tight text-center">
        Tarot Depth
      </h1>
      <p className="text-white/50 mb-10 text-center">
        Enter a word to conjure a tarot card
      </p>

      {/* Input stage */}
      {stage === "input" && (
        <div className="flex flex-col items-center gap-4 w-full max-w-sm">
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder="Enter a word..."
            className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 outline-none focus:border-white/30 focus:ring-1 focus:ring-white/10 transition-all font-mono"
          />
          <button
            type="button"
            onClick={() => {
              log("onClick fired");
              handleGenerate();
            }}
            className="w-full py-3.5 rounded-xl border border-white/20 bg-white text-black hover:bg-white/90 font-medium transition-colors cursor-pointer"
          >
            Divine
          </button>

          {!orientationGranted && (
            <button
              onClick={requestGyroscope}
              className="text-white/40 hover:text-white/60 transition-colors mt-2"
            >
              Enable gyroscope for mobile
            </button>
          )}

          {error && (
            <p className="text-red-400 text-center mt-2">{error}</p>
          )}
        </div>
      )}

      {/* Generating stage */}
      {stage === "generating" && (
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-white/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-white animate-spin" />
          </div>
          <p className="text-white/60 animate-pulse">
            Channeling the cards for &ldquo;{word}&rdquo;...
          </p>
        </div>
      )}

      {/* Card viewer stage */}
      {stage === "viewer" && imageUrl && (
        <div className="flex flex-col items-center gap-6 w-full max-w-md">
          <TiltCard imageUrl={imageUrl} />
          <button
            onClick={handleReset}
            className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-all cursor-pointer"
          >
            Try another word
          </button>
        </div>
      )}

      {/* Debug log panel */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/20 p-3 max-h-48 overflow-y-auto">
        <div className="text-white/40 mb-1">-- debug log --</div>
        {logs.length === 0 && (
          <div className="text-white/20">No logs yet. Try clicking Divine.</div>
        )}
        {logs.map((l, i) => (
          <div key={i} className="text-green-400">{l}</div>
        ))}
      </div>
    </div>
  );
}
