
import first from "../../assets/services/service-1.png";
import Left from "./Left";
import Generating from "../Hero/Generating";

const Top = () => {
  return (
    <div>
      <div className="lg:text-[42px] text-[32px] max-w-200 lg:mx-auto mx-5 md:text-center relative py-10 lg:py-16 xl:py-20">
        <h2 className="font-[2.5rem] leading-14">
          Generative AI made for Creators
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Brainwave unlocks the potential of AI-powered Applications
        </p>
      </div>
      <div className="relative flex">
        <div className="lg:w-[70vw] lg:h-[65vh] w-[97%] ml-[5px] h-full border-2 border-gray-800 rounded-lg overflow-hidden relative flex justify-start items-start">
          <img
            src={first}
            alt="robo"
            className="w-full h-full object-contain object-left scale-99"
          />

          <div className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 roundedleading-[3.5rem]">
              <Left />
          </div>
          <Generating />
        </div>
      </div>
    </div>
  );
};

export default Top;
