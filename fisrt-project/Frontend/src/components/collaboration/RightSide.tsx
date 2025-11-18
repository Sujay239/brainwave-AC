
import brainwave from "../../assets/brainwave-symbol.svg";
import figma from "../../assets/collaboration/figma.png";
import discord from "../../assets/collaboration/discord.png";
import framer from "../../assets/collaboration/framer.png";
import notion from "../../assets/collaboration/notion.png";
import photoshop from "../../assets/collaboration/photoshop.png";
import protopie from "../../assets/collaboration/protopie.png";
import raindrop from "../../assets/collaboration/raindrop.png";
import slack from "../../assets/collaboration/slack.png";
import curve1 from "../../assets/collaboration/curve-1.svg";
import curve2 from "../../assets/collaboration/curve-2.svg";

const RightSide = () => {
  const tools = [
    { name: "Figma", src: figma, rotate: 0 },
    { name: "Discord", src: discord, rotate: 45 },
    { name: "Framer", src: framer, rotate: 90 },
    { name: "Notion", src: notion, rotate: 135 },
    { name: "Photoshop", src: photoshop, rotate: 180 },
    { name: "Protopie", src: protopie, rotate: 225 },
    { name: "Raindrop", src: raindrop, rotate: 270 },
    { name: "Slack", src: slack, rotate: 315 },
  ];

  return (
    <div className="xl:w-152 flex flex-col justify-center">
      <div className="ml-0 md:ml-8 lg:ml-24 xl:ml-[150px] text-gray-500 w-[50%]">
        With smart automation and top-notch security, it's the perfect solution
        for teams looking to work smarter
      </div>
      <div className="relative left-1/2 flex lg:w-88 w-75 aspect-square border border-n-6 rounded-full border-gray-400 -translate-x-1/2 scale:75 md:scale-100 mt-12">
        <div className="flex w-60 aspect-square m-auto border border-gray-400 border-n-6 rounded-full">
          <div className="w-24 aspect-square m-auto p-[0.2rem] bg-conic-gradient rounded-full">
            <div className="bg-linear-to-br from-[#7CF1E0] via-[#A07CFF] to-[#FFB78B] p-[5px] rounded-full">
              <div className="flex items-center justify-center w-full h-full bg-n-8 rounded-full">
                <img
                  src={brainwave}
                  alt="profile"
                  className="w-full h-full rounded-full object-cover p-4"
                />
              </div>
            </div>
          </div>
          <ul>
            {tools.map((tool, index) => (
              <li
                className={`absolute top-0 left-1/2 h-1/2 -ml-[1.6rem] origin-bottom`}
                style={{
                  transform: `rotate(-${tool.rotate}deg)`, // keeps icon upright
                }}
                key={index}
              >
                <div
                  className={`relative flex-wrap -top-[1.6rem] flex w-[3.2rem] h-[3.2rem] bg-n-7 border border-gray-500 border-n-1/15 rounded-xl`}
                  style={{
                    transform: `rotate(${tool.rotate}deg)`, // rotates icon container
                  }}
                >
                  <img
                    src={tool.src}
                    alt={tool.name}
                    loading="lazy"
                    width="36"
                    height="28"
                    decoding="async"
                    data-nimg="1"
                    className="m-auto color-transparent"
                  />
                </div>
              </li>
            ))}
          </ul>
          <div className="hidden absolute top-1/2 right-full w-130.5 -mt-1 mr-10 pointer-events-none xl:block ">
            <img src={curve1} alt="curve" />
          </div>
          <div className="hidden absolute top-1/2 left-full w-24 -mt-1 ml-10 pointer-events-none xl:block 2xl:w-[20rem]">
            <img src={curve2} alt="curve" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSide;
