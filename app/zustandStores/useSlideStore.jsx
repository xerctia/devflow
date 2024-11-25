import { create } from "zustand";
import db from "../db";

const useSlideStore = create((set) => ({
  slides: [],

  // Load slides for a specific presentation
  loadSlides: async (pptId) => {
    const slides = await db.slides.where("pptId").equals(pptId).toArray();
    set({ slides });
  },

  // Add a new slide
  newSlide: async (slide) => {
    await db.slides.add(slide);
    set((state) => ({ slides: [...state.slides, slide] }));
  },

  // Update a slide
  updateSlide: async (id, updatedSlide) => {
    await db.slides.update(id, updatedSlide);
    set((state) => ({
      slides: state.slides.map((slide) =>
        slide.id === id ? { ...slide, ...updatedSlide } : slide
      ),
    }));
  },

  // Delete a slide
  remSlide: async (id) => {
    await db.slides.delete(id);
    set((state) => ({
      slides: state.slides.filter((slide) => slide.id !== id),
    }));
  },
}));

export default useSlideStore;
