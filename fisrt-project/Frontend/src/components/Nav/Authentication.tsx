// Authentication.tsx
import { Link } from "react-router-dom";
import GradientButton from "../nurui/gradient-button";
// import GradientButton from "@/components/nurui/gradient-button";

const Authentication = () => {
  return (
    // keep the outer container styling, but don't hide inner children with lg: utilities
    <div className="flex justify-between gap-4 items-center text-sm font-bold px-3">
      {/* visible everywhere — Navbar controls when Authentication is mounted */}
      <Link
        to="/register"
        className="mr-8 text-n-1/50 transition-transform hover:text-n-1 hover:text-white cursor-pointer hover:scale-105"
      >
        NEW ACCOUNT
      </Link>

      <Link to="/login" className="cursor-pointer">
        <GradientButton
          text="SIGN IN"
          className="hover:scale-105 transition-transform"
        />
      </Link>
    </div>
  );
};

export default Authentication;
