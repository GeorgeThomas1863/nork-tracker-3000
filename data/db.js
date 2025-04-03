import { MongoClient } from "mongodb";
import CONFIG from "../config/scrape-config.js";

let db;

//returns promise so make connection async function
export const dbConnect = async () => {
  //connect to mongo server
  const client = await MongoClient.connect("mongodb://localhost:27017");
  db = client.db(CONFIG.dbName);
};

//create function to call database outside file
export const dbGet = () => {
  //ensure db connection is working
  if (!db) {
    throw { message: "Database connection fucked" };
  }
  return db;
};
