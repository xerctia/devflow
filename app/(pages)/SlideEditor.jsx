"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import TopBar from "../(components)/TopBar";
import Toolbar from "../(components)/Toolbar";
import Ruler from "../(components)/Ruler";
import Sidebar from "../(components)/Sidebar";
import MainArea from "../(components)/MainArea";
import usePptStore from "../zustandStores/usePptStore";
import useSlideStore from "../zustandStores/useSlideStore";
import db from "../db";
import useElementStore from "../zustandStores/useElementStore";
// import Head from "next/head";

export default function SlideEditor({ pptId }) {
  // const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [selected, setSelected] = useState(null);
  const [color, setColor] = useState("#FFBE7A");
  const [font, setFont] = useState("Poppins");

  // const [slides, setSlides] = useState([]);
  const [activeSlide, setActiveSlide] = useState(null);

  const { ppts, loadPpts } = usePptStore();
  const { slides, loadSlides, newSlide } = useSlideStore();
  const {elements, loadElements, newElement, updateElement, remElement} = useElementStore();
  
  const [currentPpt, setCurrentPpt] = useState(null);

  const memoizedNewSlide = useCallback(newSlide, []);

  const uid = function () {
    var id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    return id;
  };

  useEffect(() => {
    const findActivePpt = async () => {
      await loadPpts();
      const curPpt = ppts.find((ppt) => ppt?.id === pptId);
      setCurrentPpt(curPpt || null);

      if (!curPpt) {
        console.log("Presentation not found for ID:", pptId);
      } else {
        // console.log("Presentation id found: ", pptId);
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
          id: `slide-${uid()}`,
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
          await memoizedNewSlide(firstSlide); // Add slide if it doesn't exist
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

  

  const addElement = (type) => {
    const newElem = {
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
      bgColor: '#FFBE7A',
      textColor: "#000",
      selected: true,
      text: type === "text" ? "Enter text" : "",
      image: type === 'image' ? null : undefined
    };

    newElement(newElem); // Add the new element to the Zustand store
    setSelected(newElem); // Set the selected element
    console.log(newElem.slideId);
    console.log(activeSlide.slideId);
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

  // const handleMouseDown = (e, id) => {
  //   e.preventDefault();

  //   setElements((prevElements) => {
  //     // Update the elements array, marking only the clicked element as selected
  //     return prevElements.map((element) => ({
  //       ...element,
  //       selected: element.id === id,
  //     }));
  //   });

  //   // Find the selected element and update the `selected` state
  //   const selectedEl = elements.find((element) => element.id === id);
  //   if (selectedEl) {
  //     setSelected(selectedEl); // Set the selected element in state
  //   }

  //   // Optionally set additional properties for dragging or other purposes
  //   setSelectedElement({ id, startX: e.clientX, startY: e.clientY });

  //   // Log the selected font after state update
  //   console.log(`Active slide : ${activeSlide.name}`);
  // };

  const dragref = useRef({});
  
  const handleMouseDown = async (e, id) => {
    e.preventDefault();

    // Select the element
    const selectedEl = elements.find((element) => element.id === id);
    if (selectedEl) {
      setSelected(selectedEl); // Set the selected element in state
      await updateElement(id, {selected: true})
    }

    setSelectedElement({ id, startX: e.clientX, startY: e.clientY, initialX: selectedEl.x, initialY: selectedEl.y, });
    dragref.current = { startX: e.clientX, startY: e.clientY, initialX: selectedEl.x, initialY: selectedEl.y }
  };

  const handleMouseMove = async (e) => {
    if (!selectedElement) return;
    if (!selected) return;

    const dx = e.clientX - dragref.current.startX;
    const dy = e.clientY - dragref.current.startY;

    const newX = dragref.current.initialX + dx;
    const newY = dragref.current.initialY + dy;

    const element = document.getElementById(`element-${selectedElement.id}`);
    if (element) {
      // console.log('Element found!')
      element.style.left = `${newX}px`
      element.style.top = `${newY}px`
    }

    // updateElement(selectedElement.id, { x: newX, y: newY });

    // setSelectedElement((prev) => ({
    //   ...prev,
    //   startX: e.clientX,
    //   startY: e.clientY,
    //   initialX: newX,
    //   initialY: newY,
    // }));

    setSelected((prev) => ({
      ...prev,
      x: newX,
      y: newY,
    }));
  };

  const handleMouseUp = async () => {
    if (!selectedElement) return;

    const dx = dragref.current.startX - selectedElement.startX;
    const dy = dragref.current.startY - selectedElement.startY;

    // const newX = dragref.current.initialX + dx;
    // const newY = dragref.current.initialY + dy;

    // const { id } = selectedElement;

    // Finalize the position in state and backend
    const elementNode = document.getElementById(`element-${selectedElement.id}`);
    if (!elementNode) return;

    const style = window.getComputedStyle(elementNode);
    const transform = style.transform; // e.g., "matrix(1, 0, 0, 1, 100, 200)"
    let translateX = 0, translateY = 0;

    if (transform && transform !== "none") {
      const matrixValues = transform.match(/matrix.*\((.+)\)/)?.[1]?.split(", ");
      if (matrixValues && matrixValues.length >= 6) {
        translateX = parseFloat(matrixValues[4]); // Horizontal translation
        translateY = parseFloat(matrixValues[5]); // Vertical translation
      }
    }

    // await updateElement(id, { x: newX, y: newY });

    setSelected((prev) => ({
      ...prev,
      x: prev.x + translateX,
      y: prev.y + translateY,
    }))
    
    // Finalize the element position in state
    await updateElement(selectedElement.id, {
      initialX: dragref.current.initialX + dx,
      initialY: dragref.current.initialY + dy,
      x: selected.x + translateX,
      y: selected.y + translateY,
    });
    
    setSelectedElement(null);
  };

  // const handleMouseMove = (e) => {
  //   if (!selectedElement) return;
  
  //   // Use ref to store the current dragging position
  //   const dx = e.clientX - selectedElement.startX;
  //   const dy = e.clientY - selectedElement.startY;
  
  //   const newX = selectedElement.initialX + dx;
  //   const newY = selectedElement.initialY + dy;
  
  //   // Directly move the element without updating state
  //   const element = document.getElementById(`element-${selectedElement.id}`);
  //   if (element) {
  //     element.style.transform = `translate(${newX}px, ${newY}px)`;
  //   }
  // };
  
  // const handleMouseUp = () => {
  //   if (!selectedElement) return;
  
  //   // Finalize position in the state after dragging ends
  //   updateElement(selectedElement.id, {
  //     x: selectedElement.initialX + dx,
  //     y: selectedElement.initialY + dy,
  //   });
  
  //   setSelectedElement(null); // Reset selection
  // };

  const handleTextChange = (id, text) => {
    updateElement(id, { text });
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
        remElement(selected.id); // Remove the selected element from the store
        setSelected(null);
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

          addElement(duplicate);
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
        <TopBar currPpt={currentPpt} activeSlide={activeSlide} setActiveSlide={setActiveSlide} />
        <Toolbar
          addElement={addElement}
          activeSlide={activeSlide}
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
            // elements={elements}
            // slides={slides}
            activeSlide={activeSlide}
            color={color}
            font={font}
            // setElements={setElements}
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
