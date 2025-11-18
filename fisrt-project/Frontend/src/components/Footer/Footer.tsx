
import discord from "../../assets/socials/discord.svg";
import insta from "../../assets/socials/instagram.svg";
import facebook from "../../assets/socials/facebook.svg";
import twitter from "../../assets/socials/twitter.svg";
import tele from "../../assets/socials/telegram.svg";

const Footer = () => {

    const socialIcons = [
        {src: discord, alt: "Discord"},
        {src: insta, alt: "Instagram"},
        {src: facebook, alt: "Facebook"},
        {src: twitter, alt: "Twitter"},
        {src: tele, alt: "Telegram"},
    ];

    const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-wrap w-full lg:h-[15vh] justify-between items-center  bg-[#131613]">
      <div className="text-gray-600 lg:m-20 m-10">
        <p className="caption text-n-4 lg:block font-bold">
          &copy; {currentYear} All rights reserved
        </p>
      </div>

      <div className="text-gray-600 lg:m-20 m-10 flex flex-wrap justify-center items-center gap-12">
        {socialIcons.map((icon, index) => (
          <div
            key={index}
            className="  bg-gray-700 rounded-full w-10 h-10 flex justify-center items-center p-1 cursor-pointer hover:bg-gray-900  transition-transform ease-in-out"
          >
            <img
              src={icon.src}
              alt={icon.alt}
              className=" inline-block  hover:scale-125 transition-transform ease-in-out"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Footer
