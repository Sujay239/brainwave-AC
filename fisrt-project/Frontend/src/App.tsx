
import "./App.css";
import Hero from "./components/Hero/Hero";
import FeaturesGrid from "./components/FeaturesGrid";
import Collaboration from "./components/collaboration/Collaboration";
import ToolSection from "./components/Tools/ToolSection";
import PricingSection from "./components/Pricing/PricingSection";
import FullSection from "./components/Roadmap/FullSection";
import Footer from "./components/Footer/Footer";
import Navb from "./components/Nav/Navb";


const App = () => {
  return (
    <>
      <div className="overflow-auto h-full w-full">
        <Navb />
        <section id="hero">
          <Hero />
        </section>
        <hr className="border-gray-500" />
        <section id="features">
          <FeaturesGrid />
        </section>
        <hr className="border-gray-500" />
        <section id="collaboration">
          <Collaboration />
        </section>
        <hr className="border-gray-500" />
        <section id="tools">
          <ToolSection />
        </section>
        <hr className="border-gray-500" />
        <section id="pricing">
          <PricingSection />
        </section>
        <section id="roadmap">
          <FullSection />
        </section>
        <hr className="border-gray-500" />
        <Footer />
      </div>
    </>
  );
};

export default App;
