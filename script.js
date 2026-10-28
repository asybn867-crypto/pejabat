const records = [
  {
    id: "AP-001",
    name: "Dr. Mukhtar Tahir",
    position: "Mantan Kepala Dinas Sosial Kota Makassar",
    agency: "dinsos",
    agencyName: "Dinas Sosial Kota Makassar",
    status: "putusan",
    caseType: "Korupsi pengadaan bansos COVID-19 TA 2020",
    summary: "Pada 30 September 2025, Kejaksaan Tinggi Sulawesi Selatan memberitakan bahwa majelis hakim menjatuhkan pidana 4 tahun penjara, denda Rp100 juta, serta uang pengganti Rp150 juta. Status upaya hukum terakhir belum diverifikasi.",
    updated: "Putusan diberitakan 30 Sep 2025",
    source: "https://kejati-sulawesiselatan.kejaksaan.go.id/conference/news/8413/read",
    education: [
      "S1 Ilmu Komunikasi — Universitas Hasanuddin (1987–1990; tercantum di profil LinkedIn)",
      "Doktor Administrasi Publik — Universitas Negeri Makassar (2011–2014; tercantum di profil LinkedIn)"
    ],
    career: [
      "Kepala Seksi Pengawasan dan Penyuluhan, Dinas Perindustrian, Perdagangan dan Penanaman Modal Kota Makassar (2004–2005)",
      "Kasubag Dokumentasi Bagian Humas, Sekretariat Daerah Kota Makassar (sekitar 2005–2007)",
      "Kabid Pengembangan Sumber Daya Pemuda, Dinas Pemuda dan Olahraga Kota Makassar (2008–2010)",
      "Kabag Humas Pemerintah Kota Makassar (sekitar 2010–2012; tahun pada profil publik tidak sepenuhnya konsisten)",
      "Kepala Dinas Komunikasi dan Informatika Kota Makassar (2015–2016)",
      "Sekretaris Dinas Sosial Kota Makassar (2016)",
      "Kepala Dinas Sosial Kota Makassar (mulai 2016; kembali dilantik pada 2019)",
      "Plt. Kepala Dinas Pendidikan Kota Makassar (2018)",
      "Profil media pada 2024 menyebut ia bertugas sebagai PNS pelaksana di Bagian Umum Sekretariat Daerah Kota Makassar"
    ],
    bioSource: "https://id.linkedin.com/in/mukhtar-tahir-93bb6110b",
    careerSource: "https://beritakotamakassar.com/2024/11/15/status-asn-di-ujung-tanduk/"
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
  putusan: "Diputus bersalah · status akhir belum diverifikasi",
  proses: "Dalam proses hukum",
  klarifikasi: "Laporan / dugaan — belum berarti bersalah"
};

function renderRecords() {
  const query = searchInput.value.trim().toLocaleLowerCase("id");
  const agency = agencyFilter.value;
  const status = statusFilter.value;

  const filtered = records.filter((record) => {
    const searchable = [record.name, record.position, record.agencyName, record.summary, record.caseType, ...(record.education || []), ...(record.career || [])].join(" ").toLocaleLowerCase("id");
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
      <button class="bio-toggle" type="button" aria-expanded="false" data-bio-toggle="${escapeHtml(record.id)}">Lihat riwayat hidup <span aria-hidden="true">＋</span></button>
      <section class="bio-panel" data-bio-panel="${escapeHtml(record.id)}" hidden>
        <h4>Pendidikan</h4>
        <ul>${(record.education || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        <h4>Riwayat jabatan</h4>
        <ul>${(record.career || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        <p class="bio-note">Catatan: sebagian riwayat pendidikan dan jabatan bersumber dari profil LinkedIn yang mencantumkan informasi tersebut sendiri, bukan dokumen kepegawaian resmi. Beberapa rentang tahun perlu diverifikasi. Ini ringkasan rekam jejak publik, bukan CV resmi.</p>
        <a href="${escapeAttr(record.bioSource)}" target="_blank" rel="noopener noreferrer">Sumber riwayat pendidikan/jabatan ↗</a>
        <a href="${escapeAttr(record.careerSource)}" target="_blank" rel="noopener noreferrer">Sumber tambahan tentang status/jabatan ↗</a>
      </section>
      ${record.source ? `<a href="${escapeAttr(record.source)}" target="_blank" rel="noopener noreferrer">Baca sumber resmi perkara ↗</a>` : ""}
    </article>
  `).join("");

  const hasRecords = records.length > 0;
  emptyState.hidden = hasRecords;
  noResults.hidden = !hasRecords || filtered.length > 0;
  recordsGrid.hidden = filtered.length === 0;
  resultCount.textContent = hasRecords
    ? `${filtered.length} CATATAN DARI ${records.length} PEJABAT`
    : "ARSIP DALAM PENGEMBANGAN";
}

recordsGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-bio-toggle]");
  if (!button) return;
  const panel = recordsGrid.querySelector(`[data-bio-panel="${button.dataset.bioToggle}"]`);
  const isOpen = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", String(!isOpen));
  panel.hidden = isOpen;
  button.querySelector("span").textContent = isOpen ? "＋" : "−";
  button.firstChild.textContent = isOpen ? "Lihat riwayat hidup " : "Tutup riwayat hidup ";
});

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