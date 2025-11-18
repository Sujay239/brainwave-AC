

const Generating = () => {
   const Spinner = (
      <svg
        className="w-4 h-4 animate-spin"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          strokeOpacity="0.15"
        />
        <path
          d="M22 12a10 10 0 0 0-10-10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    );
  return (
    <div className="absolute left-1/2 transform -translate-x-1/2 lg:bottom-8 bottom-2 z-30 lg:w-70 w-50">
      <div className="flex items-center gap-3 bg-[#0b0a0d]/80 px-6 py-3 rounded-full shadow-[0_12px_30px_rgba(0,0,0,0.6)] backdrop-blur">
        <span className="text-violet-300">{Spinner}</span>
        <span className="text-white lg:text-xl text-xs font-medium">
          AI is generating...
        </span>
      </div>
    </div>
  );
}

export default Generating
