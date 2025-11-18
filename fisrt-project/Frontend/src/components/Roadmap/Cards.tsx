// Cards.tsx
import React from "react";
import grid from "../../assets/grid.png";

type VoiceCardSimpleProps = {
  id: string;
  date?: string;
  progressIcon?: string;
  statusLabel?: string;
  centerImage?: string;
  heading?: string;
  description?: string;
  className?: string;
};

const Cards: React.FC<VoiceCardSimpleProps> = ({
  date = "MAY 2023",
  progressIcon,
  statusLabel = "DONE",
  centerImage,
  heading = "Voice recognition",
  description = "Enable the chatbot to understand and respond to voice commands, making it easier for users to interact with the app hands-free.",
  className = "",
  id,
}) => {
  return (
    <div
      id={id}
      aria-label="voice-card"
      className={`relative rounded-2xl border border-gray-700 overflow-visible ${className} w-full max-w-[600px] md:max-w-[760px] lg:max-w-[900px] tracking-wider shadow-[inset_0_0_100px_rgba(14,15,21,0.9)]`}
      style={{
        backgroundImage: `url(${grid})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {/* inner wrapper */}
      <div className="rounded-2xl p-0.5" style={{ background: "transparent" }}>
        <div
          className="relative rounded-[18px] overflow-hidden shadow-inner"
          style={{
            // keep subtle grid background inside the card area as well
            backgroundImage: `url(${grid})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          {/* subtle grid overlay (for depth) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)",
              backgroundSize: "100px 100px, 100px 100px",
              opacity: 0.05,
            }}
            aria-hidden
          />

          {/* Top row: date (left) and status (right) */}
          <div className="relative z-20 flex items-center justify-between px-4 py-3">
            <div className="text-xs text-[#9aa0b2] tracking-wider flex items-center gap-2">
              <span className="text-[#8AEFD2]">[</span>
              <span className="font-bold">{date}</span>
              <span className="text-[#8AEFD2]">]</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                className="inline-flex items-center gap-2 bg-white text-black text-xs px-3 py-1.5 rounded-md shadow-sm"
                aria-label="status"
              >
                {progressIcon && (
                  <img
                    src={`/icons/${progressIcon}.svg`}
                    alt=""
                    className="w-4 h-4"
                  />
                )}
                <span className="font-medium">{statusLabel}</span>
              </button>
            </div>
          </div>

          {/* Center image (responsive heights) */}
          <div className="relative z-20 flex items-start justify-center px-4 pt-4 sm:pt-6 md:pt-8">
            <div className="w-full max-w-3xl">
              <div className="rounded-xl p-4 flex items-center justify-center">
                <div className="w-full flex items-start justify-center overflow-hidden rounded-lg">
                  {centerImage ? (
                    <img
                      src={centerImage}
                      alt="center"
                      className="w-full h-56 sm:h-72 md:h-[360px] lg:h-[420px] object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-56 sm:h-72 md:h-[360px] lg:h-[420px] flex items-center justify-center text-gray-500">
                      Center image
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom heading + description */}
          <div
            className="relative z-20 px-4 sm:px-6 pb-6 pt-6 box-border bg-[#131613]"
            style={{
              boxShadow: "0 0 80px 20px rgba(15,15,15,0.35)",
            }}
          >
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3">
              {heading}
            </h2>
            <p className="text-gray-400 max-w-full md:max-w-2xl text-sm md:text-base">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;
