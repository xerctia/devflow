"use client";

import React, { useState } from "react";

export default function MainArea({
  elements,
  onMouseDown,
  onTextChange,
  addElement,
}) {
  const [isTextEditing, setIsTextEditing] = useState(false);

  const handleMouseDown = (e, id) => {
    if (isTextEditing) {
      e.stopPropagation(); // Prevent dragging if editing text
    } else {
      onMouseDown(e, id); // Allow dragging if not editing text
    }
  };

  const handleTextAreaFocus = () => {
    setIsTextEditing(true); // Set text editing state when textarea is focused
  };

  const handleTextAreaBlur = () => {
    setIsTextEditing(false); // Set text editing state when textarea loses focus
  };

  return (
    <div className="flex-1 p-8 overflow-auto bg-gray-100">
      <div className="aspect-[16/9] bg-white shadow-lg mx-auto max-w-4xl relative">
        {elements.map((el) => (
          <div
            key={el.id}
            style={{
              position: "absolute",
              left: el.x,
              top: el.y,
              width: el.type === "triangle" ? 0 : el.width, // Triangle doesn't use width directly
              height: el.type === "triangle" ? 0 : el.height, // Triangle doesn't use height directly
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border:
                el.type === "text"
                  ? "none"
                  : el.type === "triangle"
                  ? "none"
                  : "1px solid #FFBE7A",
              borderRadius: el.type === "circle" ? "50%" : "4px",
              //   borderLeft:
              //     el.type === "triangle"
              //       ? `${el.width / 2}px solid transparent`
              //       : "none",
              //   borderRight:
              //     el.type === "triangle"
              //       ? `${el.width / 2}px solid transparent`
              //       : "none",
              //   borderBottom:
              //     el.type === "triangle" ? `${el.height}px solid orange` : "none",

              backgroundColor:
                el.type !== "text" && el.type !== "triangle"
                  ? "#FFBE7A"
                  : "transparent",
              cursor: "move",
            }}
            onMouseDown={(e) => onMouseDown(e, el.id)}
          >
            {el.type === "text" ? (
              <div
                style={{
                  position: "relative", // Make the textarea overlay correctly
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* Invisible border area for dragging */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: "1px solid transparent", // Invisible border for dragging
                    pointerEvents: "none", // Make sure this area doesn't block text interaction
                    zIndex: 1, // Set the invisible drag border behind the textarea
                  }}
                />
                <textarea
                  value={el.text}
                  onChange={(e) => onTextChange(el.id, e.target.value)}
                  onFocus={handleTextAreaFocus}
                  onBlur={handleTextAreaBlur}
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    resize: "none",
                    textAlign: "center",
                    background: "transparent",
                    position: "relative", // Keep the textarea above the invisible border area
                    zIndex: 2, // Ensure textarea is above the drag area
                  }}
                />
              </div>
            ) : el.type === "triangle" ? (
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderRadius: "6px",
                  borderLeft: `${el.width / 2}px solid transparent`,
                  borderRight: `${el.width / 2}px solid transparent`,
                  borderBottom: `${el.height}px solid #FFBE7A`,
                }}
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
