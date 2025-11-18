import React from "react";
import LeftSide from "./LeftSide";
import RightSide from "./RightSide";

const Collaboration: React.FC = () => {
  return (
    <section
      className="w-full bg-[rgb(14,12,21)] py-16 md:py-24 lg:py-32"
      aria-label="Collaboration section"
    >
      {/* container: centers content and limits width on large screens */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* layout: column on small, row on md+ */}
        <div className="flex flex-col md:flex-row items-center md:items-stretch justify-between gap-8 md:gap-12 lg:gap-20">
          {/* Left side (becomes full width on mobile) */}
          <div className="w-full md:w-1/2 lg:w-5/12 shrink-0">
            <LeftSide />
          </div>

          {/* Right side (full width on mobile) */}
          <div className="w-full md:w-1/2 lg:w-6/12">
            <RightSide />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Collaboration;
