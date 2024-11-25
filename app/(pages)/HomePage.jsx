"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import usePptStore from "@/app/zustandStores/usePptStore";

export const HomePage = () => {
  const router = useRouter();

  //   const [ppts, setPpts] = useState([]);
  const { ppts, loadPpts, addNewPpt, setActivePpt } = usePptStore();
  //   console.log(usePptStore);
  //   const [activePpt, setActivePpt] = useState(null);

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
            <span className="cursor-pointer">File</span>
            <span className="cursor-pointer">Edit</span>
            <span className="cursor-pointer">View</span>
            <span className="cursor-pointer">Insert</span>
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
