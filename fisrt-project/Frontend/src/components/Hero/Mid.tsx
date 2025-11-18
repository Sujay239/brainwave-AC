
import React from "react";
import robotImg from "../../assets/hero/robot.jpg"; 
import thumbImg from "../../assets/notification/image-1.png"; 
import thumbImg2 from "../../assets/notification/image-2.png"; 
import thumbImg3 from "../../assets/notification/image-3.png"; 
import thumbImg4 from "../../assets/notification/image-4.png"; 
import home from "../../assets/home-smile.svg"
import search from "../../assets/search-md.svg"
import plus from "../../assets/plus-square.svg"
import file from "../../assets/file-02.svg"
import Generating from "./Generating";

const Icon = {
  Home: <img src={home} alt="Home" className="w-5 h-5" />,
  File: <img src={file} alt="File" className="w-5 h-5" />,
  Search: <img src={search} alt="Search" className="w-5 h-5" />,
  Plus: <img src={plus} alt="Plus" className="w-5 h-5" />,
 
};

const RobotShowcase: React.FC = () => {
  return (
    <section className="relative w-full h-full px-6 py-12 md:py-20 lg:py-24">
      {/* container centering */}
      <div className="max-w-[1180px] mx-auto relative">
        {/* layered bottom sheets (yellow, gray, pink) */}
        <div className="absolute left-1/2 -translate-x-1/2 w-[88%] h-[220px] bottom-3 md:bottom-6 lg:bottom-8 pointer-events-none">
          <div className="absolute inset-0 transform translate-y-6 md:translate-y-8 lg:translate-y-10">
            <div
              className="w-full h-full rounded-2xl bg-amber-300/80 shadow-xl"
              style={{ filter: "blur(0px)" }}
            />
          </div>
          <div className="absolute inset-0 transform translate-y-3 md:translate-y-4 lg:translate-y-6">
            <div className="w-full h-full rounded-2xl bg-slate-700/80 shadow-2xl" />
          </div>
          <div className="absolute inset-0">
            <div className="w-full h-full rounded-2xl bg-pink-300/80 shadow-2xl" />
          </div>
        </div>

        {/* gradient stroke wrapper */}
        <div className="relative mx-auto w-full max-w-[1100px] rounded-2xl p-0.5 bg-linear-to-r from-[#8EF6E7] via-[#B69BFF] to-[#FFB8E6]">
          {/* inner dark card */}
          <div className="relative bg-[#0e0c15] rounded-[14px] overflow-hidden">
            {/* top rounded border highlight (thin) */}
            <div
              className="absolute inset-0 rounded-xl pointer-events-none"
              aria-hidden
            />

            {/* main image area */}
            <div className="relative">
              <img
                src={robotImg}
                alt="Robot"
                className="w-full h-[420px] md:h-[460px] lg:h-[520px] object-cover object-top"
                style={{ display: "block" }}
              />

              {/* left floating toolbar */}
              <div className="absolute left-6 top-1/3 transform -translate-y-1/2 z-30 mt-30">
                <div className="bg-[#0b0a0d]/70 backdrop-blur-sm rounded-xl p-2 shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex flex-row gap-2">
                  <button className="w-12 h-12 rounded-lg bg-[#ffffff0d] flex items-center justify-center text-white/90 hover:bg-white/10 transition">
                    {Icon.Home}
                  </button>
                  <button className="w-12 h-12 rounded-lg bg-[#ffffff0d] flex items-center justify-center text-white/90 hover:bg-white/10 transition">
                    {Icon.File}
                  </button>
                  <button className="w-12 h-12 rounded-lg bg-[#ffffff0d] flex items-center justify-center text-white/90 hover:bg-white/10 transition">
                    {Icon.Search}
                  </button>
                  <button className="w-12 h-12 rounded-lg bg-[#ffffff0d] flex items-center justify-center text-white/90 hover:bg-white/10 transition">
                    {Icon.Plus}
                  </button>
                </div>
              </div>

              {/* right floating notification */}
              <div className="absolute right-6 top-28 z-30 mt-30">
                <div className="flex items-center gap-3 bg-[#0b0a0d]/70 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
                  <img
                    src={thumbImg}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">
                        Code generation
                      </p>
                      <p className="text-xs text-white/60">1m ago</p>
                    </div>
                    <div className="flex -space-x-1 mt-1">
                      <img
                        src={thumbImg4}
                        alt=""
                        className="w-5 h-5 rounded-full ring-1 ring-[#0e0c15]"
                      />
                      <img
                        src={thumbImg2}
                        alt=""
                        className="w-5 h-5 rounded-full ring-1 ring-[#0e0c15]"
                      />
                      <img
                        src={thumbImg3}
                        alt=""
                        className="w-5 h-5 rounded-full ring-1 ring-[#0e0c15]"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Generating />
            </div>

            {/* footer shadow / bottom card edge */}
            <div className="absolute left-0 right-0 bottom-0 h-5 bg-linear-to-b from-transparent to-black/30 pointer-events-none" />
          </div>
        </div>

        {/* subtle outer rings (decoration) */}
        <div className="pointer-events-none absolute inset-0 -z-20">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 40%, rgba(255,255,255,0.01), transparent 20%), radial-gradient(circle at 50% 40%, rgba(255,255,255,0.005), transparent 40%)",
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default RobotShowcase;
