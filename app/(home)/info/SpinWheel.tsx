"use client";

import React from "react";
import { GiftItem } from "./types";
import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

const generateColors = (count: number) => {
  const hueStep = 360 / count;
  return Array.from({ length: count }, (_, i) => {
    const hue = i * hueStep;
    return `hsl(${hue}, 75%, 65%)`;
  });
};

interface SpinWheelProps {
  rotation: number;
  winner: GiftItem | null;
  giftList: GiftItem[];
  isSpinning: boolean;
  hasSpun: boolean;
}

const SpinWheel: React.FC<SpinWheelProps> = React.memo(
  ({ rotation, winner, giftList, isSpinning, hasSpun }) => {
    const wheelRadius = 45; // Reduced wheel size
    const colors = generateColors(giftList.length);
    const itemRadius = Math.max(4, 15 - giftList.length * 0.5); // Adjusted item size
    const padding = 6;

    const shouldBlur = hasSpun && !winner;

    return (
      <div className="relative w-full max-w-sm mx-auto mb-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-full overflow-hidden bg-white/5 backdrop-blur-sm p-2"
          style={{
            boxShadow: "0 0 40px 15px rgba(255, 255, 255, 0.2)",
          }}
        >
          <svg
            className={`w-full h-auto ${isSpinning ? "animate-spin" : ""}`}
            viewBox="-50 -50 100 100"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning
                ? "none"
                : "transform 5s cubic-bezier(0.25, 0.1, 0.25, 1.2)",
            }}
          >
            <defs>
              <filter id="shadow">
                <feDropShadow
                  dx="0"
                  dy="0"
                  stdDeviation="1.5"
                  floodOpacity="0.4"
                />
              </filter>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {shouldBlur && (
                <filter id="blur">
                  <feGaussianBlur stdDeviation="1.2" />
                </filter>
              )}
            </defs>

            {/* Wheel segments */}
            {giftList.map((gift, index) => {
              const startAngle = (index / giftList.length) * 2 * Math.PI;
              const endAngle = ((index + 1) / giftList.length) * 2 * Math.PI;
              const x1 = Math.sin(startAngle) * wheelRadius;
              const y1 = -Math.cos(startAngle) * wheelRadius;
              const x2 = Math.sin(endAngle) * wheelRadius;
              const y2 = -Math.cos(endAngle) * wheelRadius;
              const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";

              return (
                <path
                  key={index}
                  d={`M 0 0 L ${x1} ${y1} A ${wheelRadius} ${wheelRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={colors[index]}
                  stroke="rgba(255, 255, 255, 0.6)"
                  strokeWidth="0.3"
                  filter="url(#shadow)"
                  style={{
                    transition: "all 0.3s ease",
                  }}
                />
              );
            })}

            {/* Gift images */}
            {giftList.map((gift, index) => {
              const angle = ((index + 0.5) / giftList.length) * 2 * Math.PI;
              const x = (wheelRadius - itemRadius - padding) * Math.sin(angle);
              const y = -(wheelRadius - itemRadius - padding) * Math.cos(angle);
              const isWinner = winner?.id === gift.id;

              return (
                <g
                  key={index}
                  transform={`translate(${x}, ${y})`}
                  filter={shouldBlur ? "url(#blur)" : "url(#glow)"}
                >
                  <circle
                    r={itemRadius}
                    fill="#fff"
                    style={{
                      opacity: winner && !isWinner ? 0.3 : 1,
                      transition: "all 0.5s ease",
                    }}
                  />
                  <image
                    href={gift.image}
                    x={-itemRadius * 0.85}
                    y={-itemRadius * 0.85}
                    width={itemRadius * 1.7}
                    height={itemRadius * 1.7}
                    style={{
                      opacity: winner && !isWinner ? 0.3 : 1,
                      transition: "all 0.5s ease",
                    }}
                  />
                </g>
              );
            })}

            {/* Center dot */}
            <circle
              r="2"
              fill="#fff"
              filter="url(#glow)"
              style={{
                opacity: 0.8,
              }}
            />
          </svg>
        </motion.div>

        {/* Arrow indicator */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="absolute top-2 left-[45%] -translate-x-[50%]"
        >
          <div className="bg-white rounded-full p-2 shadow-lg">
            <ArrowDown
              className={`text-[#ff6666] ${
                isSpinning ? "animate-bounce" : "animate-pulse"
              }`}
              size={20}
            />
          </div>
        </motion.div>
      </div>
    );
  }
);

SpinWheel.displayName = "SpinWheel";

export default SpinWheel;
