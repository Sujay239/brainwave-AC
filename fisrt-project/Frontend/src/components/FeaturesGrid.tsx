import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import messageBubble from "../assets/Ask anything.svg";
import arrow from "../assets/Improve everyday.svg";
import globe from "../assets/Connect everywhere.svg";
import bolt from "../assets/Fast responding.svg";
// import image1 from "../assets/benefits/card-1.svg";
// import image2 from "../assets/benefits/card-1.svg";
// import image3 from "../assets/benefits/card-1.svg";
// import image4 from "../assets/benefits/card-1.svg";
// import image5 from "../assets/benefits/card-1.svg";
// import image6 from "../assets/benefits/card-1.svg";

gsap.registerPlugin(ScrollTrigger);

const IconImg = ({
  src,
  className,
  alt,
}: {
  src: string;
  className?: string;
  alt?: string;
}) => <img src={src} alt={alt ?? ""} className={className} />;

const IconArrowRight = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

type Feature = {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradientBorder: string;
  gradientIconBg: string;
};

const featuresData: Feature[] = [
  {
    title: "Ask anything",
    description:
      "Lets users quickly find answers to their questions without having to search through multiple sources.",
    icon: (
      <IconImg src={messageBubble} className="w-10 h-10" alt="Ask anything" />
    ),
    gradientBorder: "from-[#8B5CF6] via-[#3B82F6] to-gray-700",
    gradientIconBg: "bg-gradient-to-br from-purple-500 to-indigo-600",
  },
  {
    title: "Improve everyday",
    description:
      "The app uses natural language processing to understand user queries and provide accurate and relevant responses.",
    icon: <IconImg src={arrow} className="w-10 h-10" />,
    gradientBorder: "from-[#F59E0B] via-[#F97316] to-gray-700",
    gradientIconBg: "bg-gradient-to-br from-yellow-500 to-orange-500",
  },
  {
    title: "Connect everywhere",
    description:
      "Connect with the AI chatbot from anywhere, on any device, making it more accessible and convenient.",
    icon: <IconImg src={globe} className="w-10 h-10" />,
    gradientBorder: "from-[#10B981] via-[#34D399] to-gray-700",
    gradientIconBg: "bg-gradient-to-br from-emerald-500 to-green-500",
  },
  {
    title: "Fast responding",
    description:
      "Lets users quickly find answers to their questions without having to search through multiple sources.",
    icon: <IconImg src={bolt} className="w-10 h-10" />,
    gradientBorder: "from-[#EF4444] via-[#F97316] to-gray-700",
    gradientIconBg: "bg-gradient-to-br from-red-500 to-orange-500",
  },
  {
    title: "Ask anything",
    description:
      "Lets users quickly find answers to their questions without having to search through multiple sources.",
    icon: (
      <IconImg src={messageBubble} className="w-10 h-10" alt="Ask anything" />
    ),
    gradientBorder: "from-[#8B5CF6] via-[#3B82F6] to-gray-700",
    gradientIconBg: "bg-gradient-to-br from-purple-500 to-indigo-600",
  },
  {
    title: "Improve everyday",
    description:
      "The app uses natural language processing to understand user queries and provide accurate and relevant responses.",
    icon: <IconImg src={arrow} className="w-10 h-10" />,
    gradientBorder: "from-[#F59E0B] via-[#F97316] to-gray-700",
    gradientIconBg: "bg-gradient-to-br from-yellow-500 to-orange-500",
  },
];

const FeaturesGrid: React.FC = () => {
  const gridRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!gridRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("article", gridRef.current);

      // set initial state (so there's no flash)

      gsap.set(cards, { autoAlpha: 0, y: 40, scale: 0.98 });

      // create ScrollTrigger animation for each card with stagger
      gsap.to(cards, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: "power3.out",
        stagger: {
          each: 0.12,
          from: "start",
        },
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%", // when grid top reaches 85% of viewport
          end: "bottom 20%",
          // eachCard: trigger per element using scrub? we want simple onEnter for each card:
          // but since we're animating array with stagger, we use the following toggleActions
          toggleActions: "play none none reverse",
          // markers: true, // enable for debugging
        },
      });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-[#111111] text-gray-100 min-h-screen py-20 px-4 font-sans border-amber-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12 leading-8 md:leading-10">
          Chat Smarter, Not Harder
        </h2>

        <div
          ref={gridRef}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`}
        >
          {featuresData.map((feature, index) => (
            <div
              className={`w-full h-full`}
             
            >
              <article
                key={index}
                className={`rounded-2xl p-px m-4 bg-linear-to-r ${feature.gradientBorder} transition-transform duration-300 ease-in-out hover:-translate-y-1`}
              >
                <div className="bg-[#18181b] rounded-[15px] p-6 h-full flex flex-col">
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>

                  <p className="text-n-3 text-gray-400 mb-4 grow mt-2">
                    {feature.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between">
                    <div
                      className={`w-14 h-14 rounded-lg flex items-center justify-center mb-4 shrink-0 object-contain`}
                    >
                      {feature.icon}
                    </div>

                    <a
                      href="#"
                      className="group inline-flex items-center gap-2 text-sm text-gray-400 font-extrabold transition-colors hover:text-white"
                    >
                      EXPLORE MORE
                      <IconArrowRight className="w-4 h-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesGrid;
