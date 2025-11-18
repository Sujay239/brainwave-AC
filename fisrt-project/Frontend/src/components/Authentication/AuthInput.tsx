// AuthInput.tsx
import React from "react";

type Props = {
  id: string;
  label?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string | null;
  leftIcon?: React.ReactNode;
  autoComplete?: string;
};

const AuthInput: React.FC<Props> = ({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  leftIcon,
  autoComplete,
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm text-gray-300 mb-2 font-medium"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}

        <input
          id={id}
          name={id}
          type={type}
          autoComplete={autoComplete}
          className={`w-full rounded-lg py-3 px-4 ${
            leftIcon ? "pl-12" : "pl-4"
          } pr-4 bg-[#0b0a0d]/60 text-white placeholder:text-gray-500 outline-none focus:ring focus:ring-cyan-400 focus:shadow-[0_0_30px_rgba(182,155,255,0.06)]`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}
    </div>
  );
};

export default AuthInput;
