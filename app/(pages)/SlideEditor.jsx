"use client";

import React, { useEffect, useState } from "react";
import TopBar from "../(components)/TopBar";
import Toolbar from "../(components)/Toolbar";
import Ruler from "../(components)/Ruler";
import Sidebar from "../(components)/Sidebar";
import MainArea from "../(components)/MainArea";
// import Head from "next/head";

export default function SlideEditor() {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [selected, setSelected] = useState(null);
  const [color, setColor] = useState("#FFBE7A");
  const [font, setFont] = useState("Poppins");

  // const [slides, setSlides] = useState([]);

  const uid = function () {
    var id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    console.log(id);
    return id;
  };

  const addElement = (type) => {
    setElements((prevElements) => {
      if (!prevElements) return [];

      var tempElem = {
        id: uid(), // Unique ID
        type,
        x: 50,
        y: 50,
        width: 100,
        height: 100,
        borderRadius: 8,
        fontSize: 20,
        font: font || "Poppins",
        bgColor: color,
        textColor: "#000",
        selected: true,
        text: type === "text" ? "Enter text" : "",
      };

      setSelected(tempElem);
      return [
        ...prevElements.map((element) => ({ ...element, selected: false })),
        tempElem,
      ];
    });
  };

  const handleMouseDown = (e, id) => {
    e.preventDefault();

    setElements((prevElements) => {
      // Update the elements array, marking only the clicked element as selected
      return prevElements.map((element) => ({
        ...element,
        selected: element.id === id,
      }));
    });

    // Find the selected element and update the `selected` state
    const selectedEl = elements.find((element) => element.id === id);
    if (selectedEl) {
      setSelected(selectedEl); // Set the selected element in state
    }

    // Optionally set additional properties for dragging or other purposes
    setSelectedElement({ id, startX: e.clientX, startY: e.clientY });

    // Log the selected font after state update
    console.log(selectedEl?.font || "No font selected");
  };

  const handleMouseMove = (e) => {
    if (!selectedElement) return;
    const dx = e.clientX - selectedElement.startX;
    const dy = e.clientY - selectedElement.startY;

    setElements((prevElements) =>
      prevElements.map((el) =>
        el.id === selectedElement.id
          ? { ...el, x: el.x + dx, y: el.y + dy }
          : el
      )
    );

    setSelectedElement((prev) => ({
      ...prev,
      startX: e.clientX,
      startY: e.clientY,
    }));
  };

  const handleMouseUp = () => {
    setSelectedElement(null);
  };

  const handleTextChange = (id, text) => {
    setElements((prevElements) =>
      prevElements.map((el) => (el.id === id ? { ...el, text } : el))
    );
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if the target is a textarea or other input element
      if (
        e.target.tagName === "TEXTAREA" ||
        e.target.tagName === "INPUT" ||
        e.target.isContentEditable ||
        e.ctrlKey ||
        e.altKey ||
        e.metaKey ||
        e.shiftKey
      ) {
        return; // Ignore shortcuts if focused on editable content
      }

      // Handle shortcuts only when not in an input
      if (e.key.toLowerCase() === "r") {
        addElement("rectangle");
      } else if (e.key.toLowerCase() === "o") {
        addElement("ellipse");
      } else if (e.key.toLowerCase() === "t") {
        addElement("text");
      } else if (e.key.toLowerCase() === "p") {
        addElement("triangle");
      }

      if (!!selected && e.key === "Delete") {
        setElements((prev) => prev.filter((el) => el.id !== selected.id));
        setSelected((prevSelected) =>
          prevSelected?.id === selected.id ? null : prevSelected
        );
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [addElement]);

  return (
    <>
      <div
        className="flex flex-col h-screen bg-background text-foreground"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <TopBar />
        <Toolbar
          addElement={addElement}
          setElements={setElements}
          selected={selected}
          setSelected={setSelected}
          color={color}
          setColor={setColor}
          font={font}
          setFont={setFont}
        />
        <div className="flex flex-1">
          <Sidebar />
          <MainArea
            elements={elements}
            color={color}
            font={font}
            setElements={setElements}
            setSelected={setSelected}
            onMouseDown={handleMouseDown}
            onTextChange={handleTextChange}
            addElement={addElement}
          />
        </div>
      </div>
    </>
  );
}
