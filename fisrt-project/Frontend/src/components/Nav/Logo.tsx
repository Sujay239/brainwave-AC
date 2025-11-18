import { Link } from "react-router-dom"


const Logo = () => {
const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};

  return (
    <Link onClick={() => scrollToSection('hero')} className="flex items-center cursor-pointer" to={"/"}>
      <img src="/Brainwave.svg" alt="Logo" className="h-8 w-auto" />
    </Link>
  )
}

export default Logo
