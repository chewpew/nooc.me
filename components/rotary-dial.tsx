"use client";

import classNames from "classnames";
import React, { useCallback } from "react";

interface RotaryDialOption<T extends string> {
  value: T;
  /** Displayed outside the knob */
  label: React.ReactNode;
}

interface RotaryDialProps<T extends string> {
  /** Ordered options. Distributed on an upper arc centered at 12 o'clock. */
  options: RotaryDialOption<T>[];
  /** Currently active value */
  value: T;
  /** Callback when user clicks to advance to next option */
  onChange: (value: T) => void;
  /** Optional title for accessibility */
  title?: string;
  /** Extra class names on the outer wrapper */
  className?: string;
  /** Label arrangement around the knob */
  labelLayout?: "arc" | "inline";
}

/**
 * Compute the angle (in degrees, 0 = 12-o'clock, CW positive) for the i-th
 * option out of `count` options.  Options are spread across an upper arc so
 * that two options sit at ±45° and three options sit at -45°, 0°, +45°.
 */
function optionAngle(i: number, count: number): number {
  if (count === 2) {
    // left-upper, right-upper
    return i === 0 ? -45 : 45;
  }
  if (count === 3) {
    // Keep left/right positions aligned with the 2-option dial
    return (i - 1) * 45;
  }
  // For 3+, spread symmetrically: center index at 0°
  const spread = 60; // degrees between adjacent options
  const mid = (count - 1) / 2;
  return (i - mid) * spread;
}

export default function RotaryDial<T extends string>({
  options,
  value,
  onChange,
  title,
  className,
  labelLayout = "arc",
}: RotaryDialProps<T>) {
  const currentIndex = options.findIndex((o) => o.value === value);
  const rotation = currentIndex >= 0 ? optionAngle(currentIndex, options.length) : 0;

  const cycle = useCallback(() => {
    const nextIndex = (currentIndex + 1) % options.length;
    onChange(options[nextIndex].value);
  }, [currentIndex, options, onChange]);

  // Knob outer diameter & label orbit radius (px)
  const knobSize = 36; // w-9 = 36px
  const labelRadius = 28; // distance from center to label center

  return (
    <div
      className={classNames("relative flex items-center justify-center", className)}
      style={{ width: knobSize, height: knobSize }}
    >
      {/* Labels around the knob (arc) or on a single row (inline) */}
      {labelLayout === "inline" ? (
        options.map((opt, i) => {
          const isActive = i === currentIndex;
          const rowY = -labelRadius * Math.SQRT1_2;
          const xExtent = labelRadius * Math.SQRT1_2;
          const ratio = options.length === 1 ? 0.5 : i / (options.length - 1);
          const x = -xExtent + 2 * xExtent * ratio;

          return (
            <div
              key={String(opt.value)}
              className={classNames(
                "absolute pointer-events-none select-none transition-opacity duration-200",
                "font-mono text-[8px] uppercase tracking-widest leading-none",
                isActive
                  ? "text-printer-accent dark:text-printer-accent-dark opacity-100"
                  : "text-printer-ink-light dark:text-printer-ink-dark/40 opacity-60"
              )}
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${rowY}px)`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {opt.label}
            </div>
          );
        })
      ) : (
        options.map((opt, i) => {
          const angle = optionAngle(i, options.length);
          const rad = (angle - 90) * (Math.PI / 180); // -90 because CSS 0° = right, we want 0° = top
          const x = Math.cos(rad) * labelRadius;
          const y = Math.sin(rad) * labelRadius;
          const isActive = i === currentIndex;

          return (
            <div
              key={String(opt.value)}
              className={classNames(
                "absolute pointer-events-none select-none transition-opacity duration-200",
                "font-mono text-[8px] uppercase tracking-widest leading-none",
                isActive
                  ? "text-printer-accent dark:text-printer-accent-dark opacity-100"
                  : "text-printer-ink-light dark:text-printer-ink-dark/40 opacity-60"
              )}
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {opt.label}
            </div>
          );
        })
      )}

      {/* The clickable knob */}
      <button
        onClick={cycle}
        title={title}
        className="rotary-dial-knob absolute inset-[5px] rounded-full cursor-pointer"
      >
        {/* Active indicator line (inside knob only) */}
        <div
          className="absolute inset-0 flex justify-center transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div className="w-[1.5px] h-[40%] bg-printer-accent dark:bg-printer-accent-dark rounded-full" />
        </div>
      </button>
    </div>
  );
}
