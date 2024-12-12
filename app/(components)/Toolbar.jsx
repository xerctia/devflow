"use client";

import React, { useState, useEffect } from "react";
import {
  Undo,
  Redo,
  Printer,
  MousePointer2,
  Minus,
  Plus,
  Bold,
  Italic,
  Underline,
  TextIcon,
  Square,
  Circle,
  Triangle,
  Pipette,
  Text,
  Type,
  Baseline,
  FileImage,
} from "lucide-react";
import ShapeButton from "./ShapeButton";
import Select from "react-select";
import useElementStore from "../zustandStores/useElementStore";
import { Button } from "@/components/ui/button";
import { handleImageUpload } from "@/controllers/ImageUpload";

export default function Toolbar({
  addElement,
  selected,
  setSelected,
  color,
  setColor,
  font,
  setFont,
  activeSlide
}) {
  const [fonts, setFonts] = useState([]);

  const {updateElement, newElement} = useElementStore();

  const handleColorChange = (e) => {
    // setColor(e.target.value);
    // console.log("Selected color:", e.target.value);
    setSelected((prev) => ({...prev, bgColor: e.target.value}))
    updateElement(selected.id, {bgColor: e.target.value})
  };

  const handleTextColorChange = (e) => {
    if (!selected) return;

    updateElement(selected.id, {textColor: e.target.value})
  };

  const handleWidthChange = (newWidth) => {
    const parsedWidth = parseInt(newWidth, 10);

    // Allow clearing the field but don't update state with invalid values
    if (newWidth === "") {
      setSelected((prev) => ({ ...prev, width: "" }));
      return;
    }

    // Only update if the parsed width is valid
    if (selected && !isNaN(parsedWidth) && parsedWidth > 0) {
      setSelected((prev) => ({ ...prev, width: parsedWidth }));

      // Update the element in the list
      updateElement(selected.id, {width: parsedWidth});
    }
  };

  const handleHeightChange = (newHeight) => {
    const parsedHeight = parseInt(newHeight, 10);

    // Allow clearing the field but don't update state with invalid values
    if (newHeight === "") {
      setSelected((prev) => ({ ...prev, height: "" }));
      return;
    }

    // Only update if the parsed width is valid
    if (selected && !isNaN(parsedHeight) && parsedHeight > 0) {
      setSelected((prev) => ({ ...prev, height: parsedHeight }));

      // Update the element in the list
      updateElement(selected.id, {height: parsedHeight});
    }
  };

  const handleBorderRadiusChange = (newBorderRadius) => {
    const parsedBorderRadius = parseInt(newBorderRadius, 10);

    // Allow clearing the field but don't update state with invalid values
    if (newBorderRadius === "") {
      setSelected((prev) => ({ ...prev, height: "" }));
      return;
    }

    // Only update if the parsed width is valid
    if (selected && !isNaN(parsedBorderRadius) && parsedBorderRadius > 0) {
      setSelected((prev) => ({ ...prev, borderRadius: parsedBorderRadius }));

      // Update the element in the list
      updateElement(selected.id, {borderRadius: parsedBorderRadius});
    }
  };

  const handleFontSizeChange = (newFs) => {
    const parsedFs = parseInt(newFs, 10);

    // Allow clearing the field but don't update state with invalid values
    if (newFs === "") {
      setSelected((prev) => ({ ...prev, fontSize: "" }));
      return;
    }

    // Only update if the parsed width is valid
    if (selected && !isNaN(parsedFs) && parsedFs > 0) {
      setSelected((prev) => ({ ...prev, fontSize: parsedFs }));

      // Update the element in the list
      updateElement(selected.id, {fontSize: parsedFs});
    }
  };

  useEffect(() => {
    const fetchFonts = async () => {
      const response = await fetch(
        `https://www.googleapis.com/webfonts/v1/webfonts?key=${process.env.NEXT_PUBLIC_GOOGLE_FONT_API}`
      );
      const data = await response.json();
      setFonts(data.items); // Assuming you get an array of fonts
    };

    fetchFonts();
  }, []);

  const fontOptions = fonts.map((font) => ({
    value: font.family,
    label: font.family,
  }));

  const fontSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      minWidth: 200,
      maxHeight: "20px",
      padding: "0.1rem 0.5rem",
    }),
    menu: (provided) => ({
      ...provided,
      fontSize: "14px", // Custom font size for the dropdown options
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: "14px", // Option text size
      padding: "10px", // Option padding
      backgroundColor: state.isSelected ? "#ddd" : provided.backgroundColor,
    }),
  };

  const handleFontChange = (selectedOption) => {
    const newFont = selectedOption.value;
    setFont(newFont);

    // const updatedElements = elements.map((el) => {
    //   if (el.id === selected.id) {
    //     return { ...el, font: newFont };
    //   }
    //   return el;
    // });

    updateElement(selected.id, {font: newFont});
  };

  const uploadImage = (e, newElement, activeSlide) => {
    handleImageUpload(e, newElement, activeSlide)
  }

  return (
    <div className="flex flex-col border-b bg-gray-50">
      <div className="flex items-center space-x-1 p-1">
        <Undo className="h-4 w-4" />
        <Redo className="h-4 w-4" />
        <Printer className="h-4 w-4" />
        <MousePointer2 className="h-4 w-4" />
        <div className="flex items-center border rounded bg-white px-2 py-1">
          <Minus className="h-4 w-4" />
          <span className="mx-2">100%</span>
          <Plus className="h-4 w-4" />
        </div>

        <Button variant="ghost" onClick={() => document.getElementById('img-upload').click()}>
          <FileImage className="h-4 w-4" />
        </Button>
        
        <input type="file" id="img-upload" accept="image/*" className="invisible" onChange={(e) => uploadImage(e, newElement, activeSlide)} />
        
      </div>
      <div className="flex items-center space-x-1 p-1 border-t">
        <ShapeButton icon={TextIcon} onClick={() => addElement("text")} />
        <ShapeButton icon={Square} onClick={() => addElement("rectangle")} />
        <ShapeButton icon={Circle} onClick={() => addElement("ellipse")} />
        <ShapeButton icon={Triangle} onClick={() => addElement("triangle")} />

        {selected && (
          // <div className="flex items-center space-x-1 p-1">
          <div className="flex items-center">
            <Minus className="rotate-90" />

            {/* Color Picker Button */}
            <ShapeButton
              icon={Pipette} // You can use a color-related icon here
              onClick={() => document.getElementById("color-picker").click()} // Trigger the color input
            />
            {/* Hidden color picker */}
            <input
              type="color"
              id="color-picker"
              style={{ display: "none" }} // Hide the input field
              onChange={handleColorChange} // Handle color change
              value={color} // Set default value
            />

            {/* text options */}
            {selected.text !== "" ? (
              <>
                <ShapeButton
                  icon={Baseline} // You can use a color-related icon here
                  onClick={() =>
                    document.getElementById("text-color-picker").click()
                  } // Trigger the color input
                />
                {/* Hidden color picker */}
                <input
                  type="color"
                  id="text-color-picker"
                  style={{ display: "none" }} // Hide the input field
                  onChange={handleTextColorChange} // Handle color change
                  value={color} // Set default value
                />

                <div className="flex items-center gap-4">
                  <label htmlFor="el-fontsize">Font Size:</label>
                  <input
                    className="max-w-20 px-2 py-[0.1rem] border-[1px] border-[#bbb] rounded-sm outline-none focus:border-[#676767]"
                    type="text"
                    name="el-fontsize"
                    id="el-fontsize"
                    value={selected?.fontSize || "20"} // Ensures a default value to avoid the field being empty
                    onChange={(e) => handleFontSizeChange(e.target.value)}
                  />
                </div>

                <div className="ml-4">
                  <Select
                    options={fontOptions}
                    onChange={handleFontChange}
                    value={{
                      label: font || "Poppins",
                      value: font || "Poppins",
                    }}
                    styles={fontSelectStyles}
                    isSearchable
                  />
                </div>
              </>
            ) : (
              <></>
            )}

            {/* Set Width */}
            <div className="flex items-center gap-4 ml-4">
              <label htmlFor="el-width">Width:</label>
              <input
                className="max-w-20 px-2 py-[0.1rem] border-[1px] border-[#bbb] rounded-sm outline-none focus:border-[#676767]"
                type="text"
                name="el-width"
                id="el-width"
                value={selected?.width || "100"} // Ensures a default value to avoid the field being empty
                onChange={(e) => handleWidthChange(e.target.value)}
              />
            </div>

            {/* Set Height */}
            <div className="flex items-center gap-4 ml-4">
              <label htmlFor="el-height">Height:</label>
              <input
                className="max-w-20 px-2 py-[0.1rem] border-[1px] border-[#bbb] rounded-sm outline-none focus:border-[#676767]"
                type="text"
                name="el-height"
                id="el-height"
                value={selected?.height || "100"} // Ensures a default value to avoid the field being empty
                onChange={(e) => handleHeightChange(e.target.value)}
              />
            </div>

            {/* Set Border Radius */}
            <div className="flex items-center gap-4 ml-4">
              <label htmlFor="el-borrad">Border Radius:</label>
              <input
                className="max-w-20 px-2 py-[0.1rem] border-[1px] border-[#bbb] rounded-sm outline-none focus:border-[#676767]"
                type="text"
                name="el-borrad"
                id="el-borrad"
                value={selected?.borderRadius || "8"} // Ensures a default value to avoid the field being empty
                onChange={(e) => handleBorderRadiusChange(e.target.value)}
              />
            </div>
          </div>
          // </div>
          // </div>
        )}
      </div>
    </div>
  );
}
