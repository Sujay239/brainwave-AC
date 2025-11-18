
import firstImage from "../../assets/services/service-2.png";
import secondImage from "../../assets/services/service-3.png";
import slider from "../../assets/sliders-04.svg";
import recording1 from "../../assets/recording-01.svg";
import recording2 from "../../assets/recording-03.svg";
import disc from "../../assets/disc-02.svg";
import cast from "../../assets/chrome-cast.svg";

const Bottom = () => {
  const icons = [
    { src: recording1, alt: "Recording Icon 1" },
    { src: recording2, alt: "Recording Icon 2" },
    { src: disc, alt: "Disc Icon" },
    { src: cast, alt: "Cast Icon" },
    { src: slider, alt: "Slider Icon" },
  ];

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 mb-8">
      {/* grid: single column on small, two columns on lg+ */}
      <div className="lg:grid lg:grid-cols-2 flex flex-wrap gap-6 max-w-[1400px] mx-auto">
        {/* LEFT PANEL */}
        <div className="relative w-full h-[60vh] sm:h-[65vh] rounded-2xl overflow-hidden border border-gray-500">
          {/* background image */}
          <img
            src={firstImage}
            alt="robot"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* top-left speech bubble */}
          <div className="absolute z-30 top-4 left-4 sm:top-6 sm:left-6 lg:top-6 lg:left-8">
            <div
              className="max-w-70 py-3 px-4 rounded-t-xl rounded-bl-xl text-sm sm:text-base text-white"
              style={{
                background: "rgba(0,0,0,0.85)",
                boxShadow: "0 8px 28px rgba(2,6,23,0.6)",
              }}
            >
              Hey Brainwave, enhance this photo
            </div>
          </div>

          {/* bottom-left text */}
          <div
            className="absolute z-20 left-4 bottom-4 sm:left-6 sm:bottom-6 lg:left-10 lg:bottom-10"
            style={{
              backgroundColor: "rgba(0,0,0,0.12)",
              padding: "1rem",
              borderRadius: "0.5rem",
            }}
          >
            <h3 className="text-2xl sm:text-3xl lg:text-4xl text-white font-semibold leading-tight mb-2">
              Image Generation
            </h3>
            <p className="max-w-xs sm:max-w-md md:max-w-xl text-gray-300 text-base sm:text-lg leading-snug">
              AI image generation to create unique, high-quality images with
              just a few clicks.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="relative w-full h-[60vh] sm:h-[65vh] rounded-xl overflow-hidden border border-gray-500">
          {/* overlay: header + icons */}
          <div className="absolute z-40 inset-x-4 top-4 sm:inset-x-6 lg:inset-x-6">
            <div className="flex flex-col  lg:items-start lg:justify-between gap-4 lg:gap-0">
              {/* heading + paragraph */}
              <div className="max-w-full lg:max-w-[55%]">
                <h3 className="text-xl sm:text-2xl lg:text-3xl text-white font-semibold leading-tight mb-2">
                  Video Generation
                </h3>
                <p className="text-gray-300 text-sm md:text-base max-w-full lg:max-w-88 mb-2.5">
                  The world's most powerful AI photo and video art generation
                  engine. What will you create?
                </p>
              </div>

              {/* icons row */}
              <div className="flex items-center gap-25 flex-wrap justify-between lg:justify-end mt-2 lg:mt-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-[#2f2f38b0] shadow-sm">
                  <img
                    src={icons[0].src}
                    alt={icons[0].alt}
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-[#2f2f38b0] shadow-sm">
                  <img
                    src={icons[1].src}
                    alt={icons[1].alt}
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                </div>

                <div
                  className="rounded-2xl p-[3px] w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #8B5CF6, #3B82F6, #10B981)",
                  }}
                >
                  <div className="w-full h-full rounded-xl bg-[#111] flex items-center justify-center">
                    <img
                      src={icons[2].src}
                      alt={icons[2].alt}
                      className="w-5 h-5 sm:w-10 sm:h-10"
                    />
                  </div>
                </div>

                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-[#2f2f38b0] shadow-sm">
                  <img
                    src={icons[3].src}
                    alt={icons[3].alt}
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-[#2f2f38b0] shadow-sm">
                  <img
                    src={icons[4].src}
                    alt={icons[4].alt}
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                </div>
              </div>
            </div>

            {/* floating bubble (responsive placement) */}
            <div className="absolute left-3 lg:left-6 top-36 sm:top-44 lg:top-60 z-30">
              <div className="rounded-3xl rounded-br-none bg-[#2e2b399d] text-white px-6 sm:px-8 py-3 sm:py-4 shadow-lg text-sm sm:text-base font-medium">
                <div>Video generated!</div>
                <div className="mt-2 text-[10px] text-gray-400 uppercase tracking-wider">
                  Just now
                </div>
              </div>
            </div>
          </div>

          {/* main right image (under overlays) */}
          <img
            src={secondImage}
            alt="Second"
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 lg:left-0 lg:translate-x-0 w-[96%] lg:w-[97%] h-[60%] lg:h-[77%] object-contain mx-3 lg:mx-0 rounded-3xl bg-[#0c0b0b] z-10"
            style={{ padding: "0 2rem" }}
          />

          {/* bottom-left play button + progress line */}
          <div className="absolute bottom-4 left-4 z-30 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>

            <div className="hidden sm:flex items-center absolute bottom-8 left-0 w-[80%] z-40 ml-16">
              <div className="w-[70%] h-[3px] bg-purple-600"></div>
              <span className="w-[20%] h-[3px] bg-white"></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Bottom;
