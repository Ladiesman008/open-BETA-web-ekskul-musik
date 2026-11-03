// ==========================================
// DAFTAR LAGU & CHORD EKSKUL MUSIK
// File ini khusus untuk data lagu. Ubah di sini, tanpa menyentuh file lain.
//
// Cara menambah lagu: salin satu blok { ... } lalu ubah isinya.
//   judul    : judul lagu
//   pencipta : pencipta / artis
//   divisi   : Musik Modern, Musik Tradisional, Olah Vokal, atau Semua Divisi
//   kunci    : nada dasar (boleh dikosongkan dengan '')
//   tingkat  : Dasar / Menengah / Lanjut
//   bagian   : daftar bagian lagu. Tiap bagian punya nama dan chord.
//              Pisahkan chord dengan spasi. Tanda | = batas birama.
//   catatan  : tips latihan (boleh dikosongkan dengan '')
//
// Isi di bawah ini adalah CONTOH latihan dasar supaya halaman tidak kosong.
// Silakan ganti dengan lagu yang benar-benar dipelajari ekskul.
// Hanya tulis chord, jangan tempel lirik lagu (hak cipta).
// ==========================================

const LAGU = [
  {
    judul: 'Canon in D',
    pencipta: 'Johann Pachelbel',
    divisi: 'Musik Modern',
    kunci: 'D',
    tingkat: 'Menengah',
    bagian: [
      { nama: 'Progresi utama (diulang terus)', chord: 'D | A | Bm | F#m | G | D | G | A' }
    ],
    catatan: 'Cocok untuk melatih perpindahan chord yang rapi. F#m dan Bm biasanya dimainkan dengan barre.'
  },
  {
    judul: 'Latihan Progresi Pop (I–V–vi–IV)',
    pencipta: 'Materi latihan',
    divisi: 'Musik Modern',
    kunci: 'C',
    tingkat: 'Dasar',
    bagian: [
      { nama: 'Pola dasar', chord: 'C | G | Am | F' },
      { nama: 'Versi kunci G', chord: 'G | D | Em | C' }
    ],
    catatan: 'Pola ini dipakai di sangat banyak lagu pop. Latih sampai perpindahan chord lancar sebelum menambah kecepatan.'
  },
  {
    judul: 'Latihan Progresi Klasik (I–vi–IV–V)',
    pencipta: 'Materi latihan',
    divisi: 'Musik Modern',
    kunci: 'C',
    tingkat: 'Dasar',
    bagian: [
      { nama: 'Pola dasar', chord: 'C | Am | F | G' }
    ],
    catatan: 'Bagus untuk latihan kekompakan tempo antara gitar, bass, keyboard, dan drum.'
  },
  {
    judul: '12 Bar Blues',
    pencipta: 'Pola tradisional blues',
    divisi: 'Musik Modern',
    kunci: 'A',
    tingkat: 'Menengah',
    bagian: [
      { nama: 'Satu putaran (12 birama)', chord: 'A7 | A7 | A7 | A7 | D7 | D7 | A7 | A7 | E7 | D7 | A7 | E7' }
    ],
    catatan: 'Latihan improvisasi dan dinamika. Setiap pemain bergantian mengisi solo satu putaran.'
  }
];
