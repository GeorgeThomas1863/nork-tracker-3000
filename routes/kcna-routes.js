import express from "express";

import { indexDisplay, display404, display500 } from "../controllers/display.js";
import { parseCommand } from "../src/scrape-parse.js";

/**
 * Express router instance
 * @type {import('express').Router}
 */
const router = express.Router();

/**
 * POST route for handling scrape command submission from frontend
 * [sends req.body obj to parseCommand on the backend, sends response back to frontend]
 * @route POST /scrape-submit-route
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
router.post("/scrape-submit-route", parseCommand);

/**
 * Displays the index/home page, main route for displaying webapp / site
 * @route GET /
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
router.get("/", indexDisplay);

/**
 * 404 handler - catches requests to non-existent routes
 * @middleware
 */
router.use(display404);

/**
 * 500 error handler - catches internal server errors
 * @middleware
 */
router.use(display500);

export default router;
