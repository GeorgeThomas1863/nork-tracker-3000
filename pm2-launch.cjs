const apps = [
  {
    name: "app",
    script: "app.js",
  },
  {
    name: "scraper-worker",
    script: "worker.js",
    instances: 1,
    watch: false,
    env: {
      NODE_ENV: "production",
      lastScrapeTime: "Not yet run",
    },
    // Add this to enable custom actions
    actions: {
      "run-scrape": {
        description: "Run scrape immediately",
        action: "run-scrape",
      },
    },
  },
];

module.exports = { apps: apps };
