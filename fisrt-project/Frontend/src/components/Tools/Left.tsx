// components/FeaturesCard.jsx
import React from "react";
import checkIcon from "../../assets/check.svg";

interface FeatureRowProps {
  label: string;
}

const FeatureRow: React.FC<FeatureRowProps> = ({ label }) => (
  <li className="flex items-center lg:gap-4 gap-2 py-4">
    <div
      className="lg:w-8 lg:h-8 w-4 h-4 rounded-full flex items-center justify-center"
    >
      <img src={checkIcon} alt="check icon" />
    </div>

    <div className="text-white lg:text-sm text-xs font-medium">{label}</div>
  </li>
);

const Left = () => {
  return (
    <aside className="lg:mt-16 mt-2  items-start p-8 rounded-lg max-w-[320px]">
      <h3 className="text-white lg:text-3xl text-2xl font-semibold font-sora mb-3">
        Smartest AI
      </h3>

      <p className="text-gray-400 lg:text-[16px] text-[14px] leading-7 max-w-[18rem] mb-6">
        Brainwave unlocks the potential of AI-powered applications
      </p>

      {/* thin horizontal separator */}
      <div className="border-t border-gray-800" />

      <ul className="mt-4 flex justify-center  flex-col mb-12">
        <FeatureRow label="Photo generating" />
        <div className="border-t border-gray-800" />
        <FeatureRow label="Photo enhance" />
        <div className="border-t border-gray-800" />
        <FeatureRow label="Seamless Integration" />
      </ul>
    </aside>
  );
};

export default Left;
