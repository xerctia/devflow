import { create } from "zustand";
import db from "../db";

const useElementStore = create((set) => ({
    elements: [],
    
    // Load elements for a specific slide
  loadElements: async (slideId) => {
    const elements = await db.elements.where("slideId").equals(slideId).toArray();
    set({ elements });
  },

  // Add a new element
  newElement: async (element) => {
    await db.elements.add(element);  // Directly adding the element (since ID is provided)
    set((state) => ({
      elements: [...state.elements, element],  // No need to add the ID here, it's already part of the element object
    }));
  },

  // Update an element
  updateElement: async (id, updatedElement) => {
    await db.elements.update(id, updatedElement);
    set((state) => ({
      elements: state.elements.map((element) =>
        element.id === id ? { ...element, ...updatedElement } : element
      ),
    }));
  },

  // Delete an element
  remElement: async (id) => {
    await db.elements.delete(id);
    set((state) => ({
      elements: state.elements.filter((element) => element.id !== id),
    }));
  },
}))

export default useElementStore