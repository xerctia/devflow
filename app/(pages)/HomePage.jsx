"use client";

import { Button } from "@/components/ui/button";
import { Import, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader, DialogClose } from "@/components/ui/dialog";
import usePptStore from "@/app/zustandStores/usePptStore";
import useSlideStore from "../zustandStores/useSlideStore";
import useElementStore from "../zustandStores/useElementStore";

export const HomePage = () => {
  const router = useRouter();

  const { ppts, loadPpts, addNewPpt, setActivePpt } = usePptStore();
  const {newSlide} = useSlideStore();
  const {newElement} = useElementStore();

  const [jsonInput, setJsonInput] = useState("");
  const [importError, setImportError] = useState(null);

  useEffect(() => {
    loadPpts();
  }, []);

  const uid = function () {
    var id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    return id;
  };

  const addPpt = () => {
    const newPpt = {
      id: `ppt-${uid()}`,
      active: false,
      name: `Presentation ${ppts.length + 1}`,
    };

    addNewPpt(newPpt);
  };

  const openPpt = (id) => {
    console.log(`Opening presentation ${id}`);
    setActivePpt(id);
    router.push(`/p/${id}`);
  };

  const handleImport = () => {
    try {
      const data = JSON.parse(jsonInput)

      if (!data || !data.ppt || !data.slides || !data.elements || !Array.isArray(data.slides)) {
        throw new Error("Invalid JSON format.");
      }

      const newPpt = {
        id: `ppt-${uid()}`,
        active: false,
        name: data.ppt,
      }
      addNewPpt(newPpt)

      data.slides.forEach((slide) => {
        const new_slide = {
          ...slide,
          pptId: newPpt.id,
        }
        newSlide(new_slide);
      })

      data.elements.forEach((el) => {
        newElement(el);
      })

      setJsonInput("");
      setImportError(null);
    } catch (e) {
      setImportError(e);
      console.error(e);
    }
  }

  useEffect(() => {
    const handleShortCut = (e) => {
      if (e.ctrlKey && e.altKey && e.key.toUpperCase() === "N") {
        addPpt();
      }
    }

    document.addEventListener('keydown', handleShortCut);

    return () => {
      document.removeEventListener('keydown', handleShortCut);
    }
  }, [ppts])

  return (
    <>
      <nav>
        <div className="flex items-center px-20 py-6 gap-6 border-b">
          <div className="flex items-center gap-2">
            <Link href="/">
              <div className="text-3xl font-bold text-[#FFBE7A]">DevFlow</div>
            </Link>
          </div>
          <div className="flex gap-4 text-md">
            <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" asChild>
                <div className="flex gap-2 items-center">
                  <Import className="h-4 w-4" />
                  <span className="cursor-pointer">Import</span>
                </div>
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Presentation</DialogTitle>
                <DialogDescription>Paste your JSON data here to import a presentation:</DialogDescription>
              </DialogHeader>

              <textarea
                  className="w-full h-48 mt-4 p-2 border rounded-md outline-none"
                  placeholder="Paste your JSON data here"
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
              />

              {importError && (
                <div className="text-red-500 mt-2">{importError}</div>
              )}

              <DialogFooter>
              <div className="mt-4 flex gap-4">
                  <DialogClose>
                    <Button onClick={handleImport} className="bg-[#FFBE7A] [#3f3f3f]">
                      Import
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button variant="destructiveNeutral">
                      Cancel
                    </Button>
                  </DialogClose>
                </div>
              </DialogFooter>
            </DialogContent>
            </Dialog>
          </div>
        </div>
      </nav>
      <div className="w-screen p-20 flex">
        <div className="flex flex-wrap gap-10 p-2">
          <div
            onClick={addPpt}
            className="mb-2 px-16 py-8 bg-white border rounded-lg aspect-video flex flex-col items-center justify-center gap-3 hover:border-[#FFBE7A] cursor-pointer"
          >
            <Plus stroke="#FFBE7A" strokeWidth={2} className="w-8 h-8" />
            <p>New Presentation</p>
          </div>
          {ppts.map(
            (ppt) =>
              ppt && (
                <div
                  key={ppt.id}
                  onClick={() => openPpt(ppt.id)}
                  className={`mb-2 px-16 py-8 bg-white border rounded-lg aspect-video flex items-center justify-center hover:border-[#FFBE7A] cursor-pointer`}
                >
                  {ppt.name}
                </div>
              )
          )}
        </div>
      </div>
    </>
  );
};
