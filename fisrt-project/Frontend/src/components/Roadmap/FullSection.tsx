import Cards from "./Cards";
import image1 from "../../assets/roadmap/image-1.png";
import image2 from "../../assets/roadmap/image-2.png";
import image3 from "../../assets/roadmap/image-3.png";
import image4 from "../../assets/roadmap/image-4.png";
import GradientButton from "../nurui/gradient-button";
import heroBackground from "../../assets/hero/hero-background.jpg";

import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FullSection = () => {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".cards");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 20%",
          toggleActions: "play none none reverse",
        },
      });

      tl.from(cards, {
        x: (i) => (i % 2 === 0 ? -120 : 120),
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.18,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      className="flex flex-col"
      style={{
        backgroundImage: `url(${heroBackground})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Top section */}
      <div className="text-center max-w-xl mx-auto mt-20 sm:mt-32 lg:mt-52 px-4">
        <p className="font-bold bg-clip-text text-transparent bg-linear-to-r from-[#abdf80] to-[#a0f3a0]">
          [ Get started with Brainwave ]
        </p>

        <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold font-sans text-white">
          Pay Once, Use Forever
        </h1>
      </div>

      {/* CARD GRID */}
      <div
        className="flex flex-col lg:flex-row justify-center items-start gap-6 mt-10 px-4"
        ref={sectionRef}
      >
        {/* Column Left */}
        <div className="flex flex-col gap-6 w-full lg:w-auto">
          <Cards
            id="card1"
            date="MAY 2023"
            progressIcon="Done"
            statusLabel="DONE"
            centerImage={image1}
            heading="Voice recognition"
            description="Enable the chatbot to understand and respond to voice commands..."
            className="cards"
          />

          <Cards
            id="card2"
            date="MAY 2023"
            progressIcon="Done"
            statusLabel="DONE"
            centerImage={image3}
            heading="Voice recognition"
            description="Enable the chatbot to understand and respond to voice commands..."
            className="cards"
          />
        </div>

        {/* Column Right */}
        <div className="flex flex-col gap-6 w-full lg:w-auto lg:mt-40">
          <Cards
            id="card3"
            date="MAY 2023"
            progressIcon="progress"
            statusLabel="IN PROGRESS"
            centerImage={image2}
            heading="Voice recognition"
            description="Enable the chatbot to understand and respond to voice commands..."
            className="cards"
          />

          <Cards
            id="card4"
            date="MAY 2023"
            progressIcon="progress"
            statusLabel="IN PROGRESS"
            centerImage={image4}
            heading="Voice recognition"
            description="Enable the chatbot to understand and respond to voice commands..."
            className="cards"
          />
        </div>
      </div>

      {/* BUTTON */}
      <div className="my-16 flex justify-center">
        <GradientButton
          text="OUR ROADMAP"
          className="cursor-pointer hover:scale-110 font-semibold transition-transform hover:font-bold"
        />
      </div>
    </div>
  );
};

export default FullSection;
