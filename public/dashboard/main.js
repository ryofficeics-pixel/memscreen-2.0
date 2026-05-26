const refreshBtn = document.getElementById("refreshBtn");
const scanBtn = document.getElementById("scanBtn");

const kpiTokens = document.getElementById("kpiTokens");
const kpiWatching = document.getElementById("kpiWatching");
const kpiAlerts = document.getElementById("kpiAlerts");

const sourceBody = document.getElementById("sourceBody");
const alertBody = document.getElementById("alertBody");
const tokenBody = document.getElementById("tokenBody");

function decisionPill(decision) {
  const cls = decision === "alert" ? "pill-alert" : decision === "watch" ? "pill-watch" : "pill-avoid";
  return `<span class="pill ${cls}">${decision}</span>`;
}

function shortAddress(addr) {
  if (!addr || addr.length < 10) return addr || "-";
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}

async function postJson(url) {
  const resp = await fetch(url, { method: "POST" });
  if (!resp.ok) throw new Error(`Request failed: ${resp.status}`);
  return resp.json();
}

async function approveAlert(id, action) {
  await postJson(`/alerts/${id}/${action}`);
  await loadData();
}

function renderSources(items) {
  sourceBody.innerHTML = items
    .slice(0, 8)
    .map(
      (row) => `
        <tr>
          <td>${row.sourceName}</td>
          <td class="${row.ok ? "ok" : "bad"}">${row.ok ? "yes" : "no"}</td>
          <td>${row.latencyMs} ms</td>
          <td>${row.tokenCount}</td>
        </tr>
      `
    )
    .join("");
}

function renderAlerts(items) {
  alertBody.innerHTML = items
    .slice(0, 12)
    .map(
      (row) => `
      <tr>
        <td>${row.id}</td>
        <td>${shortAddress(row.tokenAddress)}</td>
        <td>${row.status}</td>
        <td>
          <div class="action-row">
            <button class="mini-btn" data-id="${row.id}" data-action="approve">Approve</button>
            <button class="mini-btn" data-id="${row.id}" data-action="reject">Reject</button>
          </div>
        </td>
      </tr>`
    )
    .join("");

  alertBody.querySelectorAll("button[data-action]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = Number(btn.dataset.id);
      const action = btn.dataset.action;
      await approveAlert(id, action);
    });
  });
}

function renderTokens(items) {
  tokenBody.innerHTML = items
    .slice(0, 20)
    .map(
      (row) => `
      <tr>
        <td>${row.symbol}</td>
        <td>${shortAddress(row.address)}</td>
        <td>${decisionPill(row.decision)}</td>
        <td>${row.risk.riskScore}</td>
        <td>${row.opportunity.opportunityScore}</td>
        <td>${(row.evidence || []).slice(0, 3).join(", ")}</td>
      </tr>`
    )
    .join("");
}

async function loadData() {
  const resp = await fetch("/dashboard-data");
  if (!resp.ok) throw new Error(`dashboard-data ${resp.status}`);
  const data = await resp.json();

  kpiTokens.textContent = String(data.totals.tokensTracked ?? 0);
  kpiWatching.textContent = String(data.totals.watching ?? 0);
  kpiAlerts.textContent = String(data.totals.alertsNew ?? 0);

  renderSources(data.recentSources || []);
  renderAlerts(data.recentAlerts || []);
  renderTokens(data.topCandidates || []);
}

refreshBtn.addEventListener("click", async () => {
  refreshBtn.disabled = true;
  try {
    await loadData();
  } finally {
    refreshBtn.disabled = false;
  }
});

scanBtn.addEventListener("click", async () => {
  scanBtn.disabled = true;
  scanBtn.textContent = "Scanning...";
  try {
    await postJson("/scan/run");
    await loadData();
  } finally {
    scanBtn.disabled = false;
    scanBtn.textContent = "Run Scan";
  }
});

loadData().catch((error) => {
  console.error(error);
});
