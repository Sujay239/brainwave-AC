import React from "react";
import { Link } from "react-router-dom";
import GradientButton from "./nurui/gradient-button";

const ProfileSection = async () => {
  const res = await fetch("http://localhost:5000/mydata", {
    method: "GET",
    headers: { "content-type": "application/json" },
    credentials: "include",
  });
  let data = null;
  if (res.ok) {
    data = await res.json();
  } else {
    data = { error: "Failed to retrieve your data" };
  }



  return (
    <div className="bg-[#111] w-full h-screen flex flex-col gap-12 items-center justify-center">
      <div className="bg-amber-300 p-10 rounded-xl shadow-xl">
        
      </div>
      <Link to="/">
        <GradientButton
          text="Go to home"
          className="font-semibold hover:font-extrabold hover:scale-110 transition-transform"
        />
      </Link>
    </div>
  );
};

export default ProfileSection;
