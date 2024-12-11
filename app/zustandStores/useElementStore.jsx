import { create } from "zustand";
import db from "../db";

const useElementStore = create((set) => ({
    elements: [],
    allElements: [],
    
    // Load elements for a specific slide
  loadElements: async (slideId) => {
    const elements = await db.elements.where("slideId").equals(slideId).toArray();
    set({ elements });
  },

  // Load elements for all slides in a presentation
  loadElementsForPpt: async (pptId) => {
    const slides = await db.slides.where("pptId").equals(pptId).toArray(); // Fetch slides for the presentation
    const slideIds = slides.map((slide) => slide.id);

    // Fetch elements for all those slide IDs
    const elements = await db.elements.where("slideId").anyOf(slideIds).toArray();
    set({ allElements: elements });
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