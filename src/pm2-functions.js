//UNFUCK

// Helper function for API calls
export const callApi = async (endpoint, method = "GET") => {
  const response = await fetch(`/api/${endpoint}`, { method });
  return await response.json();
};

// Log action to UI
export const logAction = async (message) => {
  const logEl = document.getElementById("action-log");
  const timestamp = new Date().toISOString();
  logEl.innerHTML = `[${timestamp}] ${message}\n` + logEl.innerHTML;
};

// Update status display
export const updateStatus = async () => {
  try {
    const data = await callApi("worker/status");

    const statusEl = document.getElementById("status");
    statusEl.innerHTML = `
      <p>Process: <span class="${data.processRunning ? "online" : "offline"}">${data.pm2Status}</span></p>
      <p>Uptime: ${Math.floor(data.uptime / 60)} minutes</p>
      <p>Restarts: ${data.restarts}</p>
      <p>Currently Scraping: ${data.isRunning ? "Yes" : "No"}</p>
      <p>Last Run: ${data.lastRun || "Never"}</p>
      <p>Next Scheduled Run: ${data.nextScheduledRun || "Not scheduled"}</p>
      <p>Total Runs: ${data.runCount || 0}</p>
      ${data.lastRunStatus ? `<p>Last Run Status: ${data.lastRunStatus}</p>` : ""}
      ${data.lastError ? `<p>Last Error: ${data.lastError}</p>` : ""}
    `;
  } catch (error) {
    console.error("Error updating status:", error);
    logAction(`Error updating status: ${error.message}`);
  }
};

// Initialize
updateStatus();
setInterval(updateStatus, 10000); // Update every 10 seconds
