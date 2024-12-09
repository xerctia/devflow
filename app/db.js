import Dexie from "dexie";

const db = new Dexie("pptDb");

db.version(1).stores({
  ppts: "++id, active, name",
  slides: "++id, pptId, bgcolor, name, slide_number",
  elements: "++id, slideId, type, x, y, width, height, borderRadius, fontSize, font, bgColor, textColor, selected, text",
});

export default db;
