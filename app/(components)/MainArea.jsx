"use client";

import Head from "next/head";
import React, { useCallback, useEffect, useState } from "react";
import useSlideStore from "../zustandStores/useSlideStore";
import useElementStore from "../zustandStores/useElementStore";

const DynamicFontLoader = ({ font }) => {
  useEffect(() => {
    if (!font) return;

    // Dynamically add the font link to the head
    const fontUrl = `https://fonts.googleapis.com/css2?family=${font.replace(
      / /g,
      "+"
    )}:wght@400;600&display=swap`;

    const linkElement = document.createElement("link");
    linkElement.href = fontUrl;
    linkElement.rel = "stylesheet";
    linkElement.id = `font-${font.replace(/ /g, "-")}`;

    // Check if the font is already added
    if (!document.getElementById(linkElement.id)) {
      document.head.appendChild(linkElement);
    }

    return () => {
      // Clean up font link if necessary
      if (document.getElementById(linkElement.id)) {
        document.head.removeChild(linkElement);
      }
    };
  }, [font]);

  return null; // No UI output needed
};

export default function MainArea({
  // elements,
  // setElements,
  // slides,
  activeSlide,
  color,
  font,
  setSelected,
  onMouseDown,
  onTextChange,
  addElement,
}) {
  const [resizingElement, setResizingElement] = useState(null);
  const [resizeDirection, setResizeDirection] = useState(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);

  const { slides } = useSlideStore();
  const {elements, newElement, updateElement, remElement} = useElementStore();

  const onResizeStart = useCallback((e, id, direction) => {
    e.stopPropagation();
    setResizingElement(id);
    setResizeDirection(direction);
    setStartPos({ x: e.clientX, y: e.clientY });
  }, []);

  const onResizeMove = useCallback(
    (e) => {
      if (!resizingElement || !resizeDirection) return;

      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;

      // setElements((prev) => {
      //   const updatedElements = prev.map((el) => {
      //     if (el.id !== resizingElement) return el;

      //     const updatedElement = { ...el };

      //     if (resizeDirection.includes("right")) {
      //       updatedElement.width = Math.max(1, el.width + dx);
      //     }
      //     if (resizeDirection.includes("left")) {
      //       const newWidth = Math.max(1, el.width - dx);
      //       updatedElement.x = el.x + (el.width - newWidth);
      //       updatedElement.width = newWidth;
      //     }
      //     if (resizeDirection.includes("bottom")) {
      //       updatedElement.height = Math.max(1, el.height + dy);
      //     }
      //     if (resizeDirection.includes("top")) {
      //       const newHeight = Math.max(1, el.height - dy);
      //       updatedElement.y = el.y + (el.height - newHeight);
      //       updatedElement.height = newHeight;
      //     }

      //     if (isCtrlPressed && el.type === "rectangle") {
      //       const maxChange = Math.max(
      //         Math.abs(updatedElement.width - el.width),
      //         Math.abs(updatedElement.height - el.height)
      //       );
      //       updatedElement.width = el.width + Math.sign(dx) * maxChange;
      //       updatedElement.height = el.height + Math.sign(dy) * maxChange;
      //     }

      //     return updatedElement;
      //   });

      //   // Update `selected` element
      //   const updatedSelected = updatedElements.find(
      //     (el) => el.id === resizingElement
      //   );
      //   if (updatedSelected) {
      //     setSelected(updatedSelected);
      //   }

      //   return updatedElements;
      // });

      const updatedElement = elements.find((el) => el.id === resizingElement)
      if (!updateElement) return;

      let newWidth = updatedElement.width;
      let newHeight = updatedElement.height;
      let newX = updatedElement.x;
      let newY = updatedElement.y;

      // Handle resizing in different directions
      if (resizeDirection.includes("right")) {
        newWidth = Math.max(1, updatedElement.width + dx);
      }
      if (resizeDirection.includes("left")) {
        const widthChange = updatedElement.width - newWidth;
        newX = updatedElement.x + widthChange;
        newWidth = Math.max(1, updatedElement.width - dx);
      }
      if (resizeDirection.includes("bottom")) {
        newHeight = Math.max(1, updatedElement.height + dy);
      }
      if (resizeDirection.includes("top")) {
        const heightChange = updatedElement.height - newHeight;
        newY = updatedElement.y + heightChange;
        newHeight = Math.max(1, updatedElement.height - dy);
      }

      // Maintain aspect ratio when Ctrl is pressed (if resizing is rectangle)
      // if (isCtrlPressed && updatedElement.type === "rectangle") {
      //   const maxChange = Math.max(
      //     Math.abs(newWidth - updatedElement.width),
      //     Math.abs(newHeight - updatedElement.height)
      //   );
      //   newWidth = updatedElement.width + Math.sign(dx) * maxChange;
      //   newHeight = updatedElement.height + Math.sign(dy) * maxChange;
      // }

      // Update element using updateElement from Zustand
      updateElement(resizingElement, {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      });

      setStartPos({ x: e.clientX, y: e.clientY });
    },
    [resizingElement, resizeDirection, startPos, isCtrlPressed]
  );

  const onResizeEnd = useCallback(() => {
    setResizingElement(null);
    setResizeDirection(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Control") {
        setIsCtrlPressed(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "Control") {
        setIsCtrlPressed(false);
      }
    };

    if (resizingElement) {
      document.addEventListener("mousemove", onResizeMove);
      document.addEventListener("mouseup", onResizeEnd);
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("keyup", handleKeyUp);
    } else {
      document.removeEventListener("mousemove", onResizeMove);
      document.removeEventListener("mouseup", onResizeEnd);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    }

    return () => {
      document.removeEventListener("mousemove", onResizeMove);
      document.removeEventListener("mouseup", onResizeEnd);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [resizingElement, onResizeMove, onResizeEnd]);

  useEffect(() => {
    elements.forEach((el) => {
      if (el.selected) {
        updateElement(el.id, { bgColor: color }); // Update only the selected element's bgColor
      }
    });
  }, [color, elements, updateElement]);

  const handleDoubleClick = (id) => {
    const element = elements.find((el) => el.id===id);
    if (element) {
      updateElement(id, {text: element.text || "Edit me!"})
    }
  };

  // const handleColorChange = (newColor) => {
  //   setColor(newColor);
  //   if (newColor && selected) {
  //     setElements((prevElements) =>
  //       prevElements.map((el) =>
  //         el.selected
  //           ? { ...el, bgColor: newColor } // Update the background color of selected element
  //           : el
  //       )
  //     );
  //   }
  // };

  // const handleSelect = (e, id) => {
  //   e.stopPropagation();
  //   setElements((prevElements) => {
  //     if (!prevElements) return [];
  //     return prevElements.map((element) => {
  //       return id === element.id
  //         ? { ...element, selected: true }
  //         : { ...element, selected: false };
  //     });
  //   });
  // };

  const handleDeSelect = () => {
    elements.forEach((el) => {
      updateElement(el.id, {selected: false})
    })

    setSelected(null);
    // setSelectedElement(null);
  };

  const handleElementClick = (id) => {
    const element = elements.find((el) => el.id === id);
    updateElement(id, {selected: true})

    setSelected(element);
  };

  function handleTextAreaFocus(elId) {
    console.log(`Textarea with ID ${elId} focused`);
    // Example: Disable dragging while editing
    // You can set some state here if needed to disable drag
  }

  function handleTextAreaBlur(elId) {
    console.log(`Textarea with ID ${elId} lost focus`);
    // Example: Re-enable dragging after editing
    // Reset any temporary state you used during focus
  }

  const handleMouseDown = (e, id) => {
    if (isTextEditing) {
      e.stopPropagation(); // Prevent dragging if editing text
    } else {
      onMouseDown(e, id); // Allow dragging if not editing text
    }
  };

  return (
    <>
      <DynamicFontLoader font={font} />

      <div className="flex-1 p-8 overflow-auto bg-gray-100">
        <div
          onClick={(e) => {
            if (e.target.id === "working-area") {
              handleDeSelect();
            }
          }}
          id="working-area"
          className="aspect-[16/9] bg-white shadow-lg mx-auto max-w-4xl relative overflow-hidden"
        >
          {elements &&
            elements.map((el) =>
              el.slideId === activeSlide.id ? (
                <div
                  key={el.id}
                  style={{
                    position: "absolute",
                    left: el.x,
                    top: el.y,
                    width: el.type === "triangle" ? 0 : el.width, // Triangle doesn't use width directly
                    height: el.type === "triangle" ? 0 : el.height, // Triangle doesn't use height directly
                    minHeight: 0,
                    // borderRadius: el.borderRadius,
                    fontSize: el.fontSize || 24,
                    fontFamily: el.font,
                    fontWeight: 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    // border:
                    //   el.type === "text"
                    //     ? "none"
                    //     : el.type === "triangle"
                    //     ? "none"
                    //     : "1px solid #FFBE7A",
                    border: "none",
                    borderRadius:
                      el.type === "ellipse" ? "50%" : el.borderRadius,
                    // backgroundColor:
                    //   el.type !== "text" && el.type !== "triangle"
                    //     ? "#FFBE7A"
                    //     : "transparent",
                    backgroundColor: el.text ? "transparent" : el.bgColor,
                    color: el.textColor || "#000",
                    cursor: "move",
                  }}
                  // onClick={(e) => selectElement(e, el.id)}
                  onDoubleClick={() => {
                    if (el.type === "rectangle" || el.type === "ellipse") {
                      if (el.text !== undefined) {
                        handleDoubleClick(el.id);
                      }
                    }
                  }}
                  onMouseDown={(e) => {
                    // handleSelect(e, el.id);
                    if (e.target.tagName !== "TEXTAREA") {
                      onMouseDown(e, el.id);
                    }
                  }}
                  // onClick={() => handleElementClick(el.id)}
                >
                  {(el.type === "rectangle" || el.type === "ellipse") &&
                    el.text && (
                      <textarea
                        value={el.text}
                        onChange={(e) => onTextChange(el.id, e.target.value)}
                        style={{
                          width: "80%", // Adjust size as needed
                          height: "50%", // Adjust size as needed
                          border: "none",
                          resize: "none",
                          textAlign: "center",
                          background: "transparent",
                          outline: "none",
                        }}
                      />
                    )}

                  {el.type === "text" ? (
                    <div
                      style={{
                        position: "absolute",
                        // top: el.y,
                        // left: el.x,
                        width: el.width || "200px",
                        height: el.height || "50px",
                        padding: "8px",
                        boxSizing: "border-box",
                        backgroundColor: "transparent",
                        // border: "1px dashed gray",
                      }}
                      onMouseDown={(e) => {
                        // Allow dragging only if the outer div is clicked, not the textarea
                        if (e.target.tagName !== "TEXTAREA") {
                          onMouseDown(e, el.id);
                        }
                      }}
                    >
                      <textarea
                        value={el.text || ""}
                        onChange={(e) => onTextChange(el.id, e.target.value)}
                        onFocus={() => console.log("entered editing mode")} // Log focus for testing
                        onBlur={() => console.log("exited editing mode")} // Log blur for testing
                        style={{
                          width: "100%",
                          height: "100%",
                          border: "none",
                          resize: "none",
                          textAlign: "center",
                          backgroundColor: "transparent",
                          outline: "none",
                          zIndex: 2,
                          cursor: "text", // Use text cursor when hovering over the textarea
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

                  {/* Resizing Handles */}
                  {["top-left", "top-right", "bottom-left", "bottom-right"].map(
                    (direction) => (
                      <div
                        key={direction}
                        style={{
                          visibility: el.selected ? "visible" : "hidden",
                          position: "absolute",
                          width: "10px",
                          height: "10px",
                          backgroundColor: "gray",
                          cursor:
                            direction === "top-left"
                              ? "nw-resize"
                              : direction === "top-right"
                              ? "ne-resize"
                              : direction === "bottom-left"
                              ? "sw-resize"
                              : "se-resize",
                          top: direction.includes("top") ? -5 : "auto",
                          bottom: direction.includes("bottom") ? -5 : "auto",
                          left: direction.includes("left") ? -5 : "auto",
                          right: direction.includes("right") ? -5 : "auto",
                        }}
                        onMouseDown={(e) => onResizeStart(e, el.id, direction)}
                      />
                    )
                  )}
                </div>
              ) : (
                <></>
              )
            )}
        </div>
      </div>
    </>
  );
}
