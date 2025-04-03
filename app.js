//TO DO:

//1. FOR BACKEND JS Functions, add in the function name to Jsdocs, take out the fucnt separators
//1. ADD in JSDOCS to models; db file; controller files
//1. Figure out TG display !!!!!!!!

//1. get pull single url WORKING
//1. reset up auto scraper, have an on off switch

//1. return correct display when NO data exists
//1. add some sort of "getting data / loading" screen
//1. fix the "cannot read properties of null (reading "getAttribute") [whenits trying to pull pics]

import { dirname, join } from "path";
import { fileURLToPath } from "url";

import express from "express";
// import session from "express-session";

import CONFIG from "./config/scrape-config.js";
import routes from "./routes/kcna-routes.js";
import * as db from "./data/db.js";

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
  // app.listen("1851");
});
