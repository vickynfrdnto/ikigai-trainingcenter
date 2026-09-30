{
    id: "K-04-A",
    title: "1. Cara Baca Dashboard",
    url: "/videos/User_Guide_Dashboard.mp4",
    category: "User Guide",
    roleAccess: ["KASIR", "SUPERVISOR"],
    isSoon: false,
    desc: "Memahami tampilan schedule dan analisis potensi booking.",
    quiz: [
      { q: "Apa fungsi utama halaman Schedule?", a: "Memantau jadwal reservasi harian", options: ["Edit harga menu", "Memantau jadwal reservasi harian", "Absen karyawan"] },
      { q: "Di sebelah mana panel 'Potensi Booking' berada?", a: "Sisi kiri halaman", options: ["Sisi kanan halaman", "Sisi kiri halaman", "Bagian bawah"] },
      { q: "Apa yang dianalisis oleh panel Potensi Booking?", a: "Ketersediaan slot waktu otomatis", options: ["Jumlah pendapatan harian", "Ketersediaan slot waktu otomatis", "Daftar stok barang"] },
      { q: "Range waktu apa saja yang muncul di Potensi Booking?", a: "30 hingga 180 menit", options: ["10 hingga 60 menit", "30 hingga 180 menit", "Hanya 60 menit"] },
      { q: "Apa kegunaan utama analisis Potensi Booking bagi kasir?", a: "Memberikan respon cepat ke pelanggan", options: ["Memberikan respon cepat ke pelanggan", "Menghitung gaji terapis", "Melihat history transaksi"] },
      { q: "Bagaimana cara memilih waktu reservasi?", a: "Klik pada slot waktu yang tersedia", options: ["Ketik manual jamnya", "Klik pada slot waktu yang tersedia", "Telepon IT Support"] },
      { q: "Apakah sistem memungkinkan penyesuaian waktu khusus?", a: "Ya, untuk permintaan khusus pelanggan", options: ["Tidak, harus sesuai sistem", "Ya, untuk permintaan khusus pelanggan", "Hanya supervisor yang bisa"] },
      { q: "Apa yang harus dilakukan jika otentikasi login gagal?", a: "Input Username & Password dengan presisi", options: ["Input Username & Password dengan presisi", "Klik tombol lupa password", "Tutup aplikasi"] },
      { q: "Apa tujuan sinkronisasi data pada dashboard?", a: "Menjamin integritas data operasional", options: ["Menghemat baterai komputer", "Menjamin integritas data operasional", "Mempercepat koneksi internet"] },
      { q: "Apa yang ditampilkan setelah login berhasil?", a: "Halaman Schedule", options: ["Halaman Laporan", "Halaman Schedule", "Halaman Inventaris"] }
    ]
  },
  {
    id: "K-04-B",
    title: "2. Tambah Booking",
    url: "/videos/User_Guide_Tambah_Booking.mp4",
    category: "User Guide",
    roleAccess: ["KASIR", "SUPERVISOR"],
    isSoon: false,
    desc: "Prosedur pendaftaran member baru, booking grup, dan konfirmasi.",
    quiz: [
      { q: "Ikon apa yang diklik untuk daftar customer baru?", a: "Ikon Tambah Customer Baru", options: ["Ikon Edit", "Ikon Tambah Customer Baru", "Ikon Logout"] },
      { q: "Data apa yang wajib diisi untuk member baru?", a: "Nama, Phone, Jenis Kelamin, & Status Member", options: ["Nama & Alamat saja", "Nama, Phone, Jenis Kelamin, & Status Member", "Hanya nomor telepon"] },
      { q: "Kenapa tombol 'Status Member' wajib diklik?", a: "Agar pelanggan dapat keuntungan member", options: ["Agar aplikasi tidak error", "Agar pelanggan dapat keuntungan member", "Sebagai formalitas saja"] },
      { q: "Tombol apa yang diklik jika tamu datang berdua?", a: "Tambah Booking", options: ["Tambah Booking", "Edit Booking", "Submit Booking"] },
      { q: "Kapan tombol 'Tambah Booking' digunakan?", a: "Saat reservasi lebih dari satu orang", options: ["Saat ingin ganti menu", "Saat reservasi lebih dari satu orang", "Saat ingin membatalkan"] },
      { q: "Apa fungsi fitur 'Edit Booking'?", a: "Penyesuaian jadwal atau detail layanan", options: ["Menghapus akun tamu", "Penyesuaian jadwal atau detail layanan", "Mencetak struk"] },
      { q: "Apa yang dilakukan setelah klik 'Save Changes'?", a: "Verifikasi data dan pastikan tamu ready", options: ["Langsung tutup aplikasi", "Verifikasi data dan pastikan tamu ready", "Hapus booking"] },
      { q: "Kapan tombol 'Konfirmasi' diklik?", a: "Saat tamu sudah siap memulai layanan", options: ["Saat tamu baru telepon", "Saat tamu sudah siap memulai layanan", "Saat tamu sudah pulang"] },
      { q: "Apa arti status 'Cancel Booking'?", a: "Prosedur pembatalan reservasi", options: ["Prosedur pembatalan reservasi", "Penundaan jam layanan", "Memberikan diskon"] },
      { q: "Setelah Submit Booking, data tersinkron ke mana?", a: "Jadwal utama secara real-time", options: ["WhatsApp pemilik", "Jadwal utama secara real-time", "Email kasir"] }
    ]
  },
  {
    id: "K-04-C",
    title: "3. Detail Operasional (Terapis & Menu)",
    url: "/videos/User_Guide_Operasional.mp4",
    category: "User Guide",
    roleAccess: ["KASIR", "SUPERVISOR"],
    isSoon: false,
    desc: "Pengaturan jadwal terapis, menu spesial, dan manajemen ruangan.",
    quiz: [
      { q: "Apa arti kode 'P' dan 'S' pada jadwal terapis?", a: "Pagi dan Siang", options: ["Pagi dan Siang", "Pria dan Spesial", "Pulang dan Standby"] },
      { q: "Ke mana posisi staf 'Tidak Masuk' di list Absen?", a: "Urutan paling bawah", options: ["Urutan paling atas", "Dihapus dari list", "Urutan paling bawah"] },
      { q: "Kenapa staf yang Terlambat pindah ke urutan terakhir?", a: "Menjaga keadilan distribusi tugas", options: ["Sistem sedang error", "Menjaga keadilan distribusi tugas", "Instruksi dari pusat"] },
      { q: "Berapa menit 'Waktu Prepare' sebelum treatment?", a: "15 menit", options: ["5 menit", "10 menit", "15 menit"] },
      { q: "Berapa total waktu untuk treatment 120 menit?", a: "155 menit", options: ["120 menit", "140 menit", "155 menit"] },
      { q: "Apa arti tanda ceklis di halaman Treatment?", a: "Terapis sudah menguasai menu spesial", options: ["Terapis sedang libur", "Terapis sudah menguasai menu spesial", "Menu sedang diskon"] },
      { q: "Apa yang harus diisi saat tambah Kategori Ruangan?", a: "Nama Kategori & Alias Kategori", options: ["Nama Kategori & Alias Kategori", "Luas & Warna Ruang", "Harga Sewa"] },
      { q: "Bagaimana alokasi ruangan di sistem booking?", a: "Otomatis ditentukan oleh sistem", options: ["Admin pilih manual", "Otomatis ditentukan oleh sistem", "Tamu pilih sendiri"] },
      { q: "Di cabang mana daftar terapis ini dikelola?", a: "Alam Sutera", options: ["Alam Sutera", "BSD", "Gading Serpong"] },
      { q: "Apa fungsi menu 'Edit' pada jadwal masuk?", a: "Mengatur jadwal kerja secara spesifik", options: ["Mengubah gaji", "Mengatur jadwal kerja secara spesifik", "Menghapus data terapis"] }
    ]
  },