import React from "react";
import { Button } from "@/components/ui/button";
import { Star, Grid, Link, Play } from "lucide-react";

export default function TopBar() {
  return (
    <div className="flex items-center p-1 gap-6 border-b">
      <div className="flex items-center gap-2">
        <div className="text-xl font-bold text-[#FFBE7A]">DevFlow</div>
        <span className="font-medium">slides.ppt</span>
        <Star className="h-4 w-4" />
        <Button variant="ghost" size="icon">
          <Grid className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Link className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex gap-4 text-sm">
        <span className="cursor-pointer">File</span>
        <span className="cursor-pointer">Edit</span>
        <span className="cursor-pointer">View</span>
        <span className="cursor-pointer">Insert</span>
      </div>
    </div>
  );
}
