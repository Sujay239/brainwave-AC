import React from "react";

interface ItemsProps {
  onItemClick?: () => void; // <-- NEW
}


const Items: React.FC<ItemsProps> = ({ onItemClick }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    if (onItemClick) onItemClick(); // <-- CLOSE NAV ON MOBILE
  };

  return (
    // mobile: stack; desktop: use your existing lg:flex and lg:h-12
    <div className="flex flex-col lg:flex-row justify-center tracking-widest text-xs font-bolder font-mono lg:h-12 items-start lg:items-center w-full">
      <a
        onClick={() => scrollToSection("features")}
        className="w-full lg:w-auto text-center lg:text-left  relative font-code text-2xl uppercase text-n-1 hover:text-color-1 px-6 py-3 md:py-4 lg:py-6 md:md:py-8 lg:-mr-0.25px lg:text-xs lg:font-semibold lg:text-n-1/50 lg:leading-5 lg:hover:text-n-1 xl:px-12 hover:text-n-1 hover:text-white lg:block cursor-pointer hover:scale-125 transition-transform
         items-center justify-center flex flex-col gap-2"
      >
        FEAUTURES
        <div className="w-[20%] h-px bg-gray-500 lg:hidden"></div>
      </a>

      <a
        onClick={() => scrollToSection("collaboration")}
        className="w-full lg:w-auto text-center lg:text-left  relative font-code text-2xl uppercase text-n-1 hover:text-color-1 px-6 py-3 md:py-4 lg:py-6 md:md:py-8 lg:-mr-0.25px lg:text-xs lg:font-semibold lg:text-n-1/50 lg:leading-5 lg:hover:text-n-1 xl:px-12 hover:text-n-1 hover:text-white lg:block cursor-pointer hover:scale-125 transition-transform items-center justify-center flex flex-col gap-2"
      >
        SERVICES
        <div className="w-[20%] h-px bg-gray-500 lg:hidden"></div>
      </a>

      <a
        onClick={() => scrollToSection("tools")}
        className="w-full lg:w-auto text-center lg:text-left  relative font-code text-2xl uppercase text-n-1 hover:text-color-1 px-6 py-3 md:py-4 lg:py-6 md:md:py-8 lg:-mr-0.25px lg:text-xs lg:font-semibold lg:text-n-1/50 lg:leading-5 lg:hover:text-n-1 xl:px-12 hover:text-n-1 hover:text-white lg:block cursor-pointer hover:scale-125 transition-transform items-center justify-center flex flex-col gap-2"
      >
        TOOLS
        <div className="w-[20%] h-px bg-gray-500  lg:hidden"></div>
      </a>

      <a
        onClick={() => scrollToSection("pricing")}
        className="w-full lg:w-auto text-center lg:text-left  relative font-code text-2xl uppercase text-n-1 hover:text-color-1 px-6 py-3 md:py-4 lg:py-6 md:md:py-8 lg:-mr-0.25px lg:text-xs lg:font-semibold lg:text-n-1/50 lg:leading-5 lg:hover:text-n-1 xl:px-12 hover:text-n-1 hover:text-white lg:block cursor-pointer hover:scale-125 transition-transform items-center justify-center flex flex-col gap-2"
      >
        PRICING
        <div className="w-[20%] h-px bg-gray-500  lg:hidden"></div>
      </a>

      <a
        onClick={() => scrollToSection("roadmap")}
        className="w-full lg:w-auto text-center lg:text-left  relative font-code text-2xl uppercase text-n-1 hover:text-color-1 px-6 py-3 md:py-4 lg:py-6 md:md:py-8 lg:-mr-0.25px lg:text-xs lg:font-semibold lg:text-n-1/50 lg:leading-5 lg:hover:text-n-1 xl:px-12 hover:text-n-1 hover:text-white lg:block cursor-pointer hover:scale-125 transition-transform items-center justify-center flex flex-col gap-2"
      >
        ROADMAPS
        <div className="w-[20%] h-px bg-gray-500 lg:hidden"></div>
      </a>
    </div>
  );
};

export default Items;
