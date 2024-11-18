import React from "react";

export default function Ruler() {
  return (
    <div className="h-6 border-b bg-gray-50 flex">
      <div className="w-8 border-r"></div>
      <div className="flex-1 relative">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 border-l text-[10px] text-gray-500 flex items-center"
            style={{ left: `${i * 10}%` }}
          >
            {i}
          </div>
        ))}
      </div>
    </div>
  );
}
