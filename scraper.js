/**
 * @fileoverview Scheduler for scraping KCNA every hour
 * @module scraper
 *
 * Hourly scheduler that runs a series of scraping operations for getting articles and pictures from KCNA
 * and posts new ones to TG
 */

import { runScrapeArticles } from "./src/articles/articles-scrape.js";
import { runPostArticles } from "./src/articles/articles-post.js";
import { runScrapePics } from "./src/pics/pics-scrape.js";

console.log("AHHHHHHHHHHHHHHHHHHHHHHHHHHHHH");

/**
 * @function scrapeHourly
 * Schedules scraping function to run at the start of every hour.
 * First execution starts at the beginning of the next hour, then repeats hourly.
 *
 * @param {Function} scrapeFunction - The function to execute hourly
 * @returns {void}
 */
export const scrapeHourly = async (scrapeFunction) => {
  scrapeFunction();

  // Calculate time until the next hour
  const now = new Date();
  const nextHour = new Date(now);
  nextHour.setHours(now.getHours() + 1);
  nextHour.setMinutes(0);
  nextHour.setSeconds(0);
  nextHour.setMilliseconds(0);

  const timeUntilNextHour = nextHour - now;

  // Schedule the first task at the start of the next hour
  setTimeout(() => {
    scrapeFunction(); // Execute the task

    // Then set up an interval to run every hour (3600000 ms = 1 hour)
    setInterval(scrapeFunction, 3600000);
  }, timeUntilNextHour);

  console.log(`Scheduler initialized. Next execution scheduled at: ${nextHour.toISOString()}`);
};

/**
 * @function scrapeKCNA
 * Main function that executes all scraping operations in sequence.
 * Scrapes articles, posts articles, and scrapes pictures.
 *
 * @returns {Promise<void>} A promise that resolves when all scraping operations are complete
 */
export const scrapeKCNA = async () => {
  await runScrapeArticles();
  await runPostArticles();
  await runScrapePics();
  console.log("FINISHED SCRAPE");
};

// Export a function to run once
export const runOnce = async () => {
  await scrapeKCNA();
  return "FINISHED SCRAPE";
};

//PASS IN FUNCTION AS PARAM TO EXECUTE HOURLY
scrapeHourly(scrapeKCNA);
