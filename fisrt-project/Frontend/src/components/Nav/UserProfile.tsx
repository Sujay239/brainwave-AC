import type React from "react";
import GradientButton from "../nurui/gradient-button";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();
  const nameChar = localStorage.getItem("name")?.charAt(0).toUpperCase();
  const color = `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`;

  async function handleLogout(
    event: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> {
    event.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        console.log("Error in log out");
        return;
      }

      localStorage.removeItem("token");
      localStorage.removeItem("name");

      navigate("/login");
    } catch {
      console.log("Error occuring in logout please try again");
    }
  }

  return (
    <div className="flex flex-wrap justify-between gap-8 items-center">
      <div
        className={`w-10 h-10 text-white font-semibold flex justify-center items-center text-[20px] rounded-full`}
        style={{
          backgroundColor: color,
        }}
      >
        {nameChar}
      </div>
      <button onClick={handleLogout}>
        <GradientButton
          text="Log Out"
          className="font-bold hover:scale-115 transition-transform hover:font-extrabold"
        />
      </button>
    </div>
  );
};

export default UserProfile;
