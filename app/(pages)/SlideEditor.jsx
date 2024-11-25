"use client";

import React, { useCallback, useEffect, useState } from "react";
import TopBar from "../(components)/TopBar";
import Toolbar from "../(components)/Toolbar";
import Ruler from "../(components)/Ruler";
import Sidebar from "../(components)/Sidebar";
import MainArea from "../(components)/MainArea";
import usePptStore from "../zustandStores/usePptStore";
import useSlideStore from "../zustandStores/useSlideStore";
import db from "../db";
// import Head from "next/head";

export default function SlideEditor({ pptId }) {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [selected, setSelected] = useState(null);
  const [color, setColor] = useState("#FFBE7A");
  const [font, setFont] = useState("Poppins");

  // const [slides, setSlides] = useState([]);
  const [activeSlide, setActiveSlide] = useState(null);

  const { ppts } = usePptStore();
  const { slides, loadSlides, newSlide } = useSlideStore();
  const [currentPpt, setCurrentPpt] = useState(null);

  const memoizedNewSlide = useCallback(newSlide, []);

  useEffect(() => {
    const findActivePpt = () => {
      const curPpt = ppts.find((ppt) => ppt?.id === pptId);
      setCurrentPpt(curPpt || null);

      if (!curPpt) {
        console.log("Presentation not found for ID:", pptId);
      } else {
        console.log("Presentation id found: ", pptId);
      }
    };

    findActivePpt();
  }, [ppts, pptId]);

  useEffect(() => {
    // Load slides asynchronously
    const initializeSlides = async () => {
      await loadSlides(pptId); // Load slides for the given pptId

      const existingSlides = useSlideStore
        .getState()
        .slides.filter((slide) => slide.pptId === pptId);

      console.log("Existing slides: ", existingSlides);

      if (existingSlides.length === 0) {
        // Add the first slide if none exist
        const firstSlide = {
          id: `slide-${Date.now()}`,
          pptId,
          bgcolor: "#fff",
          name: `Slide ${existingSlides.length + 1}`,
          slide_number: 1,
        };
        // Check if slide already exists to avoid adding it again
        const slideExists = existingSlides.some(
          (slide) => slide.name === firstSlide.name
        );

        if (!slideExists) {
          memoizedNewSlide(firstSlide); // Add slide if it doesn't exist
          setActiveSlide(firstSlide); // Set the first slide as active
        } else {
          console.log("Slide already exists, not adding duplicate.");
        }
      } else {
        // Set the first slide as active
        setActiveSlide(existingSlides[0]);
      }
    };

    initializeSlides();
  }, [pptId]);

  // useEffect(() => {
  //   async function fetchSlides() {
  //     const persistedSlides = await db.slides.toArray();
  //     if (persistedSlides.length > 0) {
  //       loadSlides(persistedSlides); // Load slides into Zustand store
  //     } else {
  //       addSlide(); // Add a slide if no persisted slides are found
  //     }
  //   }
  //   fetchSlides();
  // }, []);

  // useEffect(() => {
  //   db.slides.bulkPut(slides); // Save all slides to IndexedDB
  // }, [slides]);

  const uid = function () {
    var id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    return id;
  };

  const addElement = (type) => {
    setElements((prevElements) => {
      if (!prevElements) return [];

      var tempElem = {
        id: uid(), // Unique ID
        slideId: activeSlide.id,
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
      console.log(tempElem.slideId);
      console.log(activeSlide.slideId);
      return [
        ...prevElements.map((element) => ({ ...element, selected: false })),
        tempElem,
      ];
    });
  };

  const addSlide = () => {
    const tempSlide = {
      id: `slide-${uid()}`, // Unique ID
      pptId: pptId,
      bgcolor: "#fff", // Default background color
      name: `Slide ${slides.length + 1}`, // Default name
      slide_number: slides.length + 1, // Slide number based on the array length
    };

    newSlide(tempSlide);
    setActiveSlide(tempSlide);
  };

  // useEffect(() => {
  //   const pptSlides = slides.filter((slide) => {
  //     slide.pptId === pptId;
  //   });
  //   if (pptSlides.length === 0) {
  //     addSlide(); // Adds the first slide and sets it as active
  //   }
  // }, [pptId]);

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
    console.log(`Active slide : ${activeSlide.name}`);
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

    const handleDoubleKeyDown = (e) => {
      // Check if the target is a textarea or other input element
      if (
        e.target.tagName === "TEXTAREA" ||
        e.target.tagName === "INPUT" ||
        e.target.isContentEditable ||
        e.altKey ||
        e.shiftKey
      ) {
        return; // Ignore shortcuts if focused on editable content
      }

      e.preventDefault();

      // Ctrl + D : Duplicate
      if (e.ctrlKey && e.key.toUpperCase() === "D") {
        if (selected) {
          const duplicate = {
            ...selected,
            id: uid(),
            x: selected.x + 10,
            y: selected.y,
          };

          setElements((prevElements) => [...prevElements, duplicate]);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keydown", handleDoubleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keydown", handleDoubleKeyDown);
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
          <Sidebar
            // slides={slides}
            addSlide={addSlide}
            activeSlide={activeSlide}
            setActiveSlide={setActiveSlide}
          />
          <MainArea
            elements={elements}
            // slides={slides}
            activeSlide={activeSlide}
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
