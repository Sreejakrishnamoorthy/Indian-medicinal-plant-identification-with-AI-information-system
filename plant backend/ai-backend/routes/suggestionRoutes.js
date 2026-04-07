import express from "express";
import { saveSuggestion, getSuggestions } from "../controllers/suggestionController.js";

const router = express.Router();

router.post("/", saveSuggestion);
router.get("/", getSuggestions);

export default router;
