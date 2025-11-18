// Navbar.tsx
import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import Logo from "./Logo";
import Items from "./Items";
import Authentication from "./Authentication";
import "./nav.css";
import UserProfile from "./UserProfile";

const Navbar: React.FC = () => {
  const navRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<HTMLDivElement | null>(null);
  const authRef = useRef<HTMLDivElement | null>(null);

  // Height used for nav and spacer — keep it in one place for consistency
  const NAV_HEIGHT = 56; // px (adjust if you change classes below)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.05 });

      // staggered entrance: logo -> items -> auth
      tl.from(logoRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
      })
        .from(
          itemsRef.current,
          { y: -30, opacity: 0, duration: 0.5, ease: "power3.out" },
          "-=0.25" // slight overlap for nicer motion
        )
        .from(
          authRef.current,
          { y: -30, opacity: 0, duration: 0.5, ease: "power3.out" },
          "-=0.25"
        );
    }, navRef);

    return () => ctx.revert();
  }, []);
const token = localStorage.getItem("token");

  return (
    <>
      {/* Spacer to prevent layout jump when nav is fixed.
          Matches nav height (h-14 ≈ 56px). */}
      <div
        style={{
          height: `${NAV_HEIGHT}px`,
        }}
        aria-hidden
      />

      {/* Fixed navbar */}
      <div
        ref={navRef}
        id="Nav"
        className="fixed top-0 left-0 right-0 z-50 h-22 flex items-center justify-between px-5"
        // visual styling: translucent bg + blur + shadow
        style={{
          background: "rgba(14, 12, 21, 0.95)",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(8px)",
          borderBottom: "1px solid gray",
          boxShadow:
            "0 6px 30px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.02) inset",
          boxSizing: "border-box",
          overflow: "visible",
        }}
      >
        <div ref={logoRef} className="flex items-center">
          <Logo />
        </div>

        <div ref={itemsRef} className="flex-1 flex justify-center">
          <Items />
        </div>

        {!token && (
          <div ref={authRef} className="flex items-center">
            <Authentication />
          </div>
        )}
        {token && (
          <div ref={authRef} className="flex items-center">
            <UserProfile />
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
