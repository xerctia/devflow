import React from "react";
import {
  Undo,
  Redo,
  Printer,
  MousePointer2,
  Minus,
  Plus,
  FileImage,
  Bold,
  Italic,
  Underline,
  TextIcon,
  Square,
  Circle,
  Triangle,
} from "lucide-react";
import ShapeButton from "./ShapeButton";

export default function Toolbar({ addElement }) {
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
        <FileImage className="h-4 w-4" />
      </div>
      <div className="flex items-center space-x-1 p-1 border-t">
        <ShapeButton icon={TextIcon} onClick={() => addElement("text")} />
        <ShapeButton icon={Square} onClick={() => addElement("square")} />
        <ShapeButton icon={Circle} onClick={() => addElement("circle")} />
        <ShapeButton icon={Triangle} onClick={() => addElement("triangle")} />
      </div>
    </div>
  );
}
