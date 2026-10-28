const records = [];
const searchInput = document.querySelector("#search-input");
const agencyFilter = document.querySelector("#agency-filter");
const statusFilter = document.querySelector("#status-filter");
const resultCount = document.querySelector("#result-count");
const recordsGrid = document.querySelector("#records-grid");
const emptyState = document.querySelector("#empty-state");
const noResults = document.querySelector("#no-results");

const formatStatus = {
  putusan: "Putusan pengadilan",
  proses: "Dalam proses hukum",
  klarifikasi: "Klarifikasi / laporan"
};

function renderRecords() {
  const query = searchInput.value.trim().toLocaleLowerCase("id");
  const agency = agencyFilter.value;
  const status = statusFilter.value;

  const filtered = records.filter((record) => {
    const searchable = [record.name, record.position, record.agencyName, record.summary, record.caseType].join(" ").toLocaleLowerCase("id");
    return searchable.includes(query)
      && (agency === "all" || record.agency === agency)
      && (status === "all" || record.status === status);
  });

  recordsGrid.innerHTML = filtered.map((record) => `
    <article class="record-card">
      <div class="record-meta"><span>${escapeHtml(record.agencyName)}</span><span>${escapeHtml(record.updated)}</span></div>
      <h3>${escapeHtml(record.name)}</h3>
      <p>${escapeHtml(record.position)} · ${escapeHtml(record.caseType)}</p>
      <p>${escapeHtml(record.summary)}</p>
      <span class="status">${escapeHtml(formatStatus[record.status] || "Status belum ditetapkan")}</span>
      ${record.source ? `<a href="${escapeAttr(record.source)}" target="_blank" rel="noopener noreferrer">Periksa sumber ↗</a>` : ""}
    </article>
  `).join("");

  const hasRecords = records.length > 0;
  emptyState.hidden = hasRecords;
  noResults.hidden = !hasRecords || filtered.length > 0;
  recordsGrid.hidden = filtered.length === 0;
  resultCount.textContent = hasRecords
    ? `${filtered.length} CATATAN DARI ${records.length} PROFIL`
    : "ARSIP DALAM PENGEMBANGAN";
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function escapeAttr(value = "") {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? escapeHtml(url.href) : "#";
  } catch {
    return "#";
  }
}

[searchInput, agencyFilter, statusFilter].forEach((control) => {
  control.addEventListener("input", renderRecords);
  control.addEventListener("change", renderRecords);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === "Escape" && document.activeElement === searchInput) {
    searchInput.value = "";
    renderRecords();
    searchInput.blur();
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();
document.querySelector("#today-label").textContent = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit", month: "short", year: "numeric"
}).format(new Date()).toUpperCase();

renderRecords();