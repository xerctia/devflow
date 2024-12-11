import { create } from "zustand";
import { persist } from "zustand/middleware";
import db from "../db";

var usePptStore = create((set) => ({
  ppts: [],

  // Load ppts
  loadPpts: async () => {
    const ppts = await db.ppts.toArray();
    set({ ppts });
  },

  // Add new ppt
  addNewPpt: async (ppt) => {
    await db.ppts.add(ppt);
    set((state) => ({ ppts: [...state.ppts, ppt] }));
  },

  // Set active ppt
  setActivePpt: async (id) => {
    await db.ppts.update(id, { active: true });
    set((state) => ({
      ppts: state.ppts.map((ppt) =>
        ppt.id === id ? { ...ppt, active: true } : { ...ppt, active: false }
      ),
    }));
  },

  updatePpt: async (id, updatedDetails) => {
    await db.ppts.update(id, updatedDetails); // Update in database
    set((state) => ({
      ppts: state.ppts.map((ppt) =>
        ppt.id === id ? { ...ppt, ...updatedDetails } : ppt
      ),
    }));
  },

  // Remove ppt
  remPpt: async (id) => {
    await db.ppts.delete(id);
    set((state) => ({
      ppts: state.ppts.filter((ppt) => ppt.id !== id),
    }));
  },
}));

// var usePptStore = create(
//   persist(
//     (set) => ({
//       ppts: [],

//       addNewPpt: (ppt) => {
//         set((state) => ({
//           ppts: [...state.ppts, ppt],
//         }));
//       },

//       setActivePpt: (id) => {
//         set((state) => ({
//           ppts: state.ppts.map((ppt) => {
//             ppt.id === id
//               ? { ...ppt, active: true }
//               : { ...ppt, active: false };
//           }),
//         }));
//       },

//       remPpt: (id) => {
//         set((state) => ({
//           ppts: state.ppts.filter((ppt) => ppt.id !== id),
//         }));
//       },
//     }),
//     {
//       name: "ppt-storage",
//       version: 2,
//       onRehydrateStorage: () => (state) => {
//         console.log("Rehydrating state:", state);
//       },
//       migrate: (persistedState, version) => {
//         console.log(`Migrating state from version ${version}`);
//         // if (version === 1) {
//         //   // Example: Transform old state structure to new structure
//         //   return {
//         //     ...persistedState,
//         //     ppts: persistedState.ppts || [], // Ensure ppts exists in case it's missing
//         //   };
//         // }
//         return persistedState; // Default case: return the unchanged state
//       },
//     }
//   )
// );

export default usePptStore;
