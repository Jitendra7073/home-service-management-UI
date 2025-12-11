"use client";

import confetti from "canvas-confetti";

export default function ConfettiBurst() {
  return function fireConfetti() {
    const colors = ["#FF5A5F", "#FF7A00", "#FFD400", "#00C48C", "#0086FF"];
    const particleCount = 120;

    // Left burst
    confetti({
      particleCount: particleCount / 2,
      angle: 60,
      spread: 80,
      origin: { x: 0, y: 0.6 },
      colors,
    });

    // Right burst
    confetti({
      particleCount: particleCount / 2,
      angle: 120,
      spread: 80,
      origin: { x: 1, y: 0.6 },
      colors,
    });

    // Center burst
    confetti({
      particleCount: particleCount / 2.5,
      angle: 90,
      spread: 100,
      origin: { x: 0.5, y: 0.5 },
      colors,
    });
  };
}
