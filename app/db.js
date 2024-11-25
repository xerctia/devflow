import Dexie from "dexie";

const db = new Dexie("pptDb");

db.version(1).stores({
  ppts: "++id, active, name",
  slides: "++id, pptId, bgcolor, name, slide_number",
});

export default db;
