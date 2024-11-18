"use client";

import React, { useState } from "react";
import TopBar from "../(components)/TopBar";
import Toolbar from "../(components)/Toolbar";
import Ruler from "../(components)/Ruler";
import Sidebar from "../(components)/Sidebar";
import MainArea from "../(components)/MainArea";

export default function SlideEditor() {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);

  const addElement = (type) => {
    const newElement = {
      id: Date.now(),
      type,
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      text: type === "text" ? "New Text" : "",
    };
    setElements([...elements, newElement]);
  };

  const handleMouseDown = (e, id) => {
    e.preventDefault();
    setSelectedElement({ id, startX: e.clientX, startY: e.clientY });
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

  return (
    <div
      className="flex flex-col h-screen bg-background text-foreground"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <TopBar />
      <Toolbar addElement={addElement} />
      <div className="flex flex-1">
        <Sidebar />
        <MainArea
          elements={elements}
          onMouseDown={handleMouseDown}
          onTextChange={handleTextChange}
          addElement={addElement}
        />
      </div>
    </div>
  );
}
