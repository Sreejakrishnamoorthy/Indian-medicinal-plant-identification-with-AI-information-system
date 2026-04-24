import express from "express";
import { getPlantInfo } from "../controllers/aiController.js";

const router = express.Router();

router.post("/generate", getPlantInfo);

export default router;
