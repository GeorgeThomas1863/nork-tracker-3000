import d from "./define-things.js";

// Define handler functions
const handleStartWorker = async () => {
  logAction("Starting worker...");
  try {
    const result = await callApi("worker/start", "POST");
    logAction(`Result: ${result.message}`);
    updateStatus();
  } catch (error) {
    logAction(`Error: ${error.message}`);
  }
};

const handleStopWorker = async () => {
  logAction("Stopping worker...");
  try {
    const result = await callApi("worker/stop", "POST");
    logAction(`Result: ${result.message}`);
    updateStatus();
  } catch (error) {
    logAction(`Error: ${error.message}`);
  }
};

const handleRestartWorker = async () => {
  logAction("Restarting worker...");
  try {
    const result = await callApi("worker/restart", "POST");
    logAction(`Result: ${result.message}`);
    updateStatus();
  } catch (error) {
    logAction(`Error: ${error.message}`);
  }
};

const handleRunNow = async () => {
  logAction("Triggering immediate scrape...");
  try {
    const result = await callApi("worker/run-now", "POST");
    logAction(`Result: ${result.message}`);
    updateStatus();
  } catch (error) {
    logAction(`Error: ${error.message}`);
  }
};

// Add event listeners
d.startWorkerButton.addEventListener("click", handleStartWorker);
d.stopWorkerButton.addEventListener("click", handleStopWorker);
d.restartWorkerButton.addEventListener("click", handleRestartWorker);
d.runNowButton.addEventListener("click", handleRunNow);
