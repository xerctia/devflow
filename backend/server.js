
// 

// Import required modules
import { mutation, query } from "@convex-dev/server"; // Convex server-side functions
import express from 'express';  // Express for the API layer
import { createServer } from 'http';  

import presentationRoutes from './routes/presentations.js';  


const app = express();


app.use(express.json());  


app.use('/api/presentations', presentationRoutes);


import { createConnection } from "@convex-dev/server";
const db = createConnection(); 

// creating the presentation with 1st slide
export const createPresentation = mutation({
  args: { title: "string", description: "string" },
  handler: async (ctx, args) => {
    const newPresentation = await ctx.db.insert("presentations", {
      title: args.title,
      description: args.description,
      createdAt: new Date(),
      slides: [],
    });
    return newPresentation;
  }
});


// getting all the presentation
export const getPresentations = query({
  handler: async (ctx) => {
    const presentations = await ctx.db.query("presentations").collect();
    return presentations;
  }
});


// getting presentation by ID
export const getPresentationById = query({
  args: { id: "string" },
  handler: async (ctx, args) => {
    const presentation = await ctx.db.query("presentations").filter(q => q.eq(q.field("id"), args.id)).collect();
    return presentation[0];  
  }
});


// updating tyhe presenation
export const updatePresentation = mutation({
  args: { id: "string", title: "string", description: "string" },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      title: args.title,
      description: args.description,
    });
  }
});


export const addSlide = mutation({
  args: { presentationId: "string", elements: "array" },
  handler: async (ctx, args) => {
    const presentation = await ctx.db.query("presentations").filter(q => q.eq(q.field("id"), args.presentationId)).collect();
    if (!presentation.length) {
      throw new Error("Presentation not found");
    }

    const newSlide = {
      slideNumber: presentation[0].slides.length + 1,
      elements: args.elements,
    };

    await ctx.db.patch(presentation[0].id, {
      slides: [...presentation[0].slides, newSlide],
      lastModified: new Date(),
    });

    return await ctx.db.query("presentations").filter(q => q.eq(q.field("id"), args.presentationId)).collect();
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

