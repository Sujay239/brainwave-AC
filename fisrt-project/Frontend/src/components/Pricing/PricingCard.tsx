import React from "react";
import check from "../../assets/check.svg";

type PricingCardProps = {
  title: string;
  titleColor?: string; // Tailwind class string
  description: string;
  price: string | number;
  buttonText: string;
  features: string[];
};

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  titleColor = "text-[#EAB308]", // default yellow like screenshot
  description,
  price,
  buttonText,
  features,
}) => {
  return (
    <div
      className={`bg-[#0f0e13] border border-[#33303a] text-white p-6 md:p-8 rounded-3xl w-full max-w-md h-[98%]`}
    >
      {/* Title */}
      <h3
        className={`text-3xl font-semibold mb-1 ${titleColor} tracking-wider `}
      >
        {title}
      </h3>
      <p className="text-gray-400 text-sm mb-8">{description}</p>

      {/* Price */}
      <div className="flex items-center gap-1 mb-6">
        <span className="text-5xl font-semibold flex items-center">
          $<span className="text-[88px] font-bold tracking-wide">{price}</span>
        </span>
      </div>

      {/* Button */}
      <button className="w-[80%] py-3 ml-10 bg-white text-black rounded-xl font-mono font-bold text-xs tracking-[3px] hover:opacity-90 transition cursor-pointer hover:font-bold hover:scale-110">
        {buttonText.toUpperCase()}
      </button>

      {/* Divider */}
      <div className="my-6 border-b border-white/10"></div>

      {/* Features */}

      <div className="flex flex-col">
        {features.map((feature, idx) => (
          <div key={idx} className="gap-1">
            {/* Check icon */}
            <div className="flex justify-center items-center flex-row gap-2 font-semibold">
              <div className="w-20 h-20 flex items-center justify-center rounded-full text-base">
                <img src={check} alt="Check icon" />
              </div>
              <p className="text-gray-300 text-sm leading-snug">{feature}</p>
            </div>
            {idx !== features.length - 1 && (
              <div className="my-6 border-b w-full border-white/10"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingCard;
