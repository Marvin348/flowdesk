import express from "express";
import { readDb } from "../utils/readDb.js";

const router = express.Router();

router.get("/", (req, res) => {
  const db = readDb();
  res.json(db.projects);
});

export default router;
