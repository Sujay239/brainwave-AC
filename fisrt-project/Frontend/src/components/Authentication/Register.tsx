// RegisterForm.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthInput from "./AuthInput";
import GradientButton from "../nurui/gradient-button";

type Props = {
  onSubmit?: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void> | void;
};

const RegisterForm: React.FC<Props> = ({ onSubmit }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!name.trim()) return "Full name is required";
    if (!email || !/\S+@\S+\.\S+/.test(email)) return "Enter a valid email";
    if (!password || password.length < 6)
      return "Password must be at least 6 characters";
    if (password !== confirmPass) return "Passwords do not match";
    if (!agree) return "You must agree to the Terms";
    return null;
  };

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setLoading(true);

    try {
      const payload = { name: name.trim(), email: email.trim(), password };

      if (onSubmit) await onSubmit(payload);

      const res = await fetch("http://localhost:5000/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: 'include' 
      });
      let body: any = null;
      try {
        body = await res.json();
      } catch (_) {
        // ignore parse error - body stays null
      }

      if (!res.ok) {
        const msg =
          body?.error ||
          body?.message ||
          res.statusText ||
          `Request failed (${res.status})`;
        setError(msg);
        return; 
      }

      console.log("Create-user response:", body);
      navigate("/login");
    } catch (err: unknown) {
      // network-level errors (CORS, connection refused, etc.)
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen  bg-[#0b0a0d] flex items-center justify-center font-sora px-4 py-6">
      {/* Right form card */}
      <div className="w-full flex items-center justify-center">
        <div className="w-full max-w-sm">
          {/* gradient border wrapper */}
          <div className="rounded-3xl p-0.5 bg-linear-to-r from-[#8EF6E7] via-[#B69BFF] to-[#FFB8E6]">
            {/* inner card */}
            <div className="bg-[#0e0c15] h-full rounded-2xl p-6 shadow-[inset_0_0_50px_rgba(0,0,0,0.65)]">
              <form onSubmit={handle} className="space-y-4 w-full">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Create an account
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Start using Brainwave today.
                  </p>
                </div>

                <AuthInput
                  id="name"
                  label="Full name"
                  value={name}
                  onChange={setName}
                  placeholder="Your full name"
                />

                <AuthInput
                  id="email"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="you@company.com"
                  autoComplete="email"
                />

                <div className="grid grid-cols-1 gap-4">
                  <div className="relative">
                    <label
                      htmlFor="password"
                      className="block text-sm text-gray-300 mb-2 font-medium"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter a strong password"
                        className="w-full rounded-lg py-3 px-4 pr-12 bg-[#0b0a0d]/60 text-white placeholder:text-gray-500 focus:ring focus:ring-cyan-400 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <AuthInput
                    id="confirm"
                    label="Confirm password"
                    type={showPassword ? "text" : "password"}
                    value={confirmPass}
                    onChange={setConfirmPass}
                    placeholder="Repeat your password"
                  />
                </div>

                <div className="flex items-start gap-3">
                  <label className="inline-flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                      className="w-4 h-4 rounded bg-[#0b0a0d] accent-amber-400"
                    />
                    <span className="text-sm">
                      I agree to the{" "}
                      <a
                        href="/terms"
                        className="text-amber-300 hover:underline"
                      >
                        Terms
                      </a>{" "}
                      and{" "}
                      <a
                        href="/privacy"
                        className="text-amber-300 hover:underline"
                      >
                        Privacy
                      </a>
                    </span>
                  </label>
                </div>

                {error && <div className="text-sm text-rose-400">{error}</div>}

                <div className="flex items-center justify-center mt-2">
                  <GradientButton
                    text={loading ? "Creating Account..." : "Create Account"}
                    className="font-mono font-bold text-xs tracking-[2px] hover:font-extrabold uppercase w-full hover:scale-[1.2] transition-transform"
                  />
                </div>

                <div className="text-center text-sm text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-amber-300 font-semibold hover:underline"
                  >
                    Sign in
                  </Link>
                </div>

                {/* small divider + social (optional) */}
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex-1 h-px bg-white/6" />
                  <div className="text-xs text-gray-500 uppercase">
                    or sign up with
                  </div>
                  <div className="flex-1 h-px bg-white/6" />
                </div>

                <div className="flex gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() => alert("Continue with Google")}
                    className="flex-1 py-2 rounded-lg bg-white/6 text-white flex items-center justify-center gap-3 cursor-pointer  hover:bg-green-600 hover:scale-110 transition-transform"
                  >
                    {/* simple icon placeholder */}
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M21 12.11c0-.7-.06-1.38-.18-2.03H12v3.84h5.44c-.24 1.29-1 2.39-2.14 3.13v2.6h3.46c2.03-1.87 3.22-4.64 3.22-7.54z"
                        fill="white"
                      />
                      <path
                        d="M12 22c2.7 0 4.96-.9 6.64-2.42l-3.46-2.6c-.95.64-2.16 1.02-3.18 1.02-2.45 0-4.53-1.65-5.27-3.86H3.9v2.42C5.63 19.9 8.58 22 12 22z"
                        fill="white"
                      />
                    </svg>
                    Google
                  </button>

                  <button
                    type="button"
                    onClick={() => alert("Continue with GitHub")}
                    className="flex-1 py-2 rounded-lg bg-white/6 text-white flex items-center justify-center gap-3 cursor-pointer  hover:bg-green-600 hover:scale-110 transition-transform"
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 .5a11.5 11.5 0 00-3.62 22.42c.57.1.78-.25.78-.56 0-.28-.01-1.02-.01-2-3.18.69-3.85-1.53-3.85-1.53-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.25 3.33.96.1-.74.4-1.25.73-1.54-2.54-.29-5.21-1.27-5.21-5.66 0-1.25.45-2.27 1.17-3.07-.12-.29-.51-1.47.11-3.07 0 0 .96-.31 3.14 1.17a10.86 10.86 0 015.72 0c2.18-1.48 3.14-1.17 3.14-1.17.62 1.6.23 2.78.11 3.07.73.8 1.17 1.82 1.17 3.07 0 4.41-2.67 5.37-5.21 5.66.41.35.78 1.02.78 2.06 0 1.49-.01 2.69-.01 3.05 0 .31.21.67.79.56A11.5 11.5 0 0012 .5z"
                      />
                    </svg>
                    GitHub
                  </button>
                </div>
              </form>
            </div>
          </div>
          {/* end card */}
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
