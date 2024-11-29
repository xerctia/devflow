



import { defineTable } from "@convex-dev/server";


export const slides = defineTable({
  fields: {
    slideNumber: "number",
    elements: "array", 
  },
});


export const presentations = defineTable({
  fields: {
    title: "string", 
    slides: "array", 
    lastModified: "datetime", 
  },
});
