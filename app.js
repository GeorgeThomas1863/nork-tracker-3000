//TO DO:

//1. Get AUTO scraper re-working
//1. MASSIVE REFACTOR NEEDED (remake as models)
//1. add in password to site / add auth

//1. get pull single url WORKING
//1. reset up auto scraper, have an on off switch

//1. style submit button better, make bigger put in middle
//1. return correct display when NO data exists
//1. add some sort of "getting data / loading" screen
//1. fix the "cannot read properties of null (reading "getAttribute") [whenits trying to pull pics]

/**
 * @fileoverview Main application entry point for the KCNA scraping service
 * @module app
 *
 * Initializes Express server, connects to MongoDB, and sets up routes.
 * Configures view engine, middleware, and static file serving.
 */

import { dirname, join } from "path";
import { fileURLToPath } from "url";

import express from "express";
// import session from "express-session";

import CONFIG from "./config/scrape-config.js";
import routes from "./routes/kcna-routes.js";
import * as db from "./data/db.js";

//TURN BACK ON
//imports and EXECUTES auto scraper (by not setting to a variable just exeuctes file, per claude)
// import "./src/scrape-auto.js";

/**
 * Get / define the path / directory for the current project
 * @type {string}
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Express application instance
 * @type {import('express').Application}
 */
const app = express();

app.set("views", join(__dirname, "html"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

/**
 * Configure / set custom express static path for pictures on file system
 * (simplifies uploading / downloading pics)
 */
app.use(CONFIG.expressPicPath, express.static(CONFIG.savePicPathBase));
app.use(routes);

/**
 * Connect to database and start the server if db works
 * @listens {number} CONFIG.port - Port number from configuration
 */
db.dbConnect().then(() => {
  //port to listen
  app.listen(CONFIG.port);
});
