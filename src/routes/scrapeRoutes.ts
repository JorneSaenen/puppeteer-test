import express from "express";
import { scrape } from "../controllers/scrapeController";

const router = express.Router();

router.get("/", scrape);

export default router;
