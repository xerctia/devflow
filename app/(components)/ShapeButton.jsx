import React from "react";
import { Button } from "@/components/ui/button";

export default function ShapeButton({ icon: Icon, onClick }) {
  return (
    <Button variant="ghost" size="icon" onClick={onClick}>
      <Icon className="h-4 w-4" />
    </Button>
  );
}
