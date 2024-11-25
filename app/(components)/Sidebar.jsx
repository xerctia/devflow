import { Plus } from "lucide-react";
import React from "react";
import useSlideStore from "../zustandStores/useSlideStore";

export default function Sidebar({
  // slides,
  addSlide,
  setActiveSlide,
  activeSlide,
}) {
  const { slides, newSlide } = useSlideStore();

  const selectSlide = (id) => {
    const selectedSlide = slides.find((slide) => id === slide.id);
    setActiveSlide(selectedSlide);
    // console.log("slide changed to ", activeSlide.name);
  };

  if (!slides || !activeSlide) {
    return <div>Loading...</div>; // Optional loading indicator
  }

  return (
    <div className="w-48 p-2 border-r overflow-y-auto bg-gray-50">
      {slides.map((slide) => (
        <div
          key={slide.id}
          onClick={() => {
            selectSlide(slide.id);
          }}
          className={`mb-2 p-2 bg-white border rounded-lg aspect-video flex items-center justify-center hover:border-[#FFBE7A] ${
            slide.id === activeSlide?.id ? "border-[#FFBE7A]" : ""
          } cursor-pointer`}
        >
          {slide.name}
        </div>
      ))}

      <div
        onClick={addSlide}
        className="mb-2 p-2 bg-white border rounded-lg aspect-video flex flex-col items-center justify-center gap-3 hover:border-[#FFBE7A] cursor-pointer"
      >
        <Plus stroke="#FFBE7A" strokeWidth={2} className="w-8 h-8" />
        <p>New Slide</p>
      </div>
    </div>
  );
}
