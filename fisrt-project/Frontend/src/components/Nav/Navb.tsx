// Navbar.tsx
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Logo from "./Logo";
import Items from "./Items";
import Authentication from "./Authentication";
import UserProfile from "./UserProfile";
import gradient from "../../assets/gradient.png";

const Navb: React.FC = () => {
  const navRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<HTMLDivElement | null>(null);
  const authRef = useRef<HTMLDivElement | null>(null);
  const itemsRefMobile = useRef<HTMLDivElement | null>(null);
  const authRefMobile = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);

  // Height used for nav and spacer — keep it in one place for consistency
  const NAV_HEIGHT = 56; // px (adjust if you change classes below)

  useEffect(() => {
    // lock body scroll while mobile menu open
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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

  const nav = document.getElementById("navButton");

  nav?.addEventListener("click", () => {
    gsap.to("#mobileNav", {
      x: 100,
      duration: 0.5,
      delay: 0.5,
      ease: "power3.inOut",
    });
  });

  return (
    <>
      {/* Spacer to prevent layout jump when nav is fixed.
          Matches nav height (h-14 ≈ 56px). */}
      <div
        style={{
          height: `${NAV_HEIGHT}px`,
          overflow: "hidden",
        }}
        aria-hidden
      />

      {/* Fixed navbar */}
      <div
        ref={navRef}
        id="Nav"
        className="fixed top-0 left-0 right-0 z-50 h-22 flex items-center justify-between px-5 text-gray-500"
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

        <div ref={itemsRef} className="flex-1  justify-center lg:block hidden">
          <Items />
        </div>

        {!token && (
          <div ref={authRef} className=" items-center lg:block hidden">
            <Authentication />
          </div>
        )}
        {token && (
          <div ref={authRef} className="flex items-center">
            <UserProfile />
          </div>
        )}

        <div className="flex items-center justify-center gap-3 lg:hidden">
          {/* Hamburger */}
          <button
            id="navButton"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="text-white text-2xl"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>

        <div
          className={`lg:hidden fixed top-14 left-0 right-0 bottom-0 z-40 
        transition-all duration-600 ease-in-out transform 
        ${
          !open
            ? "translate-x-0 opacity-0 pointer-events-none"
            : "-translate-x-5 opacity-100 pointer-events-auto"
        }`}
        >
          {open && (
            <div
              className="lg:hidden fixed top-14 left-0 right-0 bottom-0 z-50 "
              style={{
                backgroundImage: `url${gradient}`,
              }}
              role="dialog"
              aria-modal="true"
              id="mobileNav"
            >
              <div className=" bg-[#111] flex flex-col justify-center items-center gap-22 h-screen w-full px-6 py-6 shadow-xl overflow-auto transition-transform">
                <div ref={itemsRefMobile} className="w-full">
                  <Items onItemClick={() => setOpen(false)} />{" "}
                </div>

                <div ref={authRefMobile} className="w-full mt-4">
                  {token ? <UserProfile /> : <Authentication />}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navb;
