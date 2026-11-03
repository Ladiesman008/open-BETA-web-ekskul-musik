// ==========================================
// TAMBAHAN FITUR (tidak mengubah script.js)
//  1. Mode gelap / terang
//  2. Menu Jadwal latihan + latihan di studio luar
//  3. Menu Daftar lagu & chord (data ada di lagu.js)
//  4. Tombol intip password
// ==========================================
(function () {
  'use strict';

  const q = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

  // ==========================================
  // 1. MODE GELAP / TERANG
  // ==========================================
  const TEMA_KEY = 'ekskul_tema';

  function setTema(t, simpan) {
    document.documentElement.setAttribute('data-theme', t);

    const b = q('#tema-btn');
    if (b) b.setAttribute('aria-pressed', String(t === 'dark'));

    const meta = q('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'dark' ? '#15161a' : '#eeebe6');

    if (simpan) {
      try { localStorage.setItem(TEMA_KEY, t); } catch (e) {}
    }
  }

  function pasangTema() {
    const sekarang = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    setTema(sekarang, false);

    const b = q('#tema-btn');
    if (!b) return;
    b.addEventListener('click', () => {
      const gelap = document.documentElement.getAttribute('data-theme') === 'dark';
      setTema(gelap ? 'light' : 'dark', true);
    });
  }

  // ==========================================
  // 2. JADWAL LATIHAN
  // Ubah jadwal di sini jika suatu saat berubah.
  // hari: 0=Minggu, 1=Senin, ... 5=Jumat, 6=Sabtu
  // ==========================================
  const JADWAL = [
    { hari: 1, nama: 'Senin', mulai: [15, 30], selesai: [17, 0], lokasi: 'Latihan bersama di sekolah' },
    { hari: 5, nama: 'Jumat', mulai: [15, 30], selesai: [17, 0], lokasi: 'Latihan bersama di sekolah' }
  ];

  // Daftar studio untuk latihan di luar sekolah.
  // Isi sendiri setelah survei / tanya langsung ke studionya, contoh:
  // { nama: 'Nama Studio', alamat: 'Alamat lengkap', tarif: 'Rp xx.xxx / jam', kontak: '08xxxxxxxxxx' }
  const STUDIO = [];

  // Pusat pencarian = lokasi SMK BPP (Jl. Van Deventer No.14, Bandung)
  const URL_PETA = 'https://www.google.com/maps/search/studio+musik/@-6.917,107.6159,16z';

  const jam = a => String(a[0]) + '.' + String(a[1]).padStart(2, '0');
  const rentang = j => jam(j.mulai) + ' – ' + jam(j.selesai) + ' WIB';

  // Hari dan jam sekarang menurut WIB, apa pun zona waktu perangkat.
  function wibSekarang() {
    const p = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Jakarta', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false
    }).formatToParts(new Date());
    const ambil = t => p.find(x => x.type === t).value;
    const peta = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    let h = Number(ambil('hour'));
    if (h === 24) h = 0;
    return { hari: peta[ambil('weekday')], menit: h * 60 + Number(ambil('minute')) };
  }

  // Mengembalikan teks status latihan untuk waktu tertentu.
  function statusJadwal(now) {
    const mnt = a => a[0] * 60 + a[1];

    for (const j of JADWAL) {
      if (j.hari !== now.hari) continue;
      if (now.menit >= mnt(j.mulai) && now.menit < mnt(j.selesai))
        return 'Latihan sedang berlangsung sampai ' + jam(j.selesai) + ' WIB.';
      if (now.menit < mnt(j.mulai))
        return 'Hari ini ada latihan, mulai pukul ' + jam(j.mulai) + ' WIB.';
    }

    let terbaik = null;
    for (const j of JADWAL) {
      let selisih = (j.hari - now.hari + 7) % 7;
      if (selisih === 0) selisih = 7; // hari ini sudah lewat
      if (!terbaik || selisih < terbaik.selisih) terbaik = { j, selisih };
    }
    if (!terbaik) return '';

    const kapan = terbaik.selisih === 1 ? 'besok' : terbaik.selisih + ' hari lagi';
    return 'Latihan berikutnya: ' + terbaik.j.nama + ' (' + kapan + '), pukul ' + rentang(terbaik.j) + '.';
  }

  function renderJadwal() {
    const now = wibSekarang();

    const next = q('#jadwal-next');
    if (next) next.textContent = statusJadwal(now);

    const grid = q('#jadwal-grid');
    if (grid) {
      grid.innerHTML = JADWAL.map(j => `
        <div class="jadwal-item inset${j.hari === now.hari ? ' today' : ''}">
          <span class="hari">${esc(j.nama)}</span>
          <b class="jam">${esc(rentang(j))}</b>
          <span class="lokasi">${esc(j.lokasi)}</span>
          ${j.hari === now.hari ? '<span class="badge">Hari ini</span>' : ''}
        </div>
      `).join('');
    }
  }

  function renderStudio() {
    const btn = q('#btn-studio');
    if (btn) btn.href = URL_PETA;

    const box = q('#studio-list');
    if (!box) return;

    box.innerHTML = STUDIO.map(s => `
      <div class="studio inset">
        <b>${esc(s.nama)}</b>
        <p>${esc(s.alamat || '')}</p>
        ${s.tarif ? `<p>Tarif: ${esc(s.tarif)}</p>` : ''}
        ${s.kontak ? `<p>Kontak: ${esc(s.kontak)}</p>` : ''}
      </div>
    `).join('');
  }

  // ==========================================
  // 3. DAFTAR LAGU & CHORD
  // ==========================================
  function chordHTML(teks) {
    return String(teks || '').split(/\s+/).filter(Boolean).map(c =>
      c === '|' ? '<span class="bar" aria-hidden="true"></span>' : `<span class="chord">${esc(c)}</span>`
    ).join('');
  }

  function renderLagu() {
    const box = q('#lagu-list');
    if (!box) return;

    const data = typeof LAGU !== 'undefined' && Array.isArray(LAGU) ? LAGU : [];
    const kata = (q('#lagu-cari')?.value || '').trim().toLowerCase();

    const hasil = data.filter(l =>
      [l.judul, l.pencipta, l.divisi, l.tingkat, l.kunci].join(' ').toLowerCase().includes(kata)
    );

    if (!hasil.length) {
      box.innerHTML = '<p class="muted center">' +
        (data.length ? 'Tidak ada lagu yang cocok.' : 'Belum ada lagu. Isi daftar lagu di file lagu.js.') + '</p>';
      return;
    }

    box.innerHTML = hasil.map(l => `
      <details class="lagu inset">
        <summary>
          <span>
            <span class="lagu-judul">${esc(l.judul)}</span>
            <span class="lagu-sub">${esc(l.pencipta || '')}</span>
          </span>
        </summary>
        <div class="lagu-body">
          <div class="tags">
            ${l.divisi ? `<span class="tag">${esc(l.divisi)}</span>` : ''}
            ${l.kunci ? `<span class="tag">Kunci ${esc(l.kunci)}</span>` : ''}
            ${l.tingkat ? `<span class="tag">${esc(l.tingkat)}</span>` : ''}
          </div>
          ${(l.bagian || []).map(b => `
            <div class="bagian">
              <h4>${esc(b.nama)}</h4>
              <div class="chords">${chordHTML(b.chord)}</div>
            </div>
          `).join('')}
          ${l.catatan ? `<p class="lagu-catatan">${esc(l.catatan)}</p>` : ''}
        </div>
      </details>
    `).join('');
  }

  // ==========================================
  // 4. INTIP PASSWORD
  // ==========================================
  const IKON_MATA =
    '<svg class="ic-on" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>' +
    '<svg class="ic-off" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.9 17.9A10.1 10.1 0 0 1 12 19c-6.4 0-10-7-10-7a17.7 17.7 0 0 1 4.1-5.1M9.9 5.2A9.7 9.7 0 0 1 12 5c6.4 0 10 7 10 7a17.8 17.8 0 0 1-2.2 3.2"/><path d="M14.1 14.1a3 3 0 0 1-4.2-4.2"/><path d="M2 2l20 20"/></svg>';

  function pasangIntipPassword() {
    document.querySelectorAll('input[type="password"]').forEach(inp => {
      if (inp.dataset.intip) return;
      inp.dataset.intip = '1';

      const bungkus = document.createElement('div');
      bungkus.className = 'pw-wrap';
      inp.parentNode.insertBefore(bungkus, inp);
      bungkus.append(inp);

      const tombol = document.createElement('button');
      tombol.type = 'button';
      tombol.className = 'pw-eye';
      tombol.setAttribute('aria-label', 'Tampilkan password');
      tombol.setAttribute('aria-pressed', 'false');
      tombol.innerHTML = IKON_MATA;
      bungkus.append(tombol);

      const atur = tampil => {
        inp.type = tampil ? 'text' : 'password';
        tombol.setAttribute('aria-pressed', String(tampil));
        tombol.setAttribute('aria-label', tampil ? 'Sembunyikan password' : 'Tampilkan password');
      };

      // supaya kolom tidak kehilangan fokus saat tombol ditekan
      tombol.addEventListener('mousedown', e => e.preventDefault());
      tombol.addEventListener('click', () => {
        atur(inp.type === 'password');
        inp.focus();
      });

      // setelah form dikirim / direset, password kembali tersembunyi
      inp.form?.addEventListener('reset', () => atur(false));
    });
  }

  // ==========================================
  // MULAI
  // ==========================================
  function mulai() {
    pasangTema();
    renderJadwal();
    renderStudio();
    renderLagu();
    pasangIntipPassword();

    q('#lagu-cari')?.addEventListener('input', renderLagu);

    // perbarui status jadwal tiap menit
    setInterval(renderJadwal, 60000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mulai);
  } else {
    mulai();
  }
})();
