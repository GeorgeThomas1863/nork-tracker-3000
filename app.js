//ON: SCRAPE COMMANDS

//TO DO:

//1. ADD IN THE TGDOC / descriptors to PICS, keep going
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

//set default file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.set("views", join(__dirname, "html"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

//have express render custom location of saved pics
app.use(CONFIG.expressPicPath, express.static(CONFIG.savePicPathBase));

app.use(routes);

db.dbConnect().then(() => {
  //port to listen

  app.listen(CONFIG.port);
});
