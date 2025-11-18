"use client";

import { useEffect, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  className?: string;
  suffix?: string;
  decimals?: number;
  delay?: number; // Delay before starting animation (ms)
}

export function AnimatedNumber({
  value,
  duration = 1000,
  className = "",
  suffix = "",
  decimals = 0,
  delay = 0,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // 🎯 OPTIMIZATION: Delay animation to avoid competing with confetti
    const delayTimer = setTimeout(() => {
      const startTime = Date.now();
      const startValue = displayValue;

      const animate = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);

        // Easing function (ease-out cubic)
        const easeOut = 1 - Math.pow(1 - progress, 3);

        const currentValue = startValue + (value - startValue) * easeOut;

        setDisplayValue(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(delayTimer);
  }, [value, duration, delay, displayValue]);

  return (
    <span className={className}>
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
}
