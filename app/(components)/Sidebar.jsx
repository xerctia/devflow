import React from "react";

export default function Sidebar() {
  return (
    <div className="w-48 p-2 border-r overflow-y-auto bg-gray-50">
      {[1, 2, 3, 4, 5].map((slide) => (
        <div
          key={slide}
          className="mb-2 p-2 bg-white border rounded-lg aspect-video flex items-center justify-center hover:border-[#FFBE7A] cursor-pointer"
        >
          Slide {slide}
        </div>
      ))}
    </div>
  );
}
