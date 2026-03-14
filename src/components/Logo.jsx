import React from "react";

function Logo({ width = "120px" }) {
  return (
    <div
      className="flex items-center gap-2 select-none"
      style={{ width }}
      aria-label="MegaBlog logo"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-tr from-blue-600 via-indigo-500 to-purple-500 shadow-sm">
        <span className="text-xs font-semibold tracking-widest text-white">
          MB
        </span>
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold tracking-wide text-gray-900">
          MegaBlog
        </span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-gray-400">
          Minimal Stories
        </span>
      </div>
    </div>
  );
}

export default Logo;
