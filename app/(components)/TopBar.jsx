import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, Grid, Link, Play } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import useSlideStore from "../zustandStores/useSlideStore";
import useElementStore from "../zustandStores/useElementStore";
import usePptStore from "../zustandStores/usePptStore";
import { useParams } from "next/navigation";

export default function TopBar({currPpt}) {
  const [isExportModalOpen, setExportModalOpen] = useState(false);
  const [curPpt, setCurPpt] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [pName, setpName] = useState(currPpt?.name);

  const {pId} = useParams();
  
  const {ppts, loadPpts, updatePpt} = usePptStore();
  const {slides} = useSlideStore();
  const {allElements, loadElementsForPpt} = useElementStore();

  const saveName = () => {
    if (pName.trim() && pName !== currPpt?.name) {
      updatePpt(currPpt.id, {name: pName});
    }
    setIsEditing(false);
  }

  useEffect(() => {
    if (pId) {
      loadElementsForPpt(pId);
    }
  }, [pId, loadElementsForPpt])

  const curSlides = slides?.filter(slide => slide.pptId === pId)
  const curSlideIds = curSlides.map(slide => slide.id);
  const curElems = allElements?.filter(el => curSlideIds.includes(el.slideId));
  
  const exportData = {
    ppt: currPpt?.name,
    slides: curSlides,
    elements: curElems,
  }

  const handleExportClick = () => {
    setExportModalOpen(true);
    // console.log(elements)
  };

  const closeModal = () => {
    setExportModalOpen(false);
  };
  
  return (
    <>
    <div className="flex items-center p-1 gap-6 border-b">
      <div className="flex items-center gap-2">
        <a href="/">
          <div className="text-xl font-bold text-[#FFBE7A] hover:text-[#ea9b47]">DevFlow</div>
        </a>
        {isEditing ? (
        <input
          type="text"
          value={pName}
          onChange={(e) => setpName(e.target.value)}
          onBlur={saveName} // Save when clicking out
          onKeyDown={(e) => e.key === "Enter" && saveName()} // Save on Enter
          autoFocus
          className="border border-gray-300 py-1 outline-none rounded px-2 max-w-40 text-sm"
        />
      ) : (
        <Button variant="ghost">
          <span
            className="font-medium cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            {currPpt?.name}.ppt
          </span>
        </Button>
      )}
        
        <Button variant="ghost" asChild>
          <div className="flex gap-2">
            <Link className="h-4 w-4" />
            <span className="cursor-pointer" onClick={handleExportClick}>Export</span>
          </div>
        </Button>
      </div>
      {/* <div className="flex gap-4 text-sm"> */}
        {/* <span className="cursor-pointer">File</span>
        <span className="cursor-pointer">Edit</span>
        <span className="cursor-pointer">View</span> */}
        
      {/* </div> */}
    </div>

        {/* Modal */}
        <Dialog open={isExportModalOpen} onOpenChange={setExportModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Export presentation</DialogTitle>
              <DialogDescription>You are exporting the following presentation:</DialogDescription>
            </DialogHeader>

            <div className="mb-4">
              <span className="font-medium">Presentation name:</span> {" "}
              {currPpt?.name || "Untitled"}
            </div>

            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto max-h-64">
              {JSON.stringify(exportData, null, 2)}
            </pre>

            <DialogFooter>
              <Button variant="ghost" className="outline-none border-none" onClick={closeModal}>Cancel</Button>
              <Button
                variant="default"
                onClick={() => {
                  const dataStr =
                    "data:text/json;charset=utf-8," +
                    encodeURIComponent(JSON.stringify(exportData, null, 2));
                  const downloadAnchor = document.createElement("a");
                  downloadAnchor.href = dataStr;
                  downloadAnchor.download = `${currPpt?.name || "Untitled"}.json`;
                  downloadAnchor.click();
                  closeModal();
                }}
              >
                Download
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    
    </>
  );
}
