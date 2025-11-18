import  { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PricingCard from "./PricingCard";
import globe from "../../assets/4-small.png";
import bg from "../../assets/pricing-bg.png";

gsap.registerPlugin(ScrollTrigger);

const PricingSection = () => {
  const cardsRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".pricing-card"); // class selector

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 80%", // when container hits 80% viewport height
          end: "top 40%",
          toggleActions: "play none none reverse",
          // markers: true,
        },
      });

      tl.from(cards, {
        x: (index) => (index % 2 === 0 ? -120 : 120), // left, right, left
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.18,
      });
    }, cardsRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      className="w-full h-full flex flex-col justify-center items-center font-sora py-20 px-6 md:px-20 text-white font-space"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Top Section */}
      <div className="text-center max-w-xl mx-auto">
        <img src={globe} alt="globe" className="mx-auto mb-4 w-[14vw]" />
        <div className="mt-16">
          <p className="font-bold bg-clip-text text-transparent bg-linear-to-r from-[#abdf80] via-[#5ec08a] to-[#a053a0]">
            [ Get started with Brainwave ]
          </p>

          <h1 className="mt-4 text-5xl font-semibold font-sans">
            Pay Once, Use Forever
          </h1>
        </div>
      </div>

      {/* Bottom Section */}
      <div ref={cardsRef} className="mt-16 flex justify-center items-center gap-5 flex-wrap">
        <div className="pricing-card">
          <PricingCard
            title="Basic"
            description="AI chatbot, personalized recommendations"
            price={0}
            buttonText="Get Started"
            features={[
              "An AI chatbot that can understand your queries",
              "Personalized recommendations based on your preferences",
              "Ability to explore the app and its features without any cost",
            ]}
          />
        </div>

        <div className="pricing-card">
          <PricingCard
            titleColor="text-purple-400"
            title="Premium"
            description="Advanced AI chatbot, priority support, analytics dashboard"
            price={9.99}
            buttonText="Get Started"
            features={[
              "An advanced AI chatbot that can understand complex queries",
              "An analytics dashboard to track your conversations",
              "Priority support to solve issues quickly",
            ]}
          />
        </div>

        <div className="pricing-card">
          <PricingCard
            titleColor="text-red-400"
            title="Enterprise"
            description="Custom AI chatbot, advanced analytics, dedicated account"
            price={"Scale"}
            buttonText="Contact Us"
            features={[
              "An AI chatbot that can understand your queries",
              "Personalized recommendations based on your preferences",
              "Ability to explore the app and its features without any cost",
            ]}
          />
        </div>
      </div>
      <div className="font-bold font-sans mt-16 underline tracking-wider cursor-pointer hover:scale-110 transition">SEE THE FULL DETAILS</div>
    </div>
  );
};

export default PricingSection;
