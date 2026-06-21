"use client";

import { useState, useEffect } from "react";
import { timeUntil } from "@/lib/utils";

interface CountdownTimerProps {
  endDate: Date | string;
  compact?: boolean;
}

export function CountdownTimer({ endDate, compact = false }: CountdownTimerProps) {
  const [time, setTime] = useState(timeUntil(endDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(timeUntil(endDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  const units = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Mins", value: time.minutes },
    { label: "Secs", value: time.seconds },
  ];

  if (compact) {
    return (
      <span className="text-sm font-mono font-bold text-[#c9a84c] font-[family-name:var(--font-inter)]">
        {String(time.days).padStart(2, "0")}d{" "}
        {String(time.hours).padStart(2, "0")}h{" "}
        {String(time.minutes).padStart(2, "0")}m{" "}
        {String(time.seconds).padStart(2, "0")}s
      </span>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)] leading-none tabular-nums">
              {String(unit.value).padStart(2, "0")}
            </div>
            <div className="text-[10px] text-[#7a8fa8] uppercase tracking-widest mt-1 font-[family-name:var(--font-inter)]">
              {unit.label}
            </div>
          </div>
          {i < units.length - 1 && (
            <span className="text-[#c9a84c] text-xl font-bold leading-none mb-3">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
