// Navbar.tsx
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Logo from "./Logo";
import Items from "./Items";
import Authentication from "./Authentication";
import UserProfile from "./UserProfile";
import gradient from "../../assets/gradient.png";

const NAV_HEIGHT = 56; // keep consistent

const Navb: React.FC = () => {
  const navRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<HTMLDivElement | null>(null);
  const authRef = useRef<HTMLDivElement | null>(null);
  const itemsRefMobile = useRef<HTMLDivElement | null>(null);
  const authRefMobile = useRef<HTMLDivElement | null>(null);
  const mobileNavRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);
  const [haveToken, setHaveToken] = useState<boolean | null>(null); // null => unknown/loading

  // lock body scroll while mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // initial entrance animation for nav sections
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.05 });
      tl.from(logoRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
      })
        .from(
          itemsRef.current,
          { y: -30, opacity: 0, duration: 0.5, ease: "power3.out" },
          "-=0.25"
        )
        .from(
          authRef.current,
          { y: -30, opacity: 0, duration: 0.5, ease: "power3.out" },
          "-=0.25"
        );
    }, navRef);

    return () => ctx.revert();
  }, []);

  // Fetch to check token (HttpOnly cookie will be sent automatically).
  // We do this on mount. It's safe to re-check on focus/interval if needed.
  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/me", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // IMPORTANT: sends httpOnly cookie
        });

        if (cancelled) return;

        setHaveToken(res.ok);
      } catch (err) {
        if (!cancelled) setHaveToken(false);
        // optionally log error
      }
    };

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  // Animate mobile menu in/out using GSAP whenever `open` changes
  useEffect(() => {
    const el = mobileNavRef.current;
    if (!el) return;

    // ensure starting position
    gsap.killTweensOf(el);
    if (open) {
      gsap.set(el, { x: "100%" });
      gsap.to(el, { x: "0%", duration: 0.45, ease: "power3.out" });
    } else {
      gsap.to(el, {
        x: "100%",
        duration: 0.35,
        ease: "power3.in",
      });
    }
  }, [open]);

  return (
    <>
      {/* Spacer */}
      <div
        style={{
          height: `${NAV_HEIGHT}px`,
          overflow: "hidden",
        }}
        aria-hidden
      />

      <div
        ref={navRef}
        id="Nav"
        className="fixed top-0 left-0 right-0 z-50 h-22 flex items-center gap-8 justify-between px-5 text-gray-500"
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

        <div ref={itemsRef} className="flex-1 justify-center lg:block hidden">
          <Items />
        </div>

        <div ref={itemsRef} className="flex-1 justify-center lg:hidden block font-bold font-mono text-xl text-amber-50">
            Welcome, {localStorage.getItem("name")} 👋
        </div>

        <div ref={authRef} className="items-center lg:block hidden">
          {haveToken === null ? null : haveToken ? (
            <UserProfile />
          ) : (
            <Authentication />
          )}
        </div>

        <div className="flex items-center justify-center gap-3 lg:hidden">
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

        {/* Mobile overlay container (keeps presence for GSAP animation) */}
        <div
          className={`lg:hidden fixed top-14 left-0 right-0 bottom-0 z-40 pointer-events-none`}
          aria-hidden={!open}
        >
          {/* We always render this div so GSAP can target it. Pointer-events enabled only when open */}
          <div
            ref={mobileNavRef}
            className={`lg:hidden fixed top-14 left-0 right-0 bottom-0 z-50 pointer-events-auto`}
            style={{
              backgroundImage: `url(${gradient})`,
              transform: "translateX(100%)", // initial off-screen
            }}
            role="dialog"
            aria-modal="true"
            id="mobileNav"
          >
            {/* content panel */}
            <div className="bg-[#111] flex flex-col justify-center items-center gap-22 h-screen w-full px-6 py-6 shadow-xl overflow-auto transition-transform">
              <div ref={itemsRefMobile} className="w-full">
                <Items onItemClick={() => setOpen(false)} />
              </div>

              <div ref={authRefMobile} className="w-full mt-4">
                {haveToken ? <UserProfile /> : <Authentication />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navb;
