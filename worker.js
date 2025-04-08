import { runScrapeArticles } from "./articles/articles-scrape.js";
import { runPostArticles } from "./articles/articles-post.js";
import { runScrapePics } from "./pics/pics-scrape.js";

console.log("Worker process started");

// Main scraping function
const scrapeKCNA = async () => {
  try {
    console.log("Starting scrape at:", new Date().toISOString());
    await runScrapeArticles();
    await runPostArticles();
    await runScrapePics();
    console.log("FINISHED SCRAPE:", new Date().toISOString());
  } catch (error) {
    console.error("Error during scrape:", error);
  }
};

// Run immediately on startup
scrapeKCNA();

// Schedule to run at the start of every hour
const scheduleNextRun = () => {
  const now = new Date();
  const nextHour = new Date(now);
  nextHour.setHours(now.getHours() + 1);
  nextHour.setMinutes(0);
  nextHour.setSeconds(0);
  nextHour.setMilliseconds(0);

  const timeUntilNextHour = nextHour - now;

  console.log(`Next scrape scheduled for: ${nextHour.toISOString()}`);

  setTimeout(() => {
    scrapeKCNA();
    scheduleNextRun(); // Schedule the next run after completing this one
  }, timeUntilNextHour);
};

// Set up the recurring schedule
scheduleNextRun();
