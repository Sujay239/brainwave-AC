// Hero.tsx
import React from "react";
import curve from "../../assets/hero/curve.png"
import heroBackground from "../../assets/hero/hero-background.jpg"
import RobotShowcase from "./Mid";

const Top: React.FC = () => {
  return (
    <section
      className="relative text-white overflow-hidden h-full w-full"
      aria-label="Brainwave hero"
    >
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover filter saturate-[1.03] brightness-[0.92] -z-10"
        style={{
          backgroundImage: `url(${heroBackground})`
        }}
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 pointer-events-none -z-5"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 30%, rgba(29, 15, 15, 0) 0%, rgba(55, 41, 119, 0) 25%), radial-gradient(circle at 50% 30%, rgba(255,255,255,0.01) 0%, rgba(255,255,255,0) 40%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(14,12,21,0.38) 0%, rgba(14,12,21,0.75) 60%, rgba(14,12,21,0.95) 100%)",
          }}
        />
      </div>
      <div
        className="absolute right-[12%] bottom-[10%] w-4 h-4 rounded-full z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 10%, rgba(148,76,255,0.15) 40%, rgba(0,0,0,0) 70%)",
          boxShadow: "0 8px 30px rgba(148,76,255,0.12)",
        }}
        aria-hidden="true"
      />
      <div className="relative z-20 max-w-[1100px] mx-auto text-center px-6 py-16 md:py-24 lg:py-28 flex flex-wrap flex-col justify-center items-center">
        <h1 className="mx-auto text-white font-bold leading-[0.98]  text-[32px] md:text-[54px] lg:text-[60px] max-w-248 tracking-wide">
          Explore the Possibilities of&nbsp;
          <span className="whitespace-nowrap">
            AI&nbsp;Chatting
          </span>&nbsp;with{" "}
          <span className="inline-block relative">
            <span className="relative inline-block">Brainwave</span>
            {curve && (
              <img
                src={curve}
                alt=""
                className="absolute left-0 top-full w-full -mt-2 pointer-events-none mix-blend-screen opacity-95"
                width={624}
                height={28}
              />
            )}
          </span>
        </h1>

        <p className="mx-auto text-[15px] md:text-[16px] lg:text-[24px] text-white/90 max-w-[780px] mt-10 mb-10 md:mb-12">
          Unleash the power of AI with Brainwave. Upgrade your productivity with
          Brainwave, the open AI chat app.
        </p>

        <button
          className="inline-block lg:w-[20%] w-[50%] bg-white text-[#0b0a0d] rounded-[14px] px-8 py-2.5 font-mono font-bold  text-[12px] tracking-[3px] uppercase shadow-[0_6px_20px_rgba(0,0,0,0.35)] transition-transform hover:-translate-y-1 cursor-pointer"
          aria-label="Get started"
        >
          GET STARTED
        </button>
        <RobotShowcase />
      </div>
    </section>
  );
};

export default Top;
