const records = [
  {
    id: "AP-001",
    name: "Andi Bukti Djufrie",
    position: "Kepala Dinas Sosial Kota Makassar",
    agency: "dinsos",
    agencyName: "Dinas Sosial Kota Makassar",
    status: "profil",
    caseType: "Profil jabatan",
    summary: "Tercatat sebagai Kepala Dinas Sosial Kota Makassar dalam laman resmi Pemerintah Kota Makassar dan pemberitaan kegiatan dinas pada 2026. Profil ini memuat jabatan publik, bukan tuduhan perkara.",
    updated: "Diperiksa Okt 2026",
    source: "https://www.makassarkota.go.id/pimpinan"
  },
  {
    id: "AP-002",
    name: "Dr. Mukhtar Tahir",
    position: "Mantan Kepala Dinas Sosial Kota Makassar",
    agency: "dinsos",
    agencyName: "Dinas Sosial Kota Makassar",
    status: "putusan",
    caseType: "Perkara korupsi bansos COVID-19 TA 2020",
    summary: "Kejati Sulawesi Selatan memberitakan bahwa pada 30 September 2025 pengadilan menjatuhkan pidana 4 tahun penjara, denda Rp100 juta, serta uang pengganti Rp150 juta. Ini adalah putusan yang diberitakan pada tanggal tersebut; status upaya hukum terakhir belum diverifikasi di arsip ini.",
    updated: "Putusan diberitakan 30 Sep 2025",
    source: "https://kejati-sulawesibarat.kejaksaan.go.id/conference/news/8413/read"
  }
];

const searchInput = document.querySelector("#search-input");
const agencyFilter = document.querySelector("#agency-filter");
const statusFilter = document.querySelector("#status-filter");
const resultCount = document.querySelector("#result-count");
const recordsGrid = document.querySelector("#records-grid");
const emptyState = document.querySelector("#empty-state");
const noResults = document.querySelector("#no-results");

const formatStatus = {
  profil: "Profil jabatan · sumber resmi",
  putusan: "Putusan pengadilan diberitakan",
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
      <p class="record-id">${escapeHtml(record.id)}</p>
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