import checkbox from "../../assets/check.svg";
import GradientButton from "../nurui/gradient-button";
const LeftSide = () => {
  return (
    <div className="max-w-100">
      <h2 className="font-sora  text-white text-4xl md:text-5xl font-semibold leading-tight md:leading-snug">
        AI Chat App for Seamless Collaboration
      </h2>

      <div className="mt-8 space-y-4">
        <div className="flex justify-start items-center flex-wrap">
          <img
            src={checkbox}
            alt="checkbox"
            className="inline-block w-6 h-6 mr-3"
          />
          <h4 className="flex items-center text-lg text-gray-300 font-medium">
            Seamless Integration
          </h4>
        </div>
        <span className=" text-gray-500">
          With smart automation and top-notch 
          security, it's the perfect
          solution for teams looking to work smarter
        </span>
        <div className="flex flex-wrap justify-start items-center mt-8">
          <img
            src={checkbox}
            alt="checkbox"
            className="inline-block w-6 h-6 mr-3"
          />
          <h4 className="flex flex-wrap items-center text-lg text-gray-300 font-medium">
            Smart Automation
          </h4>
        </div>

        <div className="flex flex-wrap justify-start items-center">
          <img
            src={checkbox}
            alt="checkbox"
            className="inline-block w-6 h-6 mr-3"
          />
          <h4 className="flex flex-wrap items-center text-lg text-gray-300 font-medium">
            Top-notch Security
          </h4>
        </div>
      </div>
      <div>
        <GradientButton
          text="TRY IT NOW"
          className="text-sm font-sora mt-[120px] mb-16 font-bold hover:scale-105 transition-transform"
        />
      </div>
    </div>
  );
};

export default LeftSide;
