import { Pencil, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import useSlideStore from "../zustandStores/useSlideStore";

export default function Sidebar({
  // slides,
  addSlide,
  setActiveSlide,
  activeSlide,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState(null);
  const [sName, setsName] = useState("")
  
  const { slides, remSlide, updateSlide } = useSlideStore();

  const handleNameEdit = (slide) => {
    setEditingSlideId(slide.id);
    setsName(slide.name);
  }

  const handleNameSave = async (slide) => {
    await updateSlide(slide.id, {name: sName});
    setEditingSlideId(null)
  }

  const handleEnterPress = (e, slide) => {
    if (e.key === "Enter") {
      handleNameSave(slide);
    }
  }

  const selectSlide = (id) => {
    const selectedSlide = slides.find((slide) => id === slide.id);
    setActiveSlide(selectedSlide);
    // console.log("slide changed to ", activeSlide.name);
  };

  const handleDelSlide = async (e, slide) => {
    console.log("Deleting slide")
    console.log(slide)
    if (e.key === "Delete") {
      await remSlide(slide.id);
    }
  }

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
          onKeyDown={(e) => handleDelSlide(e, slide)}
          className={`mb-2 p-2 bg-white border rounded-lg aspect-video relative flex items-center justify-center hover:border-[#FFBE7A] ${
            slide.id === activeSlide?.id ? "border-[#FFBE7A]" : ""
          } cursor-pointer`}
        >
          <div className="absolute top-[10%] left-[7%] flex items-center gap-2">
            <Pencil className="h-3 w-3" onClick={(e) => handleNameEdit(slide)} />
            <Trash2 className="h-3 w-3" stroke={"#e65245"} onClick={(e) => remSlide(slide.id)} />
          </div>
          {editingSlideId === slide.id ? (
            <input
              type="text"
              value={sName}
              onChange={(e) => setsName(e.target.value)}
              onBlur={() => handleNameSave(slide)} // Save on blur
              onKeyDown={(e) => handleEnterPress(e, slide)} // Save on Enter
              autoFocus
              className={`max-w-32 bg-[#FFBE7A]/10 border border-[#ccc] outline-none rounded-md px-2 py-2 text-center`}
            />
          ) : (
            <span
              className="font-medium"
              onDoubleClick={() => handleNameEdit(slide)} // Enable edit on double-click
            >
              {slide.name}
            </span>
          )}
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
