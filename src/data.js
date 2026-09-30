  // src/data.js
  export const ACCESS_CODES = {
    USER: "IKIGAI-MEMBER",
    ADMIN: "IKIGAI-ADMIN-2026"
  };

  export const playlistData = [
    // ==========================================
    // KASIR - SOP
    // ==========================================
    {
      id: "SOP-K-01",
      title: "Pembelajaran Mandiri Value Kasir IKIGAI",
      url: "/videos/01. Pembelajaran Mandiri Value Kasir Ikigai.mp4",
      category: "SOP",
      roleAccess: ["KASIR", "SUPERVISOR"],
      isSoon: false,
      desc: "Mengenal budaya kerja, visi perusahaan, dan tanggung jawab utama Kasir di IKIGAI.",
      quiz: [
        { 
          q: "Saat kondisi kasir sedang ramai dan antrean mulai panjang, tindakan yang paling mencerminkan value 'Bersih, tenang dan nyaman' adalah…", 
          a: "Tetap tenang, berbicara jelas, dan menjaga area tetap rapi", 
          options: ["Mengabaikan kerapihan demi kecepatan", "Mempercepat pelayanan tanpa memperhatikan sikap", "Tetap tenang, berbicara jelas, dan menjaga area tetap rapi", "Meminta tamu menunggu tanpa penjelasan"] 
        },
        { 
          q: "Tamu datang dan terlihat ragu memilih treatment. Sikap kasir yang paling sesuai dengan value 'Ramah, hangat, tulus, empati dan profesional' adalah…", 
          a: "Menanyakan kebutuhan tamu dan memberi rekomendasi dengan ramah", 
          options: ["Menanyakan kebutuhan tamu dan memberi rekomendasi dengan ramah", "Menunggu tamu memilih sendiri", "Menyuruh tamu membaca menu sendiri", "Langsung menawarkan paket termahal"] 
        },
        { 
          q: "Area kasir terlihat sedikit berantakan karena pergantian shift. Apa yang sebaiknya dilakukan?", 
          a: "Segera dirapikan agar tetap nyaman dilihat tamu", 
          options: ["Segera dirapikan agar tetap nyaman dilihat tamu", "Dibiarkan karena masih bisa digunakan", "Menunggu tim operasional membersihkan", "Dirapikan nanti saat sepi"] 
        },
        { 
          q: "Saat menjelaskan hot stone ke tamu, pendekatan terbaik adalah…", 
          a: "Menjelaskan manfaat dan keunggulannya dengan percaya diri", 
          options: ["Hanya menyebutkan durasi treatment", "Memaksa tamu untuk memilih hot stone", "Menyebutkan harganya saja", "Menjelaskan manfaat dan keunggulannya dengan percaya diri"] 
        },
        { 
          q: "Tamu komplain kepada kasir. Respon kasir yang paling tepat adalah…", 
          a: "Meminta maaf, berempati, dan memberikan solusi", 
          options: ["Mengabaikan komplain", "Menyalahkan kondisi ramai", "Meminta maaf, berempati, dan memberikan solusi", "Menjelaskan alasan dengan nada defensif"] 
        },
        { 
          q: "Untuk menciptakan suasana 'tenang dan nyaman', kasir sebaiknya…", 
          a: "Berkomunikasi dengan suara lembut dan sikap tenang", 
          options: ["Mengobrol dengan rekan kerja saat ada tamu", "Berkomunikasi dengan suara lembut dan sikap tenang", "Berbicara keras agar terdengar jelas", "Fokus pada layar tanpa interaksi"] 
        },
        { 
          q: "Seorang tamu datang dengan penampilan unik. Sikap kasir yang sesuai dengan value IKIGAI adalah…", 
          a: "Melayani dengan sepenuh hati tanpa membedakan", 
          options: ["Menawarkan treatment paling murah saja", "Mengutamakan tamu lain", "Melayani dengan sepenuh hati tanpa membedakan", "Memberikan pelayanan standar saja"] 
        },
        { 
          q: "Saat menawarkan membership atau promo, tujuan utamanya adalah…", 
          a: "Memberikan value lebih agar tamu merasa worth it dan tamu kembali lagi", 
          options: ["Menghabiskan promo yang ada", "Memberikan value lebih agar tamu merasa worth it dan tamu kembali lagi", "Meningkatkan penjualan saja", "Agar tamu membeli lebih banyak"] 
        },
        { 
          q: "Dalam mengatur booking, kasir yang profesional akan…", 
          a: "Mengikuti SOP dan memastikan jadwal tertata rapi", 
          options: ["Mengatur seadanya selama masuk", "Menunda input booking", "Mengutamakan tamu tertentu saja", "Mengikuti SOP dan memastikan jadwal tertata rapi"] 
        },
        { 
          q: "Cara terbaik membangun hubungan jangka panjang dengan tamu adalah…", 
          a: "Memberikan pelayanan hangat dan konsisten setiap kunjungan", 
          options: ["Fokus hanya pada transaksi", "Menghafal wajah tamu saja", "Memberikan pelayanan hangat dan konsisten setiap kunjungan", "Bersikap formal tanpa interaksi"] 
        }
      ]
    },
    {
      id: "SOP-K-02",
      title: "Pembelajaran Mandiri Standar Penampilan Kasir IKIGAI",
      url: "/videos/02. Pembelajaran Mandiri Standar Penampilan Kasir Ikigai.mp4",
      category: "SOP",
      roleAccess: ["KASIR", "SUPERVISOR"],
      isSoon: false,
      desc: "Panduan lengkap mengenai standar grooming, seragam, dan etika penampilan profesional Kasir IKIGAI.",
      quiz: [
        { 
          q: "Rambut kasir yang melebihi bahu sebaiknya…", 
          a: "Diikat rapi dengan ikat rambut warna hitam", 
          options: ["Dikepang tanpa aturan tertentu", "Diikat rapi dengan ikat rambut warna hitam", "Dibiarkan terurai agar terlihat natural", "Diikat rapi menggunakan aksesoris warna bebas"] 
        },
        { 
          q: "Ketentuan mengenai warna rambut kasir adalah…", 
          a: "Tidak boleh diwarnai", 
          options: ["Boleh highlight tipis", "Tidak boleh diwarnai", "Bebas selama tidak mencolok", "Boleh diwarnai warna gelap"] 
        },
        { 
          q: "Saat datang kerja, seragam terlihat sedikit kusut. Apa yang sebaiknya dilakukan?", 
          a: "Dirapikan terlebih dahulu sebelum mulai bekerja", 
          options: ["Dirapikan terlebih dahulu sebelum mulai bekerja", "Tidak masalah selama wangi", "Menunggu ditegur atasan", "Tetap dipakai karena masih bersih"] 
        },
        { 
          q: "Kondisi sandal yang sesuai standar adalah…", 
          a: "Bersih dan layak pakai", 
          options: ["Menggunakan sandal pribadi yang menarik", "Sedikit kotor tidak masalah", "Bersih dan layak pakai", "Bebas selama tidak rusak"] 
        },
        { 
          q: "Penggunaan aksesoris yang paling tepat adalah…", 
          a: "Perhiasan sewajarnya dan tidak berlebihan", 
          options: ["Tidak boleh menggunakan aksesoris sama sekali", "Menggunakan banyak aksesoris agar terlihat menarik", "Perhiasan sewajarnya dan tidak berlebihan", "Mengikuti tren aksesoris terbaru"] 
        },
        { 
          q: "Seorang kasir menggunakan 2 anting di satu telinga. Hal ini…", 
          a: "Tidak sesuai standar", 
          options: ["Tidak sesuai standar", "Diperbolehkan saat tidak ramai", "Tidak masalah jika kecil", "Diperbolehkan selama rapi"] 
        },
        { 
          q: "Make-up yang sesuai standar IKIGAI adalah…", 
          a: "Makeup sederhana dan natural, minimal bedak & lipstick", 
          options: ["Bebas sesuai mood", "Full makeup agar terlihat mencolok", "Tanpa makeup agar natural", "Makeup sederhana dan natural, minimal bedak & lipstick"] 
        },
        { 
          q: "Kondisi wajah kasir saat bekerja sebaiknya…", 
          a: "Terlihat segar dan rapi", 
          options: ["Tidak masalah terlihat lelah", "Bebas selama tidak berminyak", "Apa adanya selama hadir", "Terlihat segar dan rapi"] 
        },
        { 
          q: "Manakah yang sesuai dengan standar kuku kasir?", 
          a: "Kuku pendek, tidak tajam, tanpa warna mencolok", 
          options: ["Menggunakan kutek warna terang", "Kuku pendek, tidak tajam, tanpa warna mencolok", "Kuku panjang asal bersih", "Menggunakan nailart sederhana"] 
        },
        { 
          q: "Manakah kombinasi yang PALING sesuai standar penampilan IKIGAI?", 
          a: "Parfum dan deodorant digunakan", 
          options: ["Tidak menggunakan keduanya", "Parfum dan deodorant digunakan", "Deodorant saja tanpa parfum", "Parfum saja tanpa deodorant"] 
        }
      ]
    },
    {
      id: "SOP-K-03",
      title: "Pembelajaran Mandiri Alur Tamu-Jobdesk Kasir IKIGAI",
      url: "/videos/03. Pembelajaran Mandiri Alur Tamu-Jobdesk Kasir Ikigai.mp4",
      category: "SOP",
      roleAccess: ["KASIR", "SUPERVISOR"],
      isSoon: false,
      desc: "Panduan alur pelayanan tamu dari kedatangan, pengecekan ketersediaan terapis, hingga penawaran membership.",
      quiz: [
        { 
          q: "Saat tamu baru datang, tindakan pertama yang paling tepat adalah…", 
          a: "Menyambut tamu dengan ramah", 
          options: ["Mengecek system booking", "Menawarkan promo", "Menyambut tamu dengan ramah", "Membuat struk"] 
        },
        { 
          q: "Setelah menerima tamu, langkah berikutnya adalah…", 
          a: "Mengecek ketersediaan terapis", 
          options: ["Mengecek ketersediaan terapis", "Mengarahkan ke ruang tunggu", "Menawarkan membership", "Menulis buku tamu"] 
        },
        { 
          q: "Mengapa pengecekan system booking penting dilakukan?", 
          a: "Untuk melihat jadwal treatment yang ditangani terapis masih tersedia/tidak agar tidak bentrok dengan yang lain", 
          options: ["Untuk laporan harian", "Untuk melihat jadwal treatment yang ditangani terapis masih tersedia/tidak agar tidak bentrok dengan yang lain", "Untuk mencatat transaksi", "Untuk menghitung pembayaran"] 
        },
        { 
          q: "Dalam menawarkan treatment, hal yang terpenting adalah…", 
          a: "Mendengarkan kebutuhan tamu terlebih dahulu", 
          options: ["Menjelaskan semua menu sekaligus", "Mendengarkan kebutuhan tamu terlebih dahulu", "Menawarkan treatment termahal", "Mengikuti pilihan tamu tanpa diskusi"] 
        },
        { 
          q: "Kapan kasir harus menginformasikan metode pembayaran?", 
          a: "Sebelum treatment dimulai dan tamu telah menentukan treatment yang diinginkan", 
          options: ["Setelah menawarkan oshibori", "Setelah treatment selesai", "Saat mengenalkan terapis ke tamu", "Sebelum treatment dimulai dan tamu telah menentukan treatment yang diinginkan"] 
        },
        { 
          q: "Setelah pembayaran dilakukan, langkah berikutnya sebelum kasir memanggil terapis adalah…", 
          a: "Mempersilahkan tamu menunggu dan menawarkan matcha/jahe hangat", 
          options: ["Menawarkan membership", "Menawarkan handuk hangat", "Mempersilahkan tamu menunggu dan menawarkan matcha/jahe hangat", "Membuat struk"] 
        },
        { 
          q: "Fungsi menulis buku tamu dan lembar kerja terapis adalah…", 
          a: "Memastikan detail treatment dan informasi tamu dengan jelas", 
          options: ["Memastikan detail treatment dan informasi tamu dengan jelas", "Mengisi waktu kosong", "Formalitas saja", "Sebagai arsip tanpa fungsi"] 
        },
        { 
          q: "Saat briefing terapis, informasi apa yang penting untuk disampaikan?", 
          a: "Treatment yang telah dipilih tamu", 
          options: ["Promo yang sedang berjalan", "Treatment yang telah dipilih tamu", "Nama kasir", "Jam pulang terapis"] 
        },
        { 
          q: "Kapan kasir memperkenalkan terapis kepada tamu?", 
          a: "Setelah terapis siap dan mengambil sandal treatment", 
          options: ["Setelah treatment selesai", "Saat tamu datang", "Setelah terapis siap dan mengambil sandal treatment", "Sebelum booking"] 
        },
        { 
          q: "Penawaran membership atau voucher paling tepat dilakukan saat…", 
          a: "Setelah tamu selesai dan menyelesaikan treatment", 
          options: ["Setelah tamu selesai dan menyelesaikan treatment", "Saat tamu baru datang", "Di awal sebelum treatment", "Saat tamu sedang treatment"] 
        }
      ]
    },
    {
      id: "SOP-K-04",
      title: "Pembelajaran Mandiri Kode Etik Kasir IKIGAI",
      url: "/videos/04. Pembelajaran Mandiri Kode Etik Kasir Ikigai.mp4",
      category: "SOP",
      roleAccess: ["KASIR", "SUPERVISOR"],
      isSoon: false,
      desc: "Panduan etika profesional, sikap pelayanan, kerahasiaan data tamu, dan standar perilaku Kasir IKIGAI.",
      quiz: [
        { 
          q: "Saat berinteraksi dengan tamu, bahasa yang harus digunakan adalah…", 
          a: "Bahasa profesional, ramah, dan sopan", 
          options: ["Bahasa santai agar terasa dekat", "Bahasa profesional, ramah, dan sopan", "Bahasa formal tanpa ekspresi", "Bahasa sesuai kebiasaan pribadi"] 
        },
        { 
          q: "Sikap non-verbal yang wajib dilakukan saat melayani tamu adalah…", 
          a: "Senyum dan melakukan kontak mata", 
          options: ["Fokus ke layar komputer", "Menghindari kontak mata agar tidak canggung", "Senyum dan melakukan kontak mata", "Berbicara cepat agar efisien"] 
        },
        { 
          q: "Saat tamu sedang menjelaskan kebutuhannya, kasir sebaiknya…", 
          a: "Mendengarkan dengan tanggap tanpa memotong", 
          options: ["Memotong pembicaraan agar cepat", "Mendengarkan dengan tanggap tanpa memotong", "Langsung menawarkan treatment", "Mengabaikan dan fokus sistem"] 
        },
        { 
          q: "Tamu menyampaikan keluhan dengan nada kurang nyaman. Sikap kasir yang tepat adalah…", 
          a: "Menunjukkan empati terhadap keluhan tamu", 
          options: ["Menunjukkan ekspresi kesal", "Membela diri", "Menghindari pembicaraan", "Menunjukkan empati terhadap keluhan tamu"] 
        },
        { 
          q: "Dalam kondisi sibuk, kasir tetap harus menghindari…", 
          a: "Menunjukkan emosi negatif", 
          options: ["Memberikan solusi", "Berkomunikasi dengan tamu", "Menunjukkan emosi negatif", "Menjelaskan informasi"] 
        },
        { 
          q: "Cara menutup percakapan dengan tamu yang sesuai adalah…", 
          a: "Menutup dengan ucapan terima kasih dan gesture hormat", 
          options: ["Langsung kembali ke pekerjaan", "Diam tanpa respon", "Menutup dengan ucapan terima kasih dan gesture hormat", "Mengakhiri tanpa kontak mata"] 
        },
        { 
          q: "Mengenai data tamu, kasir harus…", 
          a: "Menyimpan dan tidak membocorkan data tamu", 
          options: ["Membagikan jika diminta rekan kerja", "Menyimpan dan tidak membocorkan data tamu", "Menceritakan ke teman dekat", "Menggunakan untuk kepentingan pribadi"] 
        },
        { 
          q: "Sikap yang benar terkait tip adalah…", 
          a: "Boleh menerima tip sesuai prosedur yang berlaku", 
          options: ["Boleh menerima tip langsung tanpa aturan", "Tidak boleh menerima tip dalam kondisi apapun", "Boleh menerima tip sesuai prosedur yang berlaku", "Meminta tip secara halus kepada tamu"] 
        },
        { 
          q: "Saat bertugas, penggunaan HP pribadi…", 
          a: "Tidak diperbolehkan saat bertemu atau ada tamu", 
          options: ["Diperbolehkan kapan saja", "Tidak diperbolehkan saat bertemu atau ada tamu", "Bebas selama tidak terlihat atasan", "Boleh digunakan untuk keperluan pribadi"] 
        },
        { 
          q: "Saat ada tamu, kasir dan rekan kerja sebaiknya…", 
          a: "Fokus pada tamu dan tidak ngobrol pribadi", 
          options: ["Tetap ngobrol santai", "Mengobrol pelan saja", "Fokus pada tamu dan tidak ngobrol pribadi", "Mengabaikan tamu sementara"] 
        }
      ]
    },
    {
      "id": "SOP-K-05",
      "title": "Pembelajaran Booking Online dan Sistem Booking IKIGAI",
      "url": "/videos/05. Booking Online By Whatsapp Dan Phone.mp4",
      "category": "SOP",
      "roleAccess": ["KASIR", "SUPERVISOR"],
      "isSoon": false,
      "desc": "Panduan teknis dan alur kerja dalam menangani booking tamu melalui WhatsApp, Telepon, dan Instagram serta cara input ke sistem.",
      "quiz": [
        { 
          "q": "Kita dapat melakukan booking online IKIGAI melalui…", 
          "a": "Telepon, Whatsapp, DM Instagram", 
          "options": ["Telepon, Email, Website", "Whatsapp, Email, Instagram", "Telepon, Whatsapp, DM Instagram", "Website, Whatsapp, Telepon"] 
        },
        { 
          "q": "Saat menerima booking melalui telepon, informasi yang tidak termasuk wajib ditanyakan adalah…", 
          "a": "Alamat rumah tamu", 
          "options": ["Tanggal treatment", "Jumlah orang", "Alamat rumah tamu", "Durasi treatment"] 
        },
        { 
          "q": "Setelah menerima data booking via telepon, langkah yang benar adalah…", 
          "a": "Input ke sistem booking atau jika belum selesai bisa arahkan ke chat Whatsapp", 
          "options": ["Menyuruh tamu datang langsung saja tidak perlu booking", "Mengabaikannya dan minta datang langsung", "Input ke sistem booking atau jika belum selesai bisa arahkan ke chat Whatsapp", "Menunggu tamu ngechat di Whatsapp"] 
        },
        { 
          "q": "Saat menerima DM Instagram, informasi pertama yang harus dipastikan adalah…", 
          "a": "Cabang yang ingin dikunjungi", 
          "options": ["Metode pembayaran", "Cabang yang ingin dikunjungi", "Promo yang dipilih", "Terapis yang tersedia"] 
        },
        { 
          "q": "Setelah mendapatkan nama dan nomor telepon dari DM Instagram, tindakan selanjutnya adalah…", 
          "a": "Menginformasikan ke Whatsapp cabang terkait untuk follow up", 
          "options": ["Menunggu tamu menghubungi kembali", "Input langsung ke sistem tanpa konfirmasi", "Menghubungi semua cabang", "Menginformasikan ke Whatsapp cabang terkait untuk follow up"] 
        },
        { 
          "q": "Booking melalui Whatsapp menggunakan…", 
          "a": "Template yang sudah disediakan IKIGAI", 
          "options": ["Format bebas", "Template yang sudah disediakan IKIGAI", "Chat manual tanpa aturan", "Voice note saja"] 
        },
        { 
          "q": "Manakah data berikut yang perlu ada untuk data tamu via Whatsapp?", 
          "a": "Nama, hari/tanggal, durasi, terapis, jam kedatangan, treatment", 
          "options": ["Nama, hari/tanggal, durasi, terapis, jam kedatangan, treatment", "Nama, alamat rumah, pekerjaan", "Nama, email, usia", "Nama, media sosial"] 
        },
        { 
          "q": "Langkah pertama dalam menginput booking ke sistem adalah…", 
          "a": "Cek ketersediaan terapis dan ruangan", 
          "options": ["Memilih ruangan", "Submit jadwal", "Cek ketersediaan terapis dan ruangan", "Memilih treatment"] 
        },
        { 
          "q": "Setelah memasukkan nama dan nomor telepon, langkah berikutnya adalah…", 
          "a": "Pilih durasi treatment dan treatment yang dipilih", 
          "options": ["Submit langsung", "Pilih durasi treatment dan treatment yang dipilih", "Pilih ruangan", "Pilih terapis"] 
        },
        { 
          "q": "Kapan booking dinyatakan berhasil di sistem?", 
          "a": "Setelah submit jadwal booking", 
          "options": ["Setelah memilih treatment", "Setelah memilih terapis", "Setelah memilih ruangan", "Setelah submit jadwal booking"] 
        }
      ]
    },
    {
      "id": "SOP-K-06",
      "title": "Pembelajaran Pembukaan Pagi Kasir IKIGAI",
      "url": "/videos/06. Tugas Pagi Kasir.mp4",
      "category": "SOP",
      "roleAccess": ["KASIR", "SUPERVISOR"],
      "isSoon": false,
      "desc": "Panduan langkah-langkah persiapan pagi kasir mulai dari persiapan perangkat, pengecekan sistem booking, konfirmasi tamu, hingga pelaporan modal.",
      "quiz": [
        { 
          "q": "Tugas pagi kasir dilakukan pada waktu…", 
          "a": "Sebelum jam operasional dimulai", 
          "options": ["Setelah operasional selesai", "Saat operasional berjalan", "Sebelum jam operasional dimulai", "Saat pergantian shift"] 
        },
        { 
          "q": "Perlengkapan apa saja yang harus disiapkan saat membuka laci kasir?", 
          "a": "Mesin EDC, laptop, buku tamu, keyboard, mouse", 
          "options": ["Brosur dan flyer", "Mesin EDC, laptop, buku tamu, keyboard, mouse", "Alat kebersihan", "Menu treatment"] 
        },
        { 
          "q": "Setelah menyalakan komputer, kasir harus…", 
          "a": "Mengecek sistem booking", 
          "options": ["Membuka Instagram", "Mengecek sistem booking", "Menghitung uang", "Membuat laporan pagi"] 
        },
        { 
          "q": "Saat membuka sistem booking di komputer, kasir perlu melakukan…", 
          "a": "Mengecek seluruh bookingan hari ini", 
          "options": ["Menghapus booking lama", "Mengecek seluruh bookingan hari ini", "Menginput expense", "Menutup sistem"] 
        },
        { 
          "q": "Selain mengecek booking, kasir juga perlu…", 
          "a": "Mengkonfirmasi booking via Whatsapp sesuai waktu yang ditentukan terutama tamu yang akan datang pukul 10.00", 
          "options": ["Menghitung uang", "Menghubungi semua tamu tanpa jadwal", "Mengkonfirmasi booking via Whatsapp sesuai waktu yang ditentukan terutama tamu yang akan datang pukul 10.00", "Menutup sistem"] 
        },
        { 
          "q": "Konfirmasi booking untuk tamu pukul 10.00 dilakukan maksimal pada pukul…", 
          "a": "09.00", 
          "options": ["08.00", "09.00", "10.00", "11.00"] 
        },
        { 
          "q": "Setelah menyelesaikan sistem booking, kasir juga perlu…", 
          "a": "Memasang Status Whatsapp sesuai arahan tim marketing", 
          "options": ["Semua lampu menyala", "Memasang Status Whatsapp sesuai arahan tim marketing", "Semua tamu sudah datang", "Musik dimatikan"] 
        },
        { 
          "q": "Saat menghitung uang di laci kasir, kasir harus memastikan bahwa…", 
          "a": "Sesuai dengan modal di Deal POS", 
          "options": ["Sesuai dengan perkiraan", "Lebih banyak dari kemarin", "Sesuai dengan modal di Deal POS", "Tidak perlu sesuai"] 
        },
        { 
          "q": "Jika jumlah uang tidak sesuai dengan laporan modal di HP semalam, maka kasir harus…", 
          "a": "Menyesuaikan dengan uang yang ada di kasir dan menelusuri kenapa bisa adanya selisih", 
          "options": ["Mengabaikan", "Mengurangi uang", "Menunggu atasan", "Menyesuaikan dengan uang yang ada di kasir dan menelusuri kenapa bisa adanya selisih"] 
        },
        { 
          "q": "Dalam Pembukaan Pagi, kasir harus …", 
          "a": "Membuat laporan pagi (karyawan off)", 
          "options": ["Pulang", "Menutup sistem", "Membuat laporan pagi (karyawan off)", "Menghapus data"] 
        }
      ]
    },
    {
      "id": "SOP-K-07",
      "title": "Pembelajaran Penutupan Malam Kasir IKIGAI",
      "url": "/videos/07. Tugas Malam Kasir.mp4",
      "category": "SOP",
      "roleAccess": ["KASIR", "SUPERVISOR"],
      "isSoon": false,
      "desc": "Panduan langkah-langkah penutupan operasional kasir mulai dari sinkronisasi data booking, perhitungan transaksi payment, hingga pembuatan laporan malam.",
      "quiz": [
        { 
          "q": "Saat penutupan malam, hal perlu dilakukan terkait bookingan adalah…", 
          "a": "Mengecek bookingan untuk besok hari", 
          "options": ["Menulis laporan malam", "Mengecek bookingan untuk besok hari", "Menghitung payment", "Menutup sistem"] 
        },
        { 
          "q": "Saat mengecek booking dari HP, kasir harus memastikan bahwa…", 
          "a": "Semua booking sudah masuk ke sistem booking", 
          "options": ["Semua tamu sudah datang", "Semua booking sudah masuk ke sistem booking", "Semua terapis sudah pulang", "Semua laporan sudah dibuat"] 
        },
        { 
          "q": "Apa yang harus dipastikan saat mengecek bookingan untuk besok hari by chat Whatsapp?", 
          "a": "Kesesuaian antara sistem booking dan chat Whatsapp tamu", 
          "options": ["Jadwal terapis minggu depan", "Kesesuaian antara sistem booking dan chat Whatsapp tamu", "Jumlah kasir yang masuk", "Kondisi ruangan"] 
        },
        { 
          "q": "Jika ditemukan perbedaan antara sistem booking dan chat Whatsapp, maka kasir harus…", 
          "a": "Menyamakan, mengkonfirmasi, dan memastikan data booking agar sesuai", 
          "options": ["Mengabaikan perbedaan tersebut", "Mengikuti data di Whatsapp", "Menyamakan, mengkonfirmasi, dan memastikan data booking agar sesuai", "Menghapus semua data"] 
        },
        { 
          "q": "Setelah semua booking dipastikan sesuai, apa yang perlu dilakukan di tugas malam?", 
          "a": "Melanjutkan ke perhitungan jumlah tamu, tolak tamu, member baru, dan kerja terapis", 
          "options": ["Menghapus data booking", "Menghubungi semua tamu kembali", "Melanjutkan ke perhitungan jumlah tamu, tolak tamu, member baru, dan kerja terapis", "Menutup sistem"] 
        },
        { 
          "q": "Data berikut yang perlu dihitung saat penutupan malam adalah…", 
          "a": "Jumlah tamu, tolak tamu, member baru, jumlah kerja terapis", 
          "options": ["Jumlah kursi dan ruangan", "Jumlah tamu, tolak tamu, member baru, jumlah kerja terapis", "Jumlah lampu dan AC", "Jumlah kasir yang masuk"] 
        },
        { 
          "q": "Selain data operasional, kasir juga harus menghitung…", 
          "a": "Expense, modal, dan transaksi payment", 
          "options": ["Playlist musik", "Jadwal libur", "Expense, modal, dan transaksi payment", "Jumlah tamu besok"] 
        },
        { 
          "q": "Perhitungan transaksi payment harus…", 
          "a": "Sesuai dengan Deal POS", 
          "options": ["Dikira-kira", "Sesuai dengan Deal POS", "Disamakan dengan hari sebelumnya", "Tidak perlu dicek"] 
        },
        { 
          "q": "Laporan malam yang dibuat di HP mencakup…", 
          "a": "Modal, jumlah tamu, tolak tamu, member baru, komplain", 
          "options": ["Nama kasir dan jadwal", "Promo yang berjalan", "Menu treatment", "Modal, jumlah tamu, tolak tamu, member baru, komplain"] 
        },
        { 
          "q": "Setelah semua data selesai dihitung, langkah terakhir adalah…", 
          "a": "Membuat laporan malam", 
          "options": ["Menutup outlet", "Pulang", "Membuat laporan malam", "Menghapus data"] 
        }
      ]
    },
    {
      "id": "SOP-K-08",
      "title": "Pembelajaran Pergantian Shift Kasir IKIGAI",
      "url": "/videos/08. Tugas Pergantian Shift.mp4",
      "category": "SOP",
      "roleAccess": ["KASIR", "SUPERVISOR"],
      "isSoon": false,
      "desc": "Panduan serah terima tugas antar shift kasir, mencakup pembagian tanggung jawab perangkat, sinkronisasi data booking, hingga validasi modal dan payment.",
      "quiz": [
        { 
          "q": "Dalam pergantian kasir IKIGAI, terdapat pembagian tugas yang dilakukan berdasarkan…", 
          "a": "Perangkat yang digunakan (HP/Komputer dan Laptop/Deal Pos)", 
          "options": ["Jumlah tamu", "Lama bekerja", "Perangkat yang digunakan (HP/Komputer dan Laptop/Deal Pos)", "Hari kerja"] 
        },
        { 
          "q": "Pada pergantian shift kasir yang handle HP dan komputer, fokus utama yang harus diperhatikan adalah…", 
          "a": "Kesesuaian booking di sistem", 
          "options": ["Perhitungan modal dan expense", "Kesesuaian booking di sistem", "Jumlah struk EDC", "Laporan malam"] 
        },
        { 
          "q": "Pada kasir yang handle HP dan komputer, yang harus dilakukan mengenai bookingan adalah…", 
          "a": "Double cek bookingan di sistem booking", 
          "options": ["Menghitung payment", "Double cek bookingan di sistem booking", "Menghitung modal", "Menginput expense"] 
        },
        { 
          "q": "Double cek bookingan dilakukan bersama…", 
          "a": "Shift sebelumnya/selanjutnya", 
          "options": ["SPV", "Terapis", "Operasional", "Shift sebelumnya/selanjutnya"] 
        },
        { 
          "q": "Selain mengecek bookingan, kasir juga harus…", 
          "a": "Konfirmasi ke shift selanjutnya sedang menawarkan slot ke siapa saja", 
          "options": ["Menghapus booking lama", "Konfirmasi ke shift selanjutnya sedang menawarkan slot ke siapa saja", "Menghubungi semua tamu", "Menutup sistem"] 
        },
        { 
          "q": "Pergantian posisi kasir dilakukan pada pukul…", 
          "a": "16.00", 
          "options": ["15.00", "16.00", "17.00", "18.00"] 
        },
        { 
          "q": "Pada kasir yang handle laptop (Deal Pos), hal yang harus dilakukan mengenai jumlah kerja terapis adalah…", 
          "a": "Menghitung jumlah kerja terapis sesuai dealpos dan sistem booking", 
          "options": ["Menghitung modal", "Menghitung expense", "Menghitung jumlah kerja terapis sesuai dealpos dan sistem booking", "Menghitung struk EDC"] 
        },
        { 
          "q": "Perhitungan struk EDC harus dibandingkan dengan…", 
          "a": "Mesin EDC dan dealpos", 
          "options": ["Sistem booking saja", "Mesin EDC dan dealpos", "Whatsapp", "Laporan SPV"] 
        },
        { 
          "q": "Selain menghitung payment dan expense, kasir perlu … pada pergantian shift", 
          "a": "Menghitung modal sesuai uang yang ada", 
          "options": ["Menghapus data", "Menutup sistem", "Menghitung modal sesuai uang yang ada", "Menghubungi tamu"] 
        },
        { 
          "q": "Sebelum pergantian posisi, hal yang harus dipastikan adalah…", 
          "a": "Shift selanjutnya ikut menghitung (double crosscheck) dan hasilnya sesuai", 
          "options": ["Semua kasir sudah pulang", "Shift selanjutnya ikut menghitung (double crosscheck) dan hasilnya sesuai", "Semua tamu sudah datang", "Sistem sudah dimatikan"] 
        }
      ]
    },
    {
      "id": "SOP-K-09",
      "title": "Pembelajaran Roleplay Kasir - Tamu Belum Booking",
      "url": "/videos/09. Roleplay Kasir - Tamu Belum Booking (Tersedia.mp4",
      "category": "SOP",
      "roleAccess": ["KASIR", "SUPERVISOR"],
      "isSoon": false,
      "desc": "Simulasi penanganan tamu walk-in yang belum melakukan reservasi, teknik upselling paket best seller, serta prosedur edukasi promo Happy Hour.",
      "quiz": [
        { 
          "q": "Apa yang harus diucapkan kasir pertama kali saat menyambut tamu?", 
          "a": "Selamat siang, Selamat Datang di IKIGAI", 
          "options": ["Mau treatment apa kak?", "Sudah booking belum kak?", "Selamat siang, Selamat Datang di IKIGAI", "Silahkan duduk kak"] 
        },
        { 
          "q": "Jika tamu bertanya apakah harus melakukan booking terlebih dahulu, apa jawaban kasir yang tepat menurut video?", 
          "a": "Tidak harus kak, saya cek ketersediaannya dulu ya kak", 
          "options": ["Ya, wajib booking dulu kak", "Tidak harus kak, saya cek ketersediaannya dulu ya kak", "Langsung masuk saja kak", "Booking hanya untuk member"] 
        },
        { 
          "q": "Informasi apa yang pertama kali diminta kasir jika slot tersedia untuk tamu yang belum booking?", 
          "a": "Nama dan Nomor Telepon", 
          "options": ["Alamat rumah", "Nama dan Nomor Telepon", "Pekerjaan", "Akun Instagram"] 
        },
        { 
          "q": "Tamu dalam video awalnya ingin mengambil treatment apa?", 
          "a": "Body Massage 90 menit", 
          "options": ["Reflexology 60 menit", "Thai Massage 90 menit", "Body Massage 90 menit", "Hot Stone 120 menit"] 
        },
        { 
          "q": "Treatment 'Best Seller' apa yang ditawarkan kasir sebagai kombinasi?", 
          "a": "Paket Hot Stone (Body Massage + Hot Stone)", 
          "options": ["Paket Zen Ikigai", "Paket Hot Stone (Body Massage + Hot Stone)", "Paket Back Relief", "Tunas Ikigai"] 
        },
        { 
          "q": "Berapa lama durasi total untuk Paket Hot Stone yang diambil tamu?", 
          "a": "90 Menit (1,5 Jam)", 
          "options": ["60 Menit", "90 Menit (1,5 Jam)", "120 Menit", "30 Menit"] 
        },
        { 
          "q": "Berapa besar potongan harga (diskon) yang diberikan dalam promo Happy Hour?", 
          "a": "10%", 
          "options": ["5%", "15%", "10%", "20%"] 
        },
        { 
          "q": "Apa syarat yang harus dilakukan tamu untuk mendapatkan promo Happy Hour?", 
          "a": "Follow IG dan share materi promo ke grup WhatsApp (minimal 7 orang)", 
          "options": ["Membayar dengan kartu kredit", "Datang berlima", "Follow IG dan share materi promo ke grup WhatsApp (minimal 7 orang)", "Menjadi member premium"] 
        },
        { 
          "q": "Kapan pembayaran dilakukan oleh tamu menurut prosedur di video tersebut?", 
          "a": "Di awal sebelum treatment", 
          "options": ["Setelah treatment selesai", "Di awal sebelum treatment", "Saat akan pulang", "Bebas kapan saja"] 
        },
        { 
          "q": "Minuman apa yang ditawarkan kasir kepada tamu saat menunggu di ruang tunggu?", 
          "a": "Jahe dan Matcha hangat", 
          "options": ["Kopi dan Teh", "Air Mineral", "Jahe dan Matcha hangat", "Jus Buah"] 
        }
      ]
    },
    {
      "id": "SOP-K-10",
      "title": "Pembelajaran Roleplay Kasir - Tamu Sudah Booking",
      "url": "/videos/10. Roleplay Kasir - Tamu Sudah Booking.mp4",
      "category": "SOP",
      "roleAccess": ["KASIR", "SUPERVISOR"],
      "isSoon": false,
      "desc": "Simulasi alur pelayanan kasir untuk tamu yang telah melakukan reservasi, mulai dari konfirmasi data booking, proses pembayaran di awal, hingga pengarahan ke ruang tunggu.",
      "quiz": [
        { 
          "q": "Apa salam pembuka yang diucapkan kasir saat menyambut tamu di pagi hari?", 
          "a": "Selamat Pagi, Selamat Datang di IKIGAI", 
          "options": ["Selamat Siang, Selamat Datang di IKIGAI", "Selamat Malam, Selamat Datang di IKIGAI", "Selamat Pagi, Selamat Datang di IKIGAI", "Halo Kak, mau treatment apa?"] 
        },
        { 
          "q": "Pertanyaan apa yang diajukan kasir setelah menyapa tamu?", 
          "a": "Apakah Kakaknya sudah booking?", 
          "options": ["Mau pesan minum apa Kak?", "Apakah Kakaknya sudah booking?", "Sudah tahu mau ambil paket apa Kak?", "Boleh minta nomor teleponnya?"] 
        },
        { 
          "q": "Siapa nama tamu yang sudah melakukan reservasi dalam video tersebut?", 
          "a": "Kak Muty", 
          "options": ["Kak Muty", "Kak Sarah", "Kak Indah", "Kak Maya"] 
        },
        { 
          "q": "Treatment apa yang sudah di-booking oleh tamu tersebut?", 
          "a": "Body Massage", 
          "options": ["Reflexology", "Thai Massage", "Body Massage", "Zen Ikigai"] 
        },
        { 
          "q": "Berapa durasi treatment yang diambil oleh tamu?", 
          "a": "90 Menit (1,5 jam)", 
          "options": ["60 Menit", "90 Menit (1,5 jam)", "120 Menit", "45 Menit"] 
        },
        { 
          "q": "Kapan proses pembayaran dilakukan oleh tamu yang sudah booking?", 
          "a": "Di awal sebelum treatment dimulai", 
          "options": ["Setelah treatment selesai", "Di tengah-tengah treatment", "Di awal sebelum treatment dimulai", "Saat akan meninggalkan lokasi"] 
        },
        { 
          "q": "Berapa total harga yang harus dibayar tamu untuk Body Massage durasi 1,5 jam?", 
          "a": "Rp 205.000", 
          "options": ["Rp 150.000", "Rp 205.000", "Rp 235.000", "Rp 185.000"] 
        },
        { 
          "q": "Metode pembayaran apa yang digunakan oleh tamu dalam video?", 
          "a": "Qris", 
          "options": ["Tunai (Cash)", "Kartu Kredit", "Transfer Bank", "Qris"] 
        },
        { 
          "q": "Di mana letak ruang tunggu yang diinfokan oleh kasir kepada tamu?", 
          "a": "Di bagian belakang", 
          "options": ["Di lantai dua", "Di sebelah kiri kasir", "Di bagian belakang", "Di depan pintu masuk"] 
        },
        { 
          "q": "Minuman apa saja yang tersedia dan ditawarkan kepada tamu di ruang tunggu?", 
          "a": "Jahe dan Matcha", 
          "options": ["Kopi dan Teh", "Air Mineral dan Jus", "Jahe dan Matcha", "Susu dan Cokelat"] 
        }
      ]
    },
    {
      "id": "SOP-K-11",
      "title": "Pembelajaran Roleplay Kasir - Full Booking",
      "url": "/videos/11. Roleplay Kasir - Full Booking.mp4",
      "category": "SOP",
      "roleAccess": ["KASIR", "SUPERVISOR"],
      "isSoon": false,
      "desc": "Simulasi penanganan tamu yang belum melakukan reservasi saat kondisi operasional sedang penuh, mencakup pemberian alternatif waktu, cabang lain, hingga pemberian kartu nama untuk booking di lain hari.",
      "quiz": [
        {
          "q": "Apa salam pembuka yang diucapkan kasir saat menyambut tamu di pagi hari?",
          "a": "Pagi, Selamat Datang di IKIGAI",
          "options": [
            "Halo Kak, selamat datang",
            "Pagi, Selamat Datang di IKIGAI",
            "Selamat Siang di IKIGAI",
            "Ada yang bisa dibantu Kak?"
          ]
        },
        {
          "q": "Apa pertanyaan pertama yang diajukan kasir untuk memastikan status reservasi tamu?",
          "a": "Kakaknya sudah booking?",
          "options": [
            "Mau treatment apa Kak?",
            "Sudah tahu harganya Kak?",
            "Kakaknya sudah booking?",
            "Boleh minta KTP-nya Kak?"
          ]
        },
        {
          "q": "Apa jawaban kasir saat tamu ingin melakukan booking untuk saat itu juga?",
          "a": "Untuk di jam sekarang kita sedang full Kak",
          "options": [
            "Bisa Kak, silakan masuk",
            "Untuk di jam sekarang kita sedang full Kak",
            "Harus nunggu 10 menit saja Kak",
            "Bisa, tapi harganya beda Kak"
          ]
        },
        {
          "q": "Jam berapa kasir menginformasikan tersedianya kembali terapis wanita?",
          "a": "Jam 12.00 siang",
          "options": [
            "Jam 10.00 pagi",
            "Jam 11.00 siang",
            "Jam 12.00 siang",
            "Jam 15.00 sore"
          ]
        },
        {
          "q": "Apa langkah pertama yang dilakukan kasir jika slot di jam tersebut sudah penuh?",
          "a": "Menawarkan jam lain yang tersedia",
          "options": [
            "Menolak tamu secara langsung",
            "Menawarkan jam lain yang tersedia",
            "Memberikan diskon",
            "Meminta tamu menunggu tanpa kepastian"
          ]
        },
        {
          "q": "Apa alternatif hari yang ditawarkan kasir jika tamu tidak bisa di hari yang sama?",
          "a": "Menawarkan booking untuk besok",
          "options": [
            "Menawarkan booking untuk besok",
            "Menawarkan booking untuk minggu depan",
            "Menawarkan booking untuk bulan depan",
            "Tidak menawarkan hari lain"
          ]
        },
        {
          "q": "Cabang mana saja yang disebutkan kasir saat menawarkan alternatif lokasi lain?",
          "a": "Alam Sutera, BSD, Gading Serpong",
          "options": [
            "Jakarta, Bandung, Surabaya",
            "Alam Sutera, BSD, Gading Serpong",
            "Bintaro dan Jakarta Selatan",
            "Bali dan Yogyakarta"
          ]
        },
        {
          "q": "Berapa jumlah total cabang yang disebutkan oleh kasir dalam video tersebut?",
          "a": "4 Cabang",
          "options": [
            "2 Cabang",
            "3 Cabang",
            "4 Cabang",
            "5 Cabang"
          ]
        },
        {
          "q": "Apa yang diberikan kasir kepada tamu sebagai referensi untuk kedatangan berikutnya?",
          "a": "Kartu nama (yang berisi QR code)",
          "options": [
            "Brosur menu",
            "Voucher diskon",
            "Kartu nama (yang berisi QR code)",
            "Nota pembayaran"
          ]
        },
        {
          "q": "Apa saran kasir kepada tamu agar mendapatkan slot treatment di kedatangan berikutnya?",
          "a": "Melakukan booking terlebih dahulu",
          "options": [
            "Datang lebih pagi",
            "Membayar di muka",
            "Melakukan booking terlebih dahulu",
            "Membawa teman"
          ]
        }
      ]
    },
    {
      "id": "SOP-K-12",
      "title": "Pembelajaran Roleplay Memperkenalkan Terapis ke Tamu",
      "url": "/videos/12. Roleplay Kasir - Memperkenalkan Terapis Ke Ta.mp4",
      "category": "SOP",
      "roleAccess": ["KASIR", "SUPERVISOR"],
      "isSoon": false,
      "desc": "Simulasi prosedur saat terapis menjemput tamu di ruang tunggu, mencakup penggunaan hand sanitizer, penggantian alas kaki tamu, hingga pengarahan tamu menuju ruang treatment.",
      "quiz": [
        {
          "q": "Apa kombinasi treatment yang disebutkan di awal video?",
          "a": "60 Menit Body Massage dan 30 Menit Hot Stone",
          "options": [
            "90 Menit Body Massage",
            "60 Menit Body Massage dan 30 Menit Hot Stone",
            "30 Menit Reflexology dan 60 Menit Body Massage",
            "120 Menit Paket Zen"
          ]
        },
        {
          "q": "Apa tindakan pertama yang dilakukan staf sebelum memberikan kertas pesanan kepada terapis?",
          "a": "Menyemprotkan hand sanitizer ke tangan",
          "options": [
            "Mencuci tangan",
            "Memakai sarung tangan",
            "Menyemprotkan hand sanitizer ke tangan",
            "Langsung memberikan kertas"
          ]
        },
        {
          "q": "Siapa nama terapis yang akan menangani tamu dalam video tersebut?",
          "a": "Mbak Wilda",
          "options": [
            "Mbak Sarah",
            "Mbak Muty",
            "Mbak Wilda",
            "Mbak Indah"
          ]
        },
        {
          "q": "Apa warna sandal yang disediakan terapis untuk tamu?",
          "a": "Biru Muda/Hijau Toska",
          "options": [
            "Putih",
            "Biru Muda/Hijau Toska",
            "Hitam",
            "Abu-abu"
          ]
        },
        {
          "q": "Di mana terapis meletakkan sepatu milik tamu setelah diganti dengan sandal?",
          "a": "Di dalam loker penyimpanan",
          "options": [
            "Di bawah kursi",
            "Di dalam tas tamu",
            "Di dalam loker penyimpanan",
            "Di luar ruangan"
          ]
        },
        {
          "q": "Apa langkah selanjutnya yang dilakukan terapis setelah memperkenalkan diri?",
          "a": "Membantu tamu mengganti sepatu dengan sandal",
          "options": [
            "Langsung memijat tamu",
            "Mengajak tamu ke lantai dua",
            "Membantu tamu mengganti sepatu dengan sandal",
            "Memberikan minuman jahe"
          ]
        },
        {
          "q": "Pertanyaan apa yang diajukan terapis sebelum mengajak tamu naik ke ruangan treatment?",
          "a": "Kakaknya mau ke toilet dulu?",
          "options": [
            "Sudah makan Kak?",
            "Kakaknya mau ke toilet dulu?",
            "Mau ganti baju sekarang?",
            "Sudah siap dipijat?"
          ]
        },
        {
          "q": "Di lantai berapakah ruangan treatment berada menurut video tersebut?",
          "a": "Lantai 2",
          "options": [
            "Lantai 1",
            "Lantai 2",
            "Lantai 3",
            "Basement"
          ]
        },
        {
          "q": "Apa tugas staf resepsionis/admin saat terapis datang menjemput tamu?",
          "a": "Memperkenalkan terapis kepada tamu",
          "options": [
            "Membuatkan minuman",
            "Memperkenalkan terapis kepada tamu",
            "Menghitung total biaya",
            "Membawa tas tamu"
          ]
        },
        {
          "q": "Bagaimana sikap terapis saat menyapa dan memperkenalkan diri kepada tamu?",
          "a": "Sopan, tersenyum, dan sedikit membungkuk",
          "options": [
            "Sambil berdiri tegak",
            "Sambil berjalan",
            "Sopan, tersenyum, dan sedikit membungkuk",
            "Sambil memegang handphone"
          ]
        }
      ]
    },
    {
      "id": "SOP-K-13",
      "title": "Pembelajaran Roleplay Penutupan Tamu & Membership",
      "url": "/videos/13. Penutupan Tamu.mp4",
      "category": "SOP",
      "roleAccess": ["KASIR", "SUPERVISOR"],
      "isSoon": false,
      "desc": "Simulasi alur penutupan pelayanan (checkout), mulai dari pemberian handuk hangat, konfirmasi kepuasan pelanggan, pemberian voucher diskon, hingga penjelasan sistem membership dan poin.",
      "quiz": [
        {
          "q": "Apa yang diberikan kasir kepada tamu di awal video untuk kenyamanan pasca-treatment?",
          "a": "Handuk hangat untuk lap-lap",
          "options": [
            "Minuman Matcha hangat",
            "Handuk hangat untuk lap-lap",
            "Snack ringan",
            "Voucher gratis"
          ]
        },
        {
          "q": "Pertanyaan apa yang diajukan kasir untuk memastikan kepuasan tamu?",
          "a": "Untuk pijitannya gimana Kak?",
          "options": [
            "Mau nambah treatment lagi Kak?",
            "Untuk pijitannya gimana Kak?",
            "Sudah lapar belum Kak?",
            "Mau bayar pakai apa Kak?"
          ]
        },
        {
          "q": "Siapa nama tamu yang melakukan checkout dalam video tersebut?",
          "a": "Kak Sari",
          "options": [
            "Kak Muty",
            "Kak Wilda",
            "Kak Sari",
            "Kak Dina"
          ]
        },
        {
          "q": "Berapa persen diskon yang diberikan dalam voucher untuk treatment Thai Massage?",
          "a": "10%",
          "options": [
            "5%",
            "10%",
            "15%",
            "20%"
          ]
        },
        {
          "q": "Berapa lama masa berlaku voucher diskon yang diberikan kepada tamu?",
          "a": "Satu bulan",
          "options": [
            "Satu minggu",
            "Satu bulan",
            "Tiga bulan",
            "Satu tahun"
          ]
        },
        {
          "q": "Apa syarat untuk menjadi member di IKIGAI menurut penjelasan kasir?",
          "a": "Follow Instagram dan review di Google cabang Bintaro",
          "options": [
            "Membayar biaya pendaftaran Rp100.000",
            "Minimal transaksi 5 kali",
            "Follow Instagram dan review di Google cabang Bintaro",
            "Menyerahkan fotokopi KTP"
          ]
        },
        {
          "q": "Benefit langsung apa yang didapat tamu jika mendaftar member pada hari itu?",
          "a": "Voucher upgrade Hot Stone",
          "options": [
            "Gratis treatment 60 menit",
            "Voucher upgrade Hot Stone",
            "Diskon 50% untuk kunjungan berikutnya",
            "Merchandise gratis"
          ]
        },
        {
          "q": "Berapa nominal transaksi yang diperlukan untuk mendapatkan 1 poin member?",
          "a": "Rp55.000",
          "options": [
            "Rp25.000",
            "Rp50.000",
            "Rp55.000",
            "Rp100.000"
          ]
        },
        {
          "q": "Apa keuntungan yang didapat jika poin member sudah mencapai 25 poin?",
          "a": "Potongan harga Rp50.000",
          "options": [
            "Potongan harga Rp50.000",
            "Potongan harga Rp100.000",
            "Gratis Body Massage",
            "Upgrade ke member VIP"
          ]
        },
        {
          "q": "Kondisi apa yang membuat transaksi tidak mendapatkan poin member?",
          "a": "Tamu ikut promo Happy Hour",
          "options": [
            "Pembayaran menggunakan Qris",
            "Tamu datang di akhir pekan",
            "Tamu ikut promo Happy Hour",
            "Transaksi di bawah Rp200.000"
          ]
        }
      ]
    },
    {
      "id": "SOP-K-14",
      "title": "Pembelajaran Roleplay Kasir - Request Terapis",
      "url": "/videos/14. Roleplay Kasir - Request Terapis.mp4",
      "category": "SOP",
      "roleAccess": ["KASIR", "SUPERVISOR"],
      "isSoon": false,
      "desc": "Simulasi prosedur kasir dalam menangani permintaan khusus tamu terkait terapis senior, mencakup edukasi standar kualifikasi terapis di IKIGAI dan hal-hal yang dilarang (Do's & Don'ts) sesuai SOP.",
      "quiz": [
        {
          "q": "Apa jenis treatment yang diminta oleh tamu dalam video tersebut?",
          "a": "Body Massage",
          "options": [
            "Thai Massage",
            "Reflexology",
            "Body Massage",
            "Hot Stone Massage"
          ]
        },
        {
          "q": "Berapa durasi treatment yang diinginkan oleh tamu?",
          "a": "60 Menit (1 Jam)",
          "options": [
            "30 Menit",
            "60 Menit (1 Jam)",
            "90 Menit",
            "120 Menit"
          ]
        },
        {
          "q": "Apa permintaan khusus tamu terkait terapis yang akan menanganinya?",
          "a": "Terapis yang sudah senior",
          "options": [
            "Terapis laki-laki",
            "Terapis yang sudah senior",
            "Terapis yang paling ramah",
            "Terapis yang baru lulus training"
          ]
        },
        {
          "q": "Bagaimana cara kasir menjelaskan kualifikasi terapis di IKIGAI?",
          "a": "Menjelaskan bahwa semua terapis sudah senior dan menjalani training rutin",
          "options": [
            "Menyebutkan hanya ada beberapa terapis senior",
            "Menjelaskan bahwa semua terapis sudah senior dan menjalani training rutin",
            "Mengatakan terapis senior sedang sibuk semua",
            "Memberikan daftar nama terapis senior kepada tamu"
          ]
        },
        {
          "q": "Menurut video, apa yang dimiliki oleh semua terapis di IKIGAI untuk menjaga kualitas?",
          "a": "SOP yang sama",
          "options": [
            "Sertifikat internasional",
            "Seragam yang berbeda-beda",
            "SOP yang sama",
            "Jadwal kerja yang fleksibel"
          ]
        },
        {
          "q": "Apa prinsip yang disebutkan kasir mengenai kecocokan pijatan?",
          "a": "Pijatan itu cocok-cocokan",
          "options": [
            "Pijatan terapis senior pasti cocok untuk semua orang",
            "Pijatan itu cocok-cocokan",
            "Terapis baru lebih bertenaga pijatannya",
            "Semua tamu harus mencoba semua terapis"
          ]
        },
        {
          "q": "Apa hal pertama yang dilarang dilakukan kasir saat tamu meminta terapis senior?",
          "a": "Jangan menginfokan bahwa tidak punya terapis senior",
          "options": [
            "Tersenyum terlalu lebar",
            "Jangan menginfokan bahwa tidak punya terapis senior",
            "Menawarkan minuman jahe",
            "Meminta tamu menunggu di sofa"
          ]
        },
        {
          "q": "Mengapa kasir dilarang menginfokan adanya urutan rolling-an terapis kepada tamu?",
          "a": "Karena tamu tidak perlu tahu teknis pembagian jadwal internal",
          "options": [
            "Karena tamu tidak perlu tahu teknis pembagian jadwal internal",
            "Karena urutan tersebut rahasia negara",
            "Karena terapis tidak suka diatur",
            "Karena sistem rolling sering berubah-ubah"
          ]
        },
        {
          "q": "Mengapa kasir tidak diperbolehkan merekomendasikan nama terapis tertentu kepada tamu?",
          "a": "Karena semua terapis memiliki standar kualitas yang sama di bawah SOP IKIGAI",
          "options": [
            "Agar tidak terjadi kecemburuan antar terapis",
            "Karena semua terapis memiliki standar kualitas yang sama di bawah SOP IKIGAI",
            "Karena nama terapis sulit dihafal",
            "Karena tamu bebas memilih sendiri"
          ]
        },
        {
          "q": "Apa yang dilarang dijanjikan kasir kepada tamu terkait pemilihan terapis?",
          "a": "Jangan menjanjikan akan memberikan terapis terbaik",
          "options": [
            "Menjanjikan diskon tambahan",
            "Jangan menjanjikan akan memberikan terapis terbaik",
            "Menjanjikan durasi pijatan lebih lama",
            "Menjanjikan ruangan yang paling luas"
          ]
        }
      ]
    },
    {
      "id": "SOP-K-15",
      "title": "Pembelajaran Roleplay Kasir - Pembelian Voucher",
      "url": "/videos/15. Roleplay Kasir - Pembelian Voucher.mp4",
      "category": "SOP",
      "roleAccess": ["KASIR", "SUPERVISOR"],
      "isSoon": false,
      "desc": "Simulasi prosedur kasir dalam menawarkan paket promo voucher kepada tamu, mencakup detail mekanisme bonus voucher (Beli 10 Gratis 1 & Beli 15 Gratis 2), fleksibilitas harga berdasarkan treatment, serta masa berlaku voucher.",
      "quiz": [
        {
          "q": "Berapa jumlah voucher yang didapat pelanggan jika membeli paket 'Beli 10'?",
          "a": "11 Voucher",
          "options": [
            "10 Voucher",
            "11 Voucher",
            "12 Voucher",
            "13 Voucher"
          ]
        },
        {
          "q": "Berapa jumlah total voucher yang diterima jika pelanggan mengambil paket 'Beli 15'?",
          "a": "17 Voucher",
          "options": [
            "15 Voucher",
            "16 Voucher",
            "17 Voucher",
            "18 Voucher"
          ]
        },
        {
          "q": "Berapa lama masa berlaku (expired) voucher tersebut sejak tanggal pembelian?",
          "a": "1 Tahun",
          "options": [
            "3 Bulan",
            "6 Bulan",
            "1 Tahun",
            "2 Tahun"
          ]
        },
        {
          "q": "Apa yang menentukan harga dari paket voucher yang dibeli pelanggan?",
          "a": "Disesuaikan dengan jenis treatment yang diinginkan pelanggan",
          "options": [
            "Ditentukan secara acak oleh kasir",
            "Disesuaikan dengan jenis treatment yang diinginkan pelanggan",
            "Semua paket voucher harganya sama",
            "Tergantung pada jam kedatangan tamu"
          ]
        },
        {
          "q": "Manakah pernyataan yang benar mengenai masa berlaku voucher menurut video?",
          "a": "Berlaku satu tahun sejak hari pembelian",
          "options": [
            "Berlaku selamanya",
            "Berlaku satu tahun sejak hari pembelian",
            "Hanya berlaku di hari kerja (Weekdays)",
            "Berlaku satu bulan saja"
          ]
        },
        {
          "q": "Apa keuntungan utama membeli voucher secara paket menurut penjelasan staf?",
          "a": "Mendapatkan tambahan jumlah voucher gratis",
          "options": [
            "Mendapatkan merchandise gratis",
            "Mendapatkan tambahan jumlah voucher gratis",
            "Bisa digunakan oleh 100 orang sekaligus",
            "Tidak perlu antre saat datang"
          ]
        },
        {
          "q": "Siapa yang memberikan informasi mengenai promo voucher dalam video roleplay tersebut?",
          "a": "Kasir/Staf Frontliner",
          "options": [
            "Terapis",
            "Office Boy",
            "Kasir/Staf Frontliner",
            "Manager Area"
          ]
        },
        {
          "q": "Apakah harga voucher bersifat tetap (fixed) untuk semua jenis layanan?",
          "a": "Tidak, harganya fleksibel mengikuti menu treatment pilihan tamu",
          "options": [
            "Ya, harganya sama untuk semua menu",
            "Tidak, harganya fleksibel mengikuti menu treatment pilihan tamu",
            "Hanya tersedia untuk menu Reflexology",
            "Tidak disebutkan dalam video"
          ]
        },
        {
          "q": "Jika pelanggan ingin mengambil paket terbanyak yang disebutkan di video, berapa voucher yang harus dibayar?",
          "a": "15 Voucher",
          "options": [
            "10 Voucher",
            "11 Voucher",
            "15 Voucher",
            "17 Voucher"
          ]
        },
        {
          "q": "Alat bantu apa yang digunakan staf untuk menunjukkan rincian promo voucher?",
          "a": "Brosur/Flyer promo yang dipegang staf",
          "options": [
            "Papan iklan besar",
            "Brosur/Flyer promo yang dipegang staf",
            "Layar monitor komputer",
            "Buku menu utama"
          ]
        }
      ]
    },
    {
      "id": "SOP-K-16",
      "title": "Pembelajaran Roleplay Kasir - Tubuh Pegal",
      "url": "/videos/16. Roleplay Kasir - Tubuh Pegal.mp4",
      "category": "SOP",
      "roleAccess": ["KASIR", "SUPERVISOR"],
      "isSoon": false,
      "desc": "Simulasi prosedur kasir dalam memberikan edukasi kepada tamu mengenai reaksi tubuh yang umum terjadi setelah pemijatan, serta memberikan saran perawatan mandiri untuk relaksasi otot di rumah.",
      "quiz": [
        {
          "q": "Reaksi apa yang umum dirasakan tubuh setelah menjalani treatment di IKIGAI?",
          "a": "Tubuh terasa pegal-pegal atau sedikit nyeri",
          "options": [
            "Demam tinggi",
            "Tubuh terasa pegal-pegal atau sedikit nyeri",
            "Kulit terasa gatal",
            "Nafsu makan menurun"
          ]
        },
        {
          "q": "Berapa lama waktu yang dibutuhkan otot untuk beradaptasi setelah pemijatan?",
          "a": "1-2 hari sejak pemijatan",
          "options": [
            "Langsung setelah pijat selesai",
            "1-2 jam setelah pemijatan",
            "1-2 hari sejak pemijatan",
            "Satu minggu kemudian"
          ]
        },
        {
          "q": "Apa penyebab utama munculnya rasa pegal setelah pemijatan menurut video?",
          "a": "Otot beradaptasi dari tekanan dan peningkatan sirkulasi darah",
          "options": [
            "Terapis melakukan kesalahan teknik",
            "Otot beradaptasi dari tekanan dan peningkatan sirkulasi darah",
            "Ruangan pijat yang terlalu dingin",
            "Kurang tidur sebelum treatment"
          ]
        },
        {
          "q": "Apa saran pertama yang diberikan kepada tamu untuk membantu pemulihan otot?",
          "a": "Minum air putih yang cukup",
          "options": [
            "Minum air putih yang cukup",
            "Segera melakukan olahraga berat",
            "Minum obat tidur",
            "Melakukan pijat ulang di tempat lain"
          ]
        },
        {
          "q": "Peregangan ringan seperti apa yang disarankan oleh staf di dalam video?",
          "a": "Jalan santai",
          "options": [
            "Lari maraton",
            "Angkat beban",
            "Jalan santai",
            "Yoga tingkat lanjut"
          ]
        },
        {
          "q": "Apa metode relaksasi menggunakan air yang disarankan untuk otot?",
          "a": "Mandi atau dikompres dengan air hangat",
          "options": [
            "Mandi air es",
            "Berendam di air laut",
            "Mandi atau dikompres dengan air hangat",
            "Menggunakan uap panas (sauna)"
          ]
        },
        {
          "q": "Berapa lama biasanya rasa pegal tersebut akan hilang sepenuhnya?",
          "a": "1-3 hari",
          "options": [
            "Dalam hitungan jam",
            "1-3 hari",
            "5-7 hari",
            "Tidak akan hilang"
          ]
        },
        {
          "q": "Kondisi apa yang mengharuskan tamu untuk segera menghubungi pihak IKIGAI?",
          "a": "Jika terjadi pembengkakan atau rasa nyeri yang berlebihan",
          "options": [
            "Jika merasa terlalu rileks",
            "Jika ingin melakukan booking ulang",
            "Jika terjadi pembengkakan atau rasa nyeri yang berlebihan",
            "Jika ingin memberikan tip kepada terapis"
          ]
        },
        {
          "q": "Mengapa mandi air hangat disarankan setelah treatment?",
          "a": "Untuk relaksasi otot",
          "options": [
            "Untuk membersihkan sisa minyak pijat saja",
            "Untuk relaksasi otot",
            "Agar tamu merasa segar kembali",
            "Untuk menurunkan berat badan"
          ]
        },
        {
          "q": "Bagaimana sikap staf saat memberikan edukasi pasca-treatment kepada tamu?",
          "a": "Formal, sopan, dan memberikan informasi dengan jelas",
          "options": [
            "Terburu-buru dan tidak sabar",
            "Formal, sopan, dan memberikan informasi dengan jelas",
            "Mengabaikan keluhan tamu",
            "Menggunakan bahasa medis yang sulit dimengerti"
          ]
        }
      ]
    },
    {
      "id": "SOP-K-17",
      "title": "Pembelajaran Roleplay Kasir - Penanganan Keluhan Kurang Waktu",
      "url": "/videos/17. Roleplay Kasir - Kurang Waktu.mp4",
      "category": "SOP",
      "roleAccess": ["KASIR", "SUPERVISOR"],
      "isSoon": false,
      "desc": "Simulasi prosedur kasir dalam menangani keluhan tamu mengenai kekurangan durasi treatment, mencakup validasi data sistem, konfirmasi terapis, pemberian solusi sisa waktu, hingga penanganan komplain jika data sistem sudah sesuai.",
      "quiz": [
        {
          "q": "Apa keluhan utama yang disampaikan tamu dalam video tersebut?",
          "a": "Waktu pijat dirasa kurang 10 menit",
          "options": [
            "Terapis tidak ramah",
            "Ruangan pijat terlalu dingin",
            "Waktu pijat dirasa kurang 10 menit",
            "Harga treatment tidak sesuai"
          ]
        },
        {
          "q": "Apa langkah pertama yang dilakukan kasir setelah mendengar keluhan tamu?",
          "a": "Meminta maaf dan meminta izin untuk mengecek sistem serta konfirmasi ke terapis",
          "options": [
            "Langsung memberikan voucher gratis",
            "Meminta maaf dan meminta izin untuk mengecek sistem serta konfirmasi ke terapis",
            "Menyalahkan tamu karena salah hitung",
            "Meminta tamu untuk kembali ke ruangan tanpa penjelasan"
          ]
        },
        {
          "q": "Pada skenario kesalahan dari IKIGAI, jam berapa tamu tercatat mulai dan selesai treatment di sistem?",
          "a": "13.00 - 14.20 (Kurang 10 menit dari seharusnya 1,5 jam)",
          "options": [
            "13.00 - 14.20 (Kurang 10 menit dari seharusnya 1,5 jam)",
            "13.00 - 14.30 (Durasi sudah pas)",
            "12.30 - 14.00",
            "14.00 - 15.30"
          ]
        },
        {
          "q": "Opsi apa yang ditawarkan kasir jika tamu sudah terlanjur memakai baju kembali namun ingin melanjutkan sisa waktu 10 menit?",
          "a": "Pijat kering atau pijat di area kepala saja",
          "options": [
            "Tamu harus melepas baju kembali",
            "Pijat kering atau pijat di area kepala saja",
            "Memberikan uang tunai sebagai ganti",
            "Pijat kaki di area lobby"
          ]
        },
        {
          "q": "Bagaimana cara kasir menangani keluhan jika ternyata durasi di sistem sudah sesuai (kesalahan dari tamu)?",
          "a": "Menunjukkan data sistem dengan sopan dan tetap menjadikan masukan tamu sebagai evaluasi",
          "options": [
            "Tertawa karena tamu salah hitung",
            "Menunjukkan data sistem dengan sopan dan tetap menjadikan masukan tamu sebagai evaluasi",
            "Memaksa tamu untuk membayar denda",
            "Menghiraukan keluhan tamu karena data sudah benar"
          ]
        },
        {
          "q": "Mengapa kasir dilarang langsung menawarkan voucher atau refund saat tamu mengeluh durasi?",
          "a": "Karena harus dilakukan pengecekan data sistem dan konfirmasi terapis terlebih dahulu untuk validasi",
          "options": [
            "Karena voucher sangat mahal",
            "Karena harus dilakukan pengecekan data sistem dan konfirmasi terapis terlebih dahulu untuk validasi",
            "Agar tamu merasa tidak dihargai",
            "Karena manager tidak mengizinkan"
          ]
        },
        {
          "q": "Apa hal yang dilarang diucapkan kasir saat menjelaskan alasan kekurangan waktu kepada tamu?",
          "a": "Hal ini biasanya terjadi karena admin salah hitung waktu",
          "options": [
            "Terima kasih atas masukannya",
            "Hal ini biasanya terjadi karena admin salah hitung waktu",
            "Kami akan evaluasi kedepannya",
            "Mohon maaf atas ketidaknyamanannya"
          ]
        },
        {
          "q": "Menurut video, sikap apa yang harus dihindari kasir saat menghadapi keluhan tamu?",
          "a": "Langsung menyalahkan tamu atas kesalahan perhitungan durasi",
          "options": [
            "Mendengarkan dengan seksama",
            "Langsung menyalahkan tamu atas kesalahan perhitungan durasi",
            "Tetap tenang dan profesional",
            "Meminta maaf secara tulus"
          ]
        },
        {
          "q": "Bagaimana prosedur kasir untuk memastikan pakaian tamu tidak kotor saat melanjutkan sisa waktu pijat?",
          "a": "Mengalaskan pakaian tamu dengan kain/handuk saat pemijatan",
          "options": [
            "Meminta tamu berganti baju lagi",
            "Mengalaskan pakaian tamu dengan kain/handuk saat pemijatan",
            "Meminta terapis mencuci tangan lebih lama",
            "Menyarankan tamu untuk mandi setelahnya"
          ]
        },
        {
          "q": "Apa tujuan utama dari penanganan keluhan yang profesional sesuai SOP IKIGAI?",
          "a": "Menjaga kepuasan tamu dan kredibilitas pelayanan meskipun terjadi kesalahan",
          "options": [
            "Agar tamu cepat pulang",
            "Menjaga kepuasan tamu dan kredibilitas pelayanan meskipun terjadi kesalahan",
            "Menghindari kerugian uang perusahaan saja",
            "Menghukum terapis yang bertugas"
          ]
        }
      ]
    },
    {
      "id": "SOP-K-18",
      "title": "Pembelajaran Roleplay Kasir - Penyakit Tamu",
      "url": "/videos/18. Roleplay Kasir - Penyakit Tamu.mp4",
      "category": "SOP",
      "roleAccess": ["KASIR", "SUPERVISOR"],
      "isSoon": false,
      "desc": "Simulasi prosedur kasir dalam menangani tamu yang memiliki riwayat penyakit menular atau kondisi kulit tertentu, mencakup cara bertanya secara sopan, validasi keamanan melalui Supervisor, serta menjaga standar hygiene operasional.",
      "quiz": [
        {
          "q": "Apa hal pertama yang harus dilakukan kasir saat tamu menginfokan bahwa mereka memiliki riwayat penyakit?",
          "a": "Meminta maaf dan menanyakan detail riwayat penyakitnya secara sopan",
          "options": [
            "Melarang tamu masuk secara kasar",
            "Meminta maaf dan menanyakan detail riwayat penyakitnya secara sopan",
            "Memberikan diskon langsung",
            "Menyuruh tamu pulang dan berobat dulu"
          ]
        },
        {
          "q": "Penyakit spesifik apa yang disebutkan oleh tamu dalam video roleplay tersebut?",
          "a": "Eksim basah",
          "options": [
            "Flu burung",
            "Eksim basah",
            "Asma",
            "Darah tinggi"
          ]
        },
        {
          "q": "Mengapa kasir perlu mengetahui jenis penyakit kulit tamu (seperti eksim basah) sebelum treatment?",
          "a": "Karena penyakit kulit menular/basah berisiko bagi terapis dan alat hygiene IKIGAI",
          "options": [
            "Untuk menentukan harga tambahan",
            "Karena penyakit kulit menular/basah berisiko bagi terapis dan alat hygiene IKIGAI",
            "Agar bisa difoto untuk laporan",
            "Tidak ada alasan khusus"
          ]
        },
        {
          "q": "Apa tindakan kasir setelah mengetahui tamu memiliki riwayat eksim basah?",
          "a": "Meminta tamu menunggu sebentar untuk dilakukan pengecekan kondisi lebih lanjut",
          "options": [
            "Langsung menolak di tempat",
            "Meminta tamu menunggu sebentar untuk dilakukan pengecekan kondisi lebih lanjut",
            "Mengajak tamu langsung ke ruangan",
            "Menyuruh terapis langsung memijat tanpa sarung tangan"
          ]
        },
        {
          "q": "Metode apa yang disarankan dalam video bagi kasir untuk mengecek apakah suatu penyakit boleh dipijat atau tidak?",
          "a": "Mengecek melalui Google atau berdiskusi dengan Supervisor (SPV)",
          "options": [
            "Menanyakan ke tamu lain",
            "Menebak-nebak sendiri",
            "Mengecek melalui Google atau berdiskusi dengan Supervisor (SPV)",
            "Mengabaikan saja dan lanjut transaksi"
          ]
        },
        {
          "q": "Apa kategori utama kondisi yang dibahas dalam video roleplay tersebut?",
          "a": "Penyakit Menular/Kondisi Kulit",
          "options": [
            "Penyakit Dalam",
            "Penyakit Menular/Kondisi Kulit",
            "Cedera Otot",
            "Gangguan Mental"
          ]
        },
        {
          "q": "Bagaimana sikap kasir saat menginfokan bahwa kondisi tamu perlu dicek terlebih dahulu?",
          "a": "Sopan, tenang, dan tetap profesional",
          "options": [
            "Panik dan menjauh dari tamu",
            "Sopan, tenang, dan tetap profesional",
            "Ketus karena merasa jijik",
            "Acuh tak acuh"
          ]
        },
        {
          "q": "Siapa pihak internal yang paling tepat diajak diskusi oleh kasir jika ragu mengenai kondisi kesehatan tamu?",
          "a": "Supervisor (SPV)",
          "options": [
            "Office Boy",
            "Rekan sesama Kasir saja",
            "Supervisor (SPV)",
            "Customer Service pusat"
          ]
        },
        {
          "q": "Mengapa IKIGAI harus selektif terhadap tamu dengan penyakit kulit terbuka/basah?",
          "a": "Untuk menjaga keamanan terapis dan standar kebersihan (hygiene) bagi tamu berikutnya",
          "options": [
            "Agar tidak rugi minyak pijat",
            "Untuk menjaga keamanan terapis dan standar kebersihan (hygiene) bagi tamu berikutnya",
            "Karena terapis malas mencuci tangan",
            "Karena peraturan pemerintah"
          ]
        },
        {
          "q": "Apa tujuan utama dari roleplay penanganan penyakit tamu ini?",
          "a": "Memastikan kasir mampu menangani situasi sensitif sesuai SOP kesehatan dan keamanan",
          "options": [
            "Mengajarkan cara menolak tamu sebanyak-banyaknya",
            "Memastikan kasir mampu menangani situasi sensitif sesuai SOP kesehatan dan keamanan",
            "Mengurangi beban kerja terapis",
            "Menambah durasi waktu tunggu tamu"
          ]
        }
      ]
    },
    {
      "id": "SOP-K-19",
      "title": "Pembelajaran Roleplay Kasir - Penanganan Tamu Melanggar SOP (Blacklist)",
      "url": "/videos/19. Roleplay Kasir - Tamu Nakal.mp4",
      "category": "SOP",
      "roleAccess": ["KASIR", "SUPERVISOR"],
      "isSoon": false,
      "desc": "Simulasi ketegasan staf kasir dalam menangani tamu yang melanggar etika dan SOP pelayanan, mencakup prosedur konfirmasi laporan terapis, penegakan identitas IKIGAI sebagai pijat keluarga, hingga proses memasukkan data ke daftar Blacklist seluruh cabang.",
      "quiz": [
        {
          "q": "Apa laporan yang diberikan terapis kepada kasir mengenai tamu tersebut?",
          "a": "Tamu meminta treatment yang tidak sesuai dengan SOP IKIGAI",
          "options": [
            "Tamu tidak mau membayar",
            "Tamu meminta treatment yang tidak sesuai dengan SOP IKIGAI",
            "Tamu merusak fasilitas ruangan",
            "Tamu datang terlambat"
          ]
        },
        {
          "q": "Bagaimana sikap awal kasir saat mengonfirmasi laporan terapis kepada tamu?",
          "a": "Tegas, profesional, dan berbicara secara pribadi (tidak di depan umum)",
          "options": [
            "Marah-marah di depan tamu lain",
            "Berbicara dengan nada tinggi dan menuduh",
            "Tegas, profesional, and berbicara secara pribadi (tidak di depan umum)",
            "Langsung memanggil polisi tanpa bicara"
          ]
        },
        {
          "q": "Apa tindakan yang dilakukan kasir terhadap data tamu yang melanggar aturan tersebut?",
          "a": "Memasukkan nama tamu ke dalam daftar Blacklist",
          "options": [
            "Menghapus datanya dari sistem",
            "Memasukkan nama tamu ke dalam daftar Blacklist",
            "Memberikan diskon agar tamu tidak marah",
            "Mengubah nama tamu di sistem"
          ]
        },
        {
          "q": "Mengapa tamu tersebut dimasukkan ke dalam daftar Blacklist?",
          "a": "Agar tamu tidak bisa melakukan kunjungan kembali ke seluruh cabang IKIGAI",
          "options": [
            "Agar tamu tidak bisa melakukan kunjungan kembali ke seluruh cabang IKIGAI",
            "Agar tamu mendapatkan harga lebih mahal di kunjungan berikutnya",
            "Agar terapis mendapatkan bonus",
            "Hanya untuk menakut-nakuti tamu saja"
          ]
        },
        {
          "q": "Apa alasan utama kasir menolak permintaan tamu yang tidak sesuai SOP?",
          "a": "Karena IKIGAI adalah tempat pijat keluarga yang menjunjung tinggi kebersihan dan etika (profesional)",
          "options": [
            "Karena terapis sedang lelah",
            "Karena IKIGAI adalah tempat pijat keluarga yang menjunjung tinggi kebersihan dan etika (profesional)",
            "Karena harganya belum ditentukan",
            "Karena ruangan akan segera dipakai tamu lain"
          ]
        },
        {
          "q": "Apa yang harus dilakukan kasir jika tamu mencoba membela diri atau menyuap staf?",
          "a": "Tetap teguh pada SOP dan menolak pembelaan yang tidak berdasar",
          "options": [
            "Menerima suapan tersebut secara diam-diam",
            "Tetap teguh pada SOP dan menolak pembelaan yang tidak berdasar",
            "Meminta maaf kepada tamu karena sudah menegur",
            "Membiarkan tamu melakukan apa saja asal membayar mahal"
          ]
        },
        {
          "q": "Siapa yang harus segera dihubungi kasir jika tamu menunjukkan perilaku agresif saat ditegur?",
          "a": "Supervisor (SPV) atau pihak keamanan (Security)",
          "options": [
            "Staf kebersihan",
            "Supervisor (SPV) atau pihak keamanan (Security)",
            "Keluarga tamu",
            "Terapis yang bersangkutan saja"
          ]
        },
        {
          "q": "Apa pesan moral/tujuan utama dari adanya SOP Blacklist ini?",
          "a": "Melindungi keamanan dan martabat seluruh staf IKIGAI dari perilaku tidak pantas",
          "options": [
            "Menghargai semua keinginan tamu tanpa kecuali",
            "Melindungi keamanan dan martabat seluruh staf IKIGAI dari perilaku tidak pantas",
            "Meningkatkan omzet perusahaan",
            "Mengurangi jumlah tamu yang datang"
          ]
        },
        {
          "q": "Bagaimana prosedur penutupan transaksi bagi tamu yang melanggar SOP ini?",
          "a": "Tetap menagih biaya treatment yang sudah berjalan dan meminta tamu segera meninggalkan lokasi",
          "options": [
            "Transaksi dibatalkan dan tamu diusir tanpa bayar",
            "Tetap menagih biaya treatment yang sudah berjalan dan meminta tamu segera meninggalkan lokasi",
            "Memberikan hadiah perpisahan",
            "Meminta tamu menunggu di lobby selama 2 jam"
          ]
        },
        {
          "q": "Di mana saja daftar Blacklist tersebut berlaku?",
          "a": "Di seluruh cabang IKIGAI",
          "options": [
            "Hanya di cabang tempat kejadian",
            "Di seluruh cabang IKIGAI",
            "Hanya untuk terapis tertentu",
            "Berlaku hanya untuk satu minggu saja"
          ]
        }
      ]
    },
    {
      "id": "SOP-K-20",
      "title": "Pembelajaran Roleplay Kasir - Permintaan Maaf atas Komplain",
      "url": "/videos/20. Roleplay Kasir - Permintamaafan Komplain.mp4",
      "category": "SOP",
      "roleAccess": ["KASIR", "SUPERVISOR"],
      "isSoon": false,
      "desc": "Simulasi prosedur kasir dalam menangani keluhan tamu dengan empati, mencakup penggunaan gesture yang tepat, teknik validasi perasaan tamu, serta komitmen terhadap evaluasi internal demi perbaikan layanan.",
      "quiz": [
        {
          "q": "Apa kalimat pertama yang harus diucapkan staf saat menerima komplain dari tamu?",
          "a": "Kami minta maaf ya Kak atas ketidaknyamanannya.",
          "options": [
            "Bukan salah kami Kak.",
            "Kami minta maaf ya Kak atas ketidaknyamanannya.",
            "Kenapa baru komplain sekarang Kak?",
            "Silakan tulis di kertas saja Kak."
          ]
        },
        {
          "q": "Apa tujuan utama dari meminta maaf kepada tamu meskipun staf merasa sudah benar?",
          "a": "Memvalidasi perasaan tamu dan meredam emosi agar suasana tetap kondusif.",
          "options": [
            "Menunjukkan kelemahan perusahaan.",
            "Merendahkan diri di depan tamu.",
            "Memvalidasi perasaan tamu dan meredam emosi agar suasana tetap kondusif.",
            "Agar tamu cepat pergi dari outlet."
          ]
        },
        {
          "q": "Berdasarkan video, apa yang dijanjikan staf kepada tamu setelah meminta maaf?",
          "a": "Melakukan evaluasi internal agar pelayanan ke depan lebih baik.",
          "options": [
            "Memberikan kompensasi uang tunai.",
            "Melaporkan tamu ke pihak berwajib.",
            "Melakukan evaluasi internal agar pelayanan ke depan lebih baik.",
            "Menutup outlet untuk sementara."
          ]
        },
        {
          "q": "Bagaimana sikap tubuh (gesture) yang ditunjukkan staf saat meminta maaf dalam video?",
          "a": "Menangkupkan kedua tangan di depan dada (sikap hormat/salam).",
          "options": [
            "Melipat tangan di dada.",
            "Menangkupkan kedua tangan di depan dada (sikap hormat/salam).",
            "Membelakangi tamu.",
            "Menunjuk-nunjuk tamu."
          ]
        },
        {
          "q": "Mengapa staf harus mengatakan 'Terima kasih atas masukannya'?",
          "a": "Sebagai bentuk apresiasi karena tamu membantu IKIGAI menemukan celah kekurangan pelayanan.",
          "options": [
            "Karena staf sangat senang dikritik.",
            "Sebagai bentuk apresiasi karena tamu membantu IKIGAI menemukan celah kekurangan pelayanan.",
            "Agar tamu merasa malu karena sudah mengeluh.",
            "Hanya sekadar basa-basi SOP saja."
          ]
        },
        {
          "q": "Apa yang dilarang dilakukan staf saat tamu sedang menyampaikan keluhannya?",
          "a": "Memotong pembicaraan tamu dengan nada defensif/membela diri.",
          "options": [
            "Mendengarkan dengan tenang.",
            "Memotong pembicaraan tamu dengan nada defensif/membela diri.",
            "Mencatat poin-poin komplain.",
            "Menatap mata tamu dengan sopan."
          ]
        },
        {
          "q": "Kata kunci apa yang paling menonjol dalam penyampaian maaf di video tersebut?",
          "a": "Evaluasi dan Ketidaknyamanan.",
          "options": [
            "Evaluasi dan Ketidaknyamanan.",
            "Diskon dan Gratis.",
            "Salah dan Benar.",
            "Lupa dan Maaf."
          ]
        },
        {
          "q": "Kepada siapa staf akan menyampaikan masukan dari tamu tersebut?",
          "a": "Manajemen/Tim Internal untuk evaluasi.",
          "options": [
            "Teman sejawat saja.",
            "Keluarga staf.",
            "Manajemen/Tim Internal untuk evaluasi.",
            "Tidak disampaikan ke siapa pun."
          ]
        },
        {
          "q": "Bagaimana nada bicara staf yang tepat saat menghadapi tamu yang komplain?",
          "a": "Tenang, stabil, dan penuh empati.",
          "options": [
            "Tinggi dan menantang.",
            "Lemah dan berbisik.",
            "Tenang, stabil, dan penuh empati.",
            "Tertawa agar suasana cair."
          ]
        },
        {
          "q": "Apa hasil yang diharapkan dari penanganan komplain yang baik sesuai video?",
          "a": "Tamu merasa dihargai dan tetap memiliki citra positif terhadap IKIGAI.",
          "options": [
            "Tamu tidak jadi membayar.",
            "Tamu merasa dihargai dan tetap memiliki citra positif terhadap IKIGAI.",
            "Staf mendapatkan hukuman.",
            "Tamu kapok untuk datang kembali."
          ]
        }
      ]
    },
    // ==========================================
    // TERAPIS - SOP
    // ==========================================
    {
      id: "SOP-T-01",
      title: "Video Pengenalan Terapis IKIGAI",
      url: "/videos/sop-terapis-intro.mp4",
      category: "SOP",
      roleAccess: ["TERAPIS", "SUPERVISOR"],
      isSoon: false,
      desc: "Standar etika, grooming (penampilan), dan perilaku profesional seorang Terapis IKIGAI.",
      quiz: [
        { q: "Bagaimana standar penampilan (grooming) Terapis IKIGAI?", a: "Rapi, bersih, dan wangi", options: ["Bebas asal nyaman", "Rapi, bersih, dan wangi", "Menggunakan aksesoris berlebihan"] },
        { q: "Apa hal pertama yang dilakukan saat bertemu tamu di area treatment?", a: "Tersenyum dan memberi salam hangat", options: ["Langsung menyuruh tamu tiduran", "Tersenyum dan memberi salam hangat", "Menanyakan tips"] },
        { q: "Mengapa kebersihan kuku sangat penting bagi Terapis?", a: "Menjaga higiene dan keamanan kulit tamu", options: ["Hanya untuk hiasan", "Menjaga higiene dan keamanan kulit tamu", "Agar terlihat cantik"] },
        { q: "Sikap apa yang harus ditunjukkan saat tamu sedang istirahat/treatment?", a: "Tenang dan tidak berisik", options: ["Mengajak ngobrol terus", "Tenang dan tidak berisik", "Bermain HP di dekat tamu"] },
        { q: "Apa yang dilakukan jika Terapis merasa kurang sehat?", a: "Lapor ke Supervisor untuk dicarikan pengganti", options: ["Tetap bekerja paksa", "Lapor ke Supervisor untuk dicarikan pengganti", "Langsung pulang tanpa kabar"] }
      ]
    },
    {
      id: "SOP-T-02",
      title: "Video SOP Terapis IKIGAI",
      url: "/videos/sop-terapis-core.mp4",
      category: "SOP",
      roleAccess: ["TERAPIS", "SUPERVISOR"],
      isSoon: false,
      desc: "Langkah-langkah teknis pelayanan, persiapan ruangan, hingga penutupan treatment.",
      quiz: [
        { q: "Apa yang harus dipastikan sebelum tamu masuk ke ruangan?", a: "Ruangan bersih, rapi, dan alat siap", options: ["Ruangan gelap saja", "Ruangan bersih, rapi, dan alat siap", "AC dimatikan"] },
        { q: "Bagaimana cara menanyakan kenyamanan tekanan pijatan?", a: "Tanya dengan sopan di awal treatment", options: ["Tidak perlu ditanyakan", "Tanya dengan sopan di awal treatment", "Tunggu tamu berteriak sakit"] },
        { q: "Apa yang dilakukan setelah treatment selesai?", a: "Menawarkan air minum & bantu tamu bersiap", options: ["Langsung meninggalkan ruangan", "Menawarkan air minum & bantu tamu bersiap", "Meminta tips secara langsung"] },
        { q: "Bagaimana prosedur menangani handuk/linen kotor?", a: "Letakkan di wadah tertutup yang disediakan", options: ["Tumpuk di lantai ruangan", "Letakkan di wadah tertutup yang disediakan", "Biarkan saja di tempat tidur"] },
        { q: "Pentingnya mengikuti durasi treatment yang ditentukan agar?", a: "Pelayanan konsisten & jadwal tamu lain terjaga", options: ["Agar cepat selesai", "Pelayanan konsisten & jadwal tamu lain terjaga", "Agar Terapis bisa istirahat lebih lama"] }
      ]
    },
  // ==========================================
    // OPERASIONAL - SOP
    // ==========================================
    {
      id: "SOP-O-01",
      title: "Video Pengenalan Operasional IKIGAI",
      url: "/videos/sop-operasional-intro.mp4",
      category: "SOP",
      roleAccess: ["OPERASIONAL", "SUPERVISOR"],
      isSoon: false,
      desc: "Panduan umum alur kerja operasional, standar kebersihan area umum, dan koordinasi antar tim di outlet.",
      quiz: [
        { 
          q: "Apa fokus utama dari SOP Operasional IKIGAI?", 
          a: "Kelancaran alur kerja dan kenyamanan outlet", 
          options: ["Hanya mengatur bagian kasir", "Kelancaran alur kerja dan kenyamanan outlet", "Menghitung gaji bulanan"] 
        },
        { 
          q: "Siapa yang bertanggung jawab menjaga kebersihan area umum outlet?", 
          a: "Seluruh tim operasional sesuai pembagian tugas", 
          options: ["Hanya tamu yang datang", "Seluruh tim operasional sesuai pembagian tugas", "Hanya staff Head Office"] 
        },
        { 
          q: "Bagaimana prosedur penanganan fasilitas outlet yang rusak?", 
          a: "Segera lapor ke Supervisor untuk ditindaklanjuti", 
          options: ["Dibiarkan sampai rusak parah", "Segera lapor ke Supervisor untuk ditindaklanjuti", "Mencoba memperbaiki tanpa izin"] 
        },
        { 
          q: "Mengapa koordinasi antar tim (Kasir, Terapis, OB) sangat penting?", 
          a: "Agar pelayanan tamu berjalan tanpa hambatan", 
          options: ["Agar bisa istirahat bersamaan", "Agar pelayanan tamu berjalan tanpa hambatan", "Hanya sebagai formalitas saja"] 
        },
        { 
          q: "Apa yang harus dipastikan saat jam operasional berakhir (Closing)?", 
          a: "Seluruh peralatan dimatikan dan area bersih kembali", 
          options: ["Langsung pulang tanpa cek ruangan", "Seluruh peralatan dimatikan dan area bersih kembali", "Menunggu instruksi satpam"] 
        }
      ]
    },
    // ==========================================
    // SUPERVISOR (SPV) - EXCLUSIVE SOP
    // ==========================================
    {
      id: "SOP-S-01",
      title: "Video Pengenalan Ass. SPV / SPV",
      url: "/videos/sop-spv-intro.mp4",
      category: "SOP",
      roleAccess: ["SUPERVISOR"],
      isSoon: false,
      desc: "Visi misi, struktur organisasi, dan tanggung jawab manajerial pimpinan outlet.",
      quiz: [
        { 
          q: "Apa peran utama seorang SPV dalam struktur IKIGAI?", 
          a: "Menjadi jembatan antara Manajemen HO dan tim outlet", 
          options: ["Hanya mengawasi kasir", "Menjadi jembatan antara Manajemen HO dan tim outlet", "Bekerja sendiri tanpa tim"] 
        },
        { 
          q: "Apa tanggung jawab moral seorang pimpinan outlet?", 
          a: "Menjaga motivasi tim dan standar kualitas layanan", 
          options: ["Menghukum staff yang tidak disukai", "Menjaga motivasi tim dan standar kualitas layanan", "Hanya fokus pada jam pulang"] 
        },
        { 
          q: "Dalam menghadapi konflik tim, sikap SPV sebaiknya?", 
          a: "Netral, mendengarkan, dan memberi solusi adil", 
          options: ["Memihak salah satu", "Netral, mendengarkan, dan memberi solusi adil", "Membiarkan konflik membesar"] 
        },
        { 
          q: "Apa fungsi laporan periodik yang dikirim SPV ke HO?", 
          a: "Bahan evaluasi untuk pengembangan outlet", 
          options: ["Hanya formalitas administratif", "Bahan evaluasi untuk pengembangan outlet", "Untuk pamer hasil kerja"] 
        },
        { 
          q: "Bagaimana cara SPV memastikan SOP berjalan di outlet?", 
          a: "Briefing rutin dan kontrol lapangan secara langsung", 
          options: ["Cukup percaya tanpa mengecek", "Briefing rutin dan kontrol lapangan secara langsung", "Hanya membaca laporan lewat chat"] 
        }
      ]
    },
    {
      id: "SOP-S-02",
      title: "Tips & Trick to be SPV IKIGAI",
      url: "/videos/sop-spv-tips.mp4",
      category: "SOP",
      roleAccess: ["SUPERVISOR"],
      isSoon: false,
      desc: "Strategi mengelola tim, mencapai target KPI, dan menjaga performa outlet agar tetap stabil.",
      quiz: [
        { 
          q: "Bagaimana cara efektif meningkatkan omzet outlet (KPI)?", 
          a: "Mengarahkan tim untuk upselling dan service excellence", 
          options: ["Memaksa tamu membayar lebih", "Mengarahkan tim untuk upselling dan service excellence", "Menunggu tamu datang sendiri"] 
        },
        { 
          q: "Apa strategi menghadapi jam sibuk (peak season) di outlet?", 
          a: "Delegasi tugas yang jelas dan atur rotasi istirahat", 
          options: ["Semua tim bekerja tanpa istirahat", "Delegasi tugas yang jelas dan atur rotasi istirahat", "Menutup booking secara sepihak"] 
        },
        { 
          q: "Bagaimana cara menjaga hubungan baik dengan pelanggan loyal?", 
          a: "Personalized service dan hospitality yang tulus", 
          options: ["Memberi diskon tanpa izin pusat", "Personalized service dan hospitality yang tulus", "Meminta kontak pribadi untuk kepentingan sendiri"] 
        },
        { 
          q: "Apa yang harus dilakukan SPV jika target bulanan tidak tercapai?", 
          a: "Analisis kendala dan buat strategi perbaikan", 
          options: ["Menyalahkan seluruh staff", "Analisis kendala dan buat strategi perbaikan", "Menyerah dan berhenti mencoba"] 
        },
        { 
          q: "Seorang SPV yang baik adalah mereka yang mampu?", 
          a: "Mencetak staff yang kompeten dan mandiri", 
          options: ["Bekerja paling keras sendirian", "Mencetak staff yang kompeten dan mandiri", "Hanya memberi perintah lewat HP"] 
        }
      ]
    },
    
  // ==========================================
    // KASIR - USER GUIDES
    // ==========================================
    {
      id: "K-01",
      title: "IKIGAI Dealpos",
      url: "/videos/guide-dealpos.mp4",
      category: "User Guide",
      roleAccess: ["KASIR", "SUPERVISOR"],
      isSoon: false,
      desc: "Panduan penggunaan Dealpos untuk kasir outlet.",
      quiz: [
        { q: "Apa fungsi utama Dealpos?", a: "Pencatatan Transaksi", options: ["Edit Foto", "Pencatatan Transaksi", "Main Game"] },
        { q: "Bagaimana cara mencatat penjualan tunai?", a: "Pilih menu Sales & Payment", options: ["Buka menu Inventory", "Pilih menu Sales & Payment", "Klik Logout"] },
        { q: "Dimana kita melihat histori transaksi harian?", a: "Sales Report", options: ["Settings", "Sales Report", "User Profile"] },
        { q: "Apa yang dilakukan jika printer struk mati?", a: "Cek koneksi kabel & kertas", options: ["Cek koneksi kabel & kertas", "Diamkan saja", "Hapus aplikasi"] },
        { q: "Dealpos adalah sistem berjenis?", a: "Point of Sales (POS)", options: ["Sistem HRD", "Point of Sales (POS)", "Aplikasi Chatting"] }
      ]
    },
    {
      "id": "K-02-A",
      "title": "IKIGAI HRIS Kasir: Login & Dashboard",
      "url": "/videos/IKIGAI HRIS Kasir (Login dan Dashboard).mp4",
      "category": "User Guide",
      "roleAccess": ["KASIR", "SUPERVISOR"],
      "isSoon": false,
      "desc": "Panduan login sistem HRIS dan navigasi dashboard untuk memantau data operasional serta kehadiran karyawan secara real-time.",
      "quiz": [
        {
          "q": "Untuk mulai masuk ke sistem IKIGAI HRIS, apa langkah dan alamat website yang benar?",
          "a": "Membuka browser Google Chrome dan mengetik ikigaihris.com pada kolom alamat",
          "options": [
            "Mencari aplikasi \"Ikigai HRIS\" di Play Store komputer",
            "Membuka browser Google Chrome dan mengetik ikigaihris.com pada kolom alamat",
            "Membuka browser apa saja lalu mengetik hris-karyawan.com",
            "Menghubungi IT Pusat untuk meminta link eksternal"
          ]
        },
        {
          "q": "Data apa yang harus dimasukkan agar bisa login ke sistem?",
          "a": "Alamat Email resmi dan Kata Sandi (Password) Anda",
          "options": [
            "Nama Lengkap dan Nomor Induk Karyawan (NIK)",
            "Username dan Kode Cabang Khusus",
            "Alamat Email resmi dan Kata Sandi (Password) Anda",
            "Nomor HP yang terdaftar dan PIN Kasir"
          ]
        },
        {
          "q": "Jika komputer kasir hanya dipakai oleh Anda sendiri dan tidak ingin mengetik ulang email & password setiap hari, fitur apa yang sebaiknya dicentang sebelum klik login?",
          "a": "Mencentang kotak \"Remember Me\"",
          "options": [
            "Mengklik tombol \"Forgot your password?\"",
            "Mencentang kotak \"Remember Me\"",
            "Menyalin kata sandi ke dalam aplikasi Notepad",
            "Meminta sistem melakukan pembaruan otomatis setiap 24 jam"
          ]
        },
        {
          "q": "Setelah berhasil login, halaman apa yang pertama kali muncul dan menampilkan ringkasan data operasional?",
          "a": "Halaman Dashboard (Ringkasan Data)",
          "options": [
            "Halaman Pengaturan Akun",
            "Halaman Laporan Gaji Bulanan",
            "Halaman Dashboard (Ringkasan Data)",
            "Halaman Riwayat Kehadiran Harian"
          ]
        },
        {
          "q": "Jika dashboard menampilkan data seluruh cabang, padahal Anda bekerja di cabang GS, bagaimana cara menampilkan data khusus cabang Anda saja?",
          "a": "Memilih opsi 'GS' pada menu drop-down \"Filter Cabang\" di bagian atas",
          "options": [
            "Mengubah pengaturan profil akun menjadi mode \"Kasir GS\"",
            "Memilih opsi 'GS' pada menu drop-down \"Filter Cabang\" di bagian atas",
            "Menggunakan \"Fitur Pencarian Nama\" dan mengetik kata kunci \"GS\"",
            "Memilih opsi 'GS' pada menu \"Filter Role\""
          ]
        },
        {
          "q": "Di dashboard ada kolom \"Jumlah Off\" dengan angka 1. Apa arti angka tersebut?",
          "a": "Ada 1 karyawan yang terjadwal sedang tidak bertugas (libur)",
          "options": [
            "Ada 1 karyawan yang tidak masuk karena mendadak sakit",
            "Ada 1 karyawan yang sudah resmi keluar (resign) dari perusahaan",
            "Ada 1 karyawan yang terjadwal sedang tidak bertugas (libur)",
            "Ada 1 karyawan yang lupa melakukan absen masuk ke sistem"
          ]
        },
        {
          "q": "Apakah data jumlah karyawan masuk yang tertera di dashboard adalah data saat itu juga, atau data hari sebelumnya?",
          "a": "Data real-time yang mencerminkan kondisi aktual saat itu juga",
          "options": [
            "Data harian yang baru akan ter-update secara manual setiap malam hari",
            "Data masa lalu (statistik akumulasi dari bulan sebelumnya)",
            "Data real-time yang mencerminkan kondisi aktual saat itu juga",
            "Data simulasi/demo yang baru aktif jika di-refresh oleh supervisor"
          ]
        },
        {
          "q": "Selain angka statistik, dimana Anda bisa melihat jadwal mingguan status staf (siapa yang Cuti, Off, atau Sakit) di halaman dashboard?",
          "a": "Tepat di bagian bawah filter dashboard, pada bagian jadwal mingguan yang berjalan",
          "options": [
            "Di bagian menu Pengaturan Kerja",
            "Tepat di bagian bawah filter dashboard, pada bagian jadwal mingguan yang berjalan",
            "Di dalam menu cetak laporan Excel",
            "Di dalam pop-up menu Profil Data diri"
          ]
        },
        {
          "q": "Jika ingin melihat detail tabel absensi karyawan pada tanggal tertentu (misalnya Jumat tanggal 13), bagaimana cara membukanya langsung dari dashboard?",
          "a": "Mengklik langsung pada kotak hari/tanggal \"Jumat Tanggal 13\" yang berjalan di dashboard",
          "options": [
            "Menekan tombol F5 pada keyboard untuk memuat ulang halaman",
            "Mengunduh file Excel absensi bulanan terlebih dahulu melalui menu laporan",
            "Mengklik langsung pada kotak hari/tanggal \"Jumat Tanggal 13\" yang berjalan di dashboard",
            "Menghubungi Admin HR Pusat untuk meminta screenshot data"
          ]
        },
        {
          "q": "Bagaimana cara mengecek apakah pengajuan cuti/izin Anda sudah disetujui atau ditindaklanjuti oleh Supervisor?",
          "a": "Mengecek Pusat Notifikasi dengan mengklik ikon Lonceng",
          "options": [
            "Mengklik tombol Profile Data",
            "Mengecek Pusat Notifikasi dengan mengklik ikon Lonceng",
            "Menunggu email konfirmasi masuk ke Gmail pribadi",
            "Mengecek menu Pengaturan Akses"
          ]
        }
      ]
    },
    {
      "id": "K-02-B",
      "title": "IKIGAI HRIS Kasir: Laporan Absensi Harian & Periode",
      "url": "/videos/IKIGAI HRIS Kasir (Laporan Harian dan Periode).mp4",
      "category": "User Guide",
      "roleAccess": ["KASIR", "SUPERVISOR"],
      "isSoon": false,
      "desc": "Panduan mendalam mengenai penggunaan fitur Laporan Absensi Harian dan Laporan Absensi Periode untuk memantau kehadiran tim serta melakukan ekspor data ke Excel.",
      "quiz": [
        {
          "q": "Untuk melihat jam datang dan jam pulang tim di outlet hari ini, menu apa yang harus dipilih?",
          "a": "Laporan Absensi Harian",
          "options": [
            "Dashboard Utama",
            "Laporan Absensi Harian",
            "Laporan Absensi Periode",
            "Menu Pengaturan Kerja"
          ]
        },
        {
          "q": "Cara paling cepat untuk mengecek kehadiran satu staf kasir tertentu di cabang GS tanpa harus scroll panjang di tabel adalah?",
          "a": "Mengatur Filter Cabang ke 'GS', Filter Role ke 'Kasir', dan mengetik nama di kolom 'Cari Karyawan'",
          "options": [
            "Mengklik tanggal satu per satu pada kalender utama",
            "Mengunduh seluruh file dokumen perusahaan terlebih dahulu",
            "Mengatur Filter Cabang ke 'GS', Filter Role ke 'Kasir', dan mengetik nama di kolom 'Cari Karyawan'",
            "Membuka pusat notifikasi lonceng di pojok kanan"
          ]
        },
        {
          "q": "Jika seorang staf (misal Salsha) tiba-tiba tidak masuk kerja karena kondisi mendadak, status apa yang akan tercantum di tabel Laporan Absensi Harian?",
          "a": "OFF Mendadak",
          "options": [
            "Shift Pagi",
            "Cuti Tahunan",
            "OFF Mendadak",
            "Comply Schedule"
          ]
        },
        {
          "q": "Untuk mengunduh rangkuman data absensi hari ini dalam bentuk file Excel, tombol apa yang harus diklik?",
          "a": "Tombol EXPORT EXCEL",
          "options": [
            "Tombol EXPORT EXCEL",
            "Tombol Laporan Absensi Periode",
            "Ikon Lonceng Notifikasi",
            "Tombol Simpan Berkas PDF"
          ]
        },
        {
          "q": "Untuk melihat total kehadiran, total libur, dan sisa cuti tahunan dalam satu bulan berjalan, menu mana yang harus dibuka?",
          "a": "Laporan Absensi Periode",
          "options": [
            "Dashboard Utama",
            "Laporan Absensi Harian",
            "Pengajuan Absen",
            "Laporan Absensi Periode"
          ]
        },
        {
          "q": "Untuk mengetahui rentang tanggal periode laporan yang sedang aktif, bagian mana yang harus diperhatikan?",
          "a": "Kotak berlatar hijau di bagian atas yang menunjukkan 'Periode saat ini:'",
          "options": [
            "Kolom nama karyawan pada tabel absensi",
            "Kotak berlatar hijau di bagian atas yang menunjukkan 'Periode saat ini:'",
            "Pusat notifikasi di sebelah kanan layar",
            "Tombol filter drop-down pilihan bulan"
          ]
        },
        {
          "q": "Untuk mengecek sisa hari libur reguler yang masih dimiliki seorang staf bulan ini, kolom apa yang harus dilihat di tabel periode?",
          "a": "Saldo OFF",
          "options": [
            "Jatah OFF",
            "Total OFF",
            "Saldo OFF",
            "Comply Full"
          ]
        },
        {
          "q": "Di tabel Laporan Absensi Periode, ada kolom berwarna hijau dengan angka '40' di bawah nama karyawan tertentu. Kolom apakah itu?",
          "a": "Saldo Cuti Melahirkan",
          "options": [
            "Saldo Cuti Melahirkan",
            "Jatah Cuti Tahunan",
            "Total OFF Terpakai",
            "Saldo Cuti Menikahkan Anak"
          ]
        },
        {
          "q": "Jika ada anggota keluarga inti karyawan yang meninggal dunia, hak cuti khusus tersebut tercatat di kolom apa?",
          "a": "Jatah Cuti Kedukaan / Cuti Kedukaan Terpakai",
          "options": [
            "OFF di Weekend",
            "Cuti Istri Melahirkan",
            "Jatah Cuti Kedukaan / Cuti Kedukaan Terpakai",
            "Comply Schedule Bulanan"
          ]
        },
        {
          "q": "Untuk membuat laporan bulanan mengenai kedisiplinan jadwal tim kasir dan terapis yang akan diserahkan ke HR Pusat, apa langkah terakhirnya?",
          "a": "Memilih bulan periode yang sesuai lalu mengklik tombol EXPORT EXCEL",
          "options": [
            "Mengambil tangkapan layar (screenshot) satu per satu baris tabel",
            "Memilih bulan periode yang sesuai lalu mengklik tombol EXPORT EXCEL",
            "Menghapus riwayat pencarian filter agar otomatis terunduh",
            "Mengklik tombol kembali ke Dashboard Utama"
          ]
        }
      ]
    },
    {
      "id": "K-02-C",
      "title": "IKIGAI HRIS Kasir: Pengajuan Absen & Pengaturan Kerja",
      "url": "/videos/IKIGAI HRIS Kasir (Pengajuan dan Pengaturan Kerja).mp4",
      "category": "User Guide",
      "roleAccess": ["KASIR", "SUPERVISOR"],
      "isSoon": false,
      "desc": "Panduan penggunaan fitur Pengajuan Absen untuk mengelola izin, sakit, dan cuti, serta menu Pengaturan Kerja untuk memantau jadwal shift tim di outlet secara akurat.",
      "quiz": [
        {
          "q": "Jika ada karyawan yang ingin mengajukan izin tidak masuk karena keperluan keluarga mendadak, menu apa yang digunakan untuk mencatatnya di sistem?",
          "a": "Menu Pengajuan Absen",
          "options": [
            "Menu Pengaturan Kerja",
            "Menu Pengajuan Absen",
            "Dashboard Utama",
            "Laporan Absensi Harian"
          ]
        },
        {
          "q": "Status apa saja yang bisa dicatat secara resmi melalui menu Pengajuan Absen?",
          "a": "Izin, Sakit, Cuti, hingga tukar jadwal Off agar tercatat secara sistem",
          "options": [
            "Hanya pengajuan Cuti Tahunan saja",
            "Izin, Sakit, Cuti, hingga tukar jadwal Off agar tercatat secara sistem",
            "Hanya status Sakit dengan surat dokter",
            "Pengajuan lembur luar kota dan nota belanja inventaris"
          ]
        },
        {
          "q": "Cara paling cepat mencari riwayat pengajuan izin milik seorang karyawan (misal Wulan) yang diajukan minggu lalu adalah?",
          "a": "Menggunakan kolom 'Cari Karyawan' lalu mengetikkan nama 'Wulan'",
          "options": [
            "Membuka menu Pengaturan Kerja dan mematikan filter",
            "Mengunduh file Excel dari Dashboard Utama",
            "Menggunakan kolom 'Cari Karyawan' lalu mengetikkan nama 'Wulan'",
            "Menekan tombol refresh pada browser berulang kali"
          ]
        },
        {
          "q": "Untuk melihat pengajuan izin yang masih tertahan atau belum disetujui di outlet tertentu, filter apa yang disediakan sistem?",
          "a": "Filter berdasarkan Cabang dan Status Pengajuan",
          "options": [
            "Filter berdasarkan usia karyawan dan masa kerja",
            "Filter berdasarkan pembagian gender dan alamat domisili",
            "Filter berdasarkan Cabang dan Status Pengajuan",
            "Filter berdasarkan nominal gaji dan tunjangan"
          ]
        },
        {
          "q": "Jika ada staf membawa surat keterangan dokter dan minta datanya diinput ke sistem, tombol apa yang harus diklik pertama kali?",
          "a": "Tombol 'Tambah Pengajuan' yang terletak di pojok kanan atas",
          "options": [
            "Tombol 'Export Excel' di sebelah kiri tabel",
            "Tombol 'Simpan Semua Perubahan' berwarna hijau",
            "Tombol 'Tambah Pengajuan' yang terletak di pojok kanan atas",
            "Tombol edit pada salah satu baris karyawan"
          ]
        },
        {
          "q": "Untuk memantau pembagian jam kerja staf agar tidak ada posisi yang kosong di outlet, menu apa yang harus dibuka?",
          "a": "Menu Pengaturan Kerja",
          "options": [
            "Menu Laporan Absensi Harian",
            "Menu Pengaturan Kerja",
            "Pusat Notifikasi Ikon Lonceng",
            "Menu Profil Data diri"
          ]
        },
        {
          "q": "Informasi apa saja yang langsung terlihat di setiap baris tabel pada menu Pengaturan Kerja?",
          "a": "Nama karyawan, jabatan, dan jadwal shift (jam kerja) yang berlaku",
          "options": [
            "Nama karyawan, jabatan, dan jadwal shift (jam kerja) yang berlaku",
            "Alamat email pribadi dan nomor kontak darurat keluarga",
            "Riwayat total penjualan logistik dan komisi terapis",
            "Foto bukti presensi masuk serta koordinat GPS lokasi"
          ]
        },
        {
          "q": "Untuk memantau jadwal mingguan khusus satu peran saja (misalnya Kasir saja atau Terapis saja) di outlet GS, fitur apa yang digunakan?",
          "a": "Menggunakan fitur Filter berdasarkan Cabang dan Role di bagian atas",
          "options": [
            "Mengklik menu histori absensi bulanan",
            "Menggunakan fitur Filter berdasarkan Cabang dan Role di bagian atas",
            "Mengetik tanggal manual di kolom Pencarian Karyawan",
            "Membuka riwayat log perubahan di detail profil"
          ]
        },
        {
          "q": "Untuk membuat rekap seluruh pengajuan izin karyawan yang masuk bulan ini untuk keperluan audit, langkah apa yang paling praktis?",
          "a": "Memanfaatkan fitur 'Export Excel' pada menu Pengajuan Absen untuk mengunduh spreadsheet",
          "options": [
            "Mencetak struk laporan satu per satu dari printer kasir",
            "Memanfaatkan fitur 'Export Excel' pada menu Pengajuan Absen untuk mengunduh spreadsheet",
            "Mengirimkan pesan siaran manual ke grup koordinasi internal",
            "Menyalin teks tabel secara manual ke buku besar operasional"
          ]
        },
        {
          "q": "Mengapa jadwal libur (Off) reguler karyawan tetap harus diinput secara resmi ke dalam sistem Pengajuan Absen?",
          "a": "Agar status operasional tetap terdata secara sistem dan tidak dianggap alpa (tanpa keterangan)",
          "options": [
            "Agar memori penyimpanan data pada server sistem tetap penuh",
            "Supaya karyawan tersebut mendapatkan perhitungan bonus insentif tambahan",
            "Agar status operasional tetap terdata secara sistem dan tidak dianggap alpa (tanpa keterangan)",
            "Supaya durasi jam kerja terapis lain otomatis bertambah panjang"
          ]
        }
      ]
    },
    {
      "id": "K-03",
      "title": "IKIGAI Portal: Akses Slip Gaji",
      "url": "/videos/User Guide - Ikigai Portal (Hp Revisi).mp4",
      "category": "User Guide",
      "roleAccess": ["OPERASIONAL", "HEAD OFFICE", "TERAPIS", "KASIR", "SUPERVISOR"],
      "isVertical": true,
      "isSoon": false,
      "desc": "Panduan langkah demi langkah bagi seluruh karyawan untuk mengakses, melihat, dan mengunduh slip gaji secara mandiri melalui Portal IKIGAI versi mobile.",
      "quiz": [
        {
          "q": "Apa tujuan utama dari video panduan ini?",
          "a": "Langkah-langkah mengakses Slip Gaji Anda secara mandiri",
          "options": [
            "Cara melakukan absensi kehadiran harian",
            "Langkah-langkah mengakses Slip Gaji Anda secara mandiri",
            "Cara mendaftar sebagai karyawan baru di outlet",
            "Panduan menggunakan sistem mesin kasir digital"
          ]
        },
        {
          "q": "Langkah pertama apa yang dilakukan untuk mulai mengakses Portal IKIGAI lewat HP?",
          "a": "Membuka browser bawaan ponsel seperti Google Chrome",
          "options": [
            "Membuka aplikasi WhatsApp Group",
            "Membuka browser bawaan ponsel seperti Google Chrome",
            "Menghapus berkas cache pada pengaturan ponsel",
            "Mencari aplikasi IKIGAI di Google Play Store"
          ]
        },
        {
          "q": "Alamat website apa yang harus diketik pada kolom URL di browser?",
          "a": "ikigaiportal.com",
          "options": [
            "ikigaihris.com",
            "ikigaiportal.com",
            "slipgaji-ikigai.id",
            "portal-karyawan.net"
          ]
        },
        {
          "q": "Data apa yang wajib diisi pada form login 'Masuk ke akun Anda'?",
          "a": "Username dan Kata Sandi (Password)",
          "options": [
            "Nama Lengkap dan Nomor Induk Karyawan",
            "Username dan Kata Sandi (Password)",
            "Alamat Email dan Nomor Handphone aktif",
            "Nama Ibu Kandung dan Tanggal Lahir"
          ]
        },
        {
          "q": "Sebelum login, apa yang sebaiknya dilakukan agar password yang diketik sudah benar dan tidak perlu login ulang di HP pribadi?",
          "a": "Klik ikon mata untuk memeriksa kata sandi dan centang 'Ingat saya' jika menggunakan perangkat pribadi",
          "options": [
            "Mengklik menu 'Lupa kata sandi?' untuk menyegel akun",
            "Melakukan screenshot pada kolom password",
            "Klik ikon mata untuk memeriksa kata sandi dan centang 'Ingat saya' jika menggunakan perangkat pribadi",
            "Menekan tombol kembali untuk memuat ulang form"
          ]
        },
        {
          "q": "Setelah login dan berada di halaman Dasbor, langkah apa yang harus dilakukan untuk memunculkan menu Slip Gaji?",
          "a": "Klik garis 3 di pojok kiri atas layar ponsel Anda",
          "options": [
            "Klik garis 3 di pojok kiri atas layar ponsel Anda",
            "Mengklik inisial profil di pojok kanan atas",
            "Menekan tombol 'Buat E-Letter' di tengah layar",
            "Melakukan *scroll* ke bagian paling bawah dasbor"
          ]
        },
        {
          "q": "Setelah masuk ke menu 'Data Saya' -> 'E-Letter', bagaimana cara melihat rincian Slip Gaji bulan tertentu (misalnya Januari 26)?",
          "a": "Klik 'Lihat Detail' lalu tekan tombol 'Open' pada berkas preview",
          "options": [
            "Menghapus dokumen lama agar dokumen baru muncul",
            "Klik 'Lihat Detail' lalu tekan tombol 'Open' pada berkas preview",
            "Menghubungi manajer operasional lewat sistem",
            "Mengetik nama lengkap pada kolom pencarian status"
          ]
        },
        {
          "q": "Setelah dokumen preview terbuka, langkah apa yang dilakukan untuk mengunduhnya ke penyimpanan HP?",
          "a": "Scroll ke arah atas halaman detail dokumen lalu klik tombol hijau 'Download PDF'",
          "options": [
            "Menekan tombol power ponsel secara mendadak",
            "Membagikan tautan dokumen langsung ke media sosial",
            "Scroll ke arah atas halaman detail dokumen lalu klik tombol hijau 'Download PDF'",
            "Mengubah nama berkas secara manual di dalam kolom pencarian"
          ]
        },
        {
          "q": "Jika file PDF yang diunduh meminta password dengan notifikasi 'This file is protected', format password apa yang harus dimasukkan?",
          "a": "Tanggal lahir Anda dengan format DDMMYYYY (Contoh: 28031997 jika lahir 28 Maret 1997)",
          "options": [
            "Nomor Induk Karyawan resmi yang terdaftar",
            "Kata sandi yang sama saat Anda melakukan login web",
            "Tanggal lahir Anda dengan format DDMMYYYY (Contoh: 28031997 jika lahir 28 Maret 1997)",
            "Kode unik cabang outlet tempat Anda ditugaskan"
          ]
        },
        {
          "q": "Apa manfaat utama dari sistem Ikigai Portal versi mobile ini bagi karyawan?",
          "a": "Memudahkan akses informasi gaji kapan saja dan di mana saja secara mandiri dan aman",
          "options": [
            "Mengubah nominal upah pokok secara mandiri",
            "Menghapus catatan absensi buruk secara sepihak",
            "Memudahkan akses informasi gaji kapan saja dan di mana saja secara mandiri dan aman",
            "Mendapatkan voucher belanja kosmetik otomatis setiap bulan"
          ]
        }
      ]
    },
    {
      "id": "K-04-A",
      "title": "IKIGAI Sistem Booking: Dashboard Booking System",
      "url": "/videos/User Guide - Ikigai Booking System 1.mp4",
      "category": "User Guide",
      "roleAccess": ["KASIR", "SUPERVISOR"],
      "isSoon": false,
      "desc": "Tantangan praktik langsung di sistem untuk menguji kemampuan Kasir dalam menganalisa jadwal dan potensi ketersediaan slot bagi tamu.",
      "quiz": [
        {
          "q": "Di menu Schedule, pada kolom 'Potensi Booking', berapa durasi maksimal yang tersedia jika sistem menunjukkan kode 'W3'?",
          "a": "90 Menit",
          "options": ["60 Menit", "90 Menit", "120 Menit"]
        },
        {
          "q": "Jika pada jam 14.00 muncul slot berwarna hijau/transparan dengan kode 'P2', apa artinya bagi tamu?",
          "a": "Tersedia slot untuk durasi 60 menit",
          "options": ["Slot sudah penuh", "Tersedia slot untuk durasi 60 menit", "Terapis sedang istirahat"]
        },
        {
          "q": "Jika Anda mengklik jam yang berwarna merah (sudah penuh), apakah sistem mengizinkan Anda menumpuk booking di jam tersebut?",
          "a": "Tidak, sistem mencegah double booking",
          "options": ["Ya, bisa dipaksa", "Tidak, sistem mencegah double booking", "Bisa, asalkan beda terapis"]
        },
        {
          "q": "Jika tamu meminta treatment Hot Stone 120 menit, indikator angka mana yang harus dipastikan berwarna hijau?",
          "a": "Indikator 120",
          "options": ["Indikator 60", "Indikator 90", "Indikator 120"]
        },
        {
          "q": "Jika pada jam operasional terakhir muncul kode 'W0', apa yang sebaiknya disampaikan jika ada tamu ingin booking di jam tersebut?",
          "a": "Maaf Kak, untuk jam tersebut slot kami sudah penuh",
          "options": ["Bisa Kak, silakan langsung datang", "Maaf Kak, untuk jam tersebut slot kami sudah penuh", "Tunggu sebentar, saya hapus booking lain"]
        }
      ]
    },
    {
      "id": "K-04-B",
      "title": "IKIGAI Sistem Booking: Registrasi & Tambah Booking",
      "url": "/videos/User Guide - Ikigai Booking System 2.mp4",
      "category": "User Guide",
      "roleAccess": ["KASIR", "SUPERVISOR"],
      "isSoon": false,
      "desc": "Tantangan praktik langsung untuk menguji kemahiran Kasir dalam mendaftarkan member baru, menangani booking grup/pasangan, dan memastikan konfirmasi data yang akurat.",
      "quiz": [
        {
          "q": "Saat mendaftarkan pelanggan baru lewat ikon '+' di jendela 'Tambah Booking', setelah mengisi Nama dan No HP, fitur apa yang harus diaktifkan agar tamu tersebut resmi terdaftar sebagai member?",
          "a": "Switch/Tombol 'Status Member'",
          "options": ["Status Aktif", "Switch/Tombol 'Status Member'", "Status Booking"]
        },
        {
          "q": "Jika ada tamu yang datang berpasangan (2 orang), fitur apa di kiri bawah jendela modal yang bisa dipakai agar tidak perlu menginput data dari awal lagi?",
          "a": "Tambah Booking",
          "options": ["Refresh halaman", "Tambah Booking", "Edit Booking"]
        },
        {
          "q": "Mengapa sistem mewajibkan memilih kategori terapis (pria/wanita) sesuai dengan jenis kelamin pelanggan?",
          "a": "Sesuai dengan SOP layanan profesional IKIGAI",
          "options": ["Biar proses lebih cepat", "Sesuai dengan SOP layanan profesional IKIGAI", "Hanya aturan tambahan saja"]
        },
        {
          "q": "Setelah semua data terisi dan diklik 'Submit Booking' atau 'Save Changes', apa langkah terakhir agar status jadwal berubah menjadi 'Confirmed' (warna merah)?",
          "a": "Klik tombol Konfirmasi pada data yang sudah masuk",
          "options": ["Langsung menutup sistem", "Klik tombol Konfirmasi pada data yang sudah masuk", "Melakukan refresh halaman"]
        },
        {
          "q": "Jika tamu ingin mengubah jam atau membatalkan pesanan (cancel), di mana ini bisa dilakukan?",
          "a": "Melalui jendela Edit Booking lalu pilih opsi yang sesuai",
          "options": ["Menghapus manual lewat database", "Melalui jendela Edit Booking lalu pilih opsi yang sesuai", "Menunggu sistem reset otomatis"]
        }
      ]
    },
    {
      "id": "K-04-C",
      "title": "IKIGAI Sistem Booking: Manajemen Terapis, Menu & Ruangan",
      "url": "/videos/User Guide - Ikigai Booking System 3.mp4",
      "category": "User Guide",
      "roleAccess": ["KASIR", "SUPERVISOR"],
      "isSoon": false,
      "desc": "Kumpulan tantangan praktis untuk menguji kemampuan Kasir dalam mengelola status kehadiran terapis, urutan rolling, pengaturan menu, dan alokasi ruangan di sistem.",
      "quiz": [
        {
          "q": "Jika status seorang terapis di menu 'Absen Terapis' diubah dari 'Tidak Masuk' menjadi 'Masuk', apa perubahan yang terjadi pada dashboard schedule?",
          "a": "Nama terapis muncul dan slot waktunya menjadi tersedia",
          "options": ["Nama terapis hilang", "Nama terapis muncul dan slot waktunya menjadi tersedia", "Sistem otomatis logout"]
        },
        {
          "q": "Jika status seorang staf diubah menjadi 'Terlambat' di menu 'Absen Terapis', di posisi urutan keberapa staf tersebut akan berada di menu 'Urutan Rolling'?",
          "a": "Urutan terakhir",
          "options": ["Urutan pertama", "Urutan tengah", "Urutan terakhir"]
        },
        {
          "q": "Apakah nama terapis di menu 'Urutan Rolling' bisa dipindah urutannya secara manual dengan cara menarik (drag)?",
          "a": "Ya, urutan bisa diubah secara manual",
          "options": ["Ya, urutan bisa diubah secara manual", "Tidak, urutan sudah terkunci", "Bisa, tapi harus izin admin"]
        },
        {
          "q": "Di menu 'Terapis', apa dampaknya jika skill 'Hot Stone' tidak dicentang pada data seorang terapis?",
          "a": "Terapis tersebut tidak akan muncul saat tamu booking menu Hot Stone",
          "options": ["Terapis A tetap bisa dipijat apa saja", "Terapis A tidak akan muncul saat tamu booking menu Hot Stone", "Harga treatment menjadi diskon"]
        },
        {
          "q": "Jika menambahkan 'Menu Tambahan' (misal Aromatherapy) di menu 'Treatment', di bagian mana menu ini akan muncul saat membuat booking baru?",
          "a": "Di kolom 'Pilihan Menu' pada modal Tambah Booking",
          "options": ["Di dashboard utama", "Di kolom 'Pilihan Menu' pada modal Tambah Booking", "Di menu profil tamu"]
        },
        {
          "q": "Jika sebuah menu dinonaktifkan di menu 'Treatment' karena stoknya sedang kosong, apakah menu tersebut masih bisa dipilih saat membuat booking baru?",
          "a": "Tidak, menu yang dinonaktifkan akan hilang dari pilihan booking",
          "options": ["Masih bisa tapi harganya Rp 0", "Tidak, menu yang dinonaktifkan akan hilang dari pilihan booking", "Masih bisa dipilih seperti biasa"]
        },
        {
          "q": "Jika status Ruangan 05 diubah menjadi 'Maintenance' karena sedang diperbaiki, warna indikator apa yang muncul?",
          "a": "Warna Kuning atau Abu-abu (Tergantung tema)",
          "options": ["Merah menyala", "Hijau terang", "Warna Kuning atau Abu-abu (Tergantung tema)"]
        },
        {
          "q": "Jika sebuah booking yang sedang berjalan dipindahkan (assign) ke ruangan lain dari Dashboard Schedule, apakah data terapisnya ikut berpindah?",
          "a": "Ya, data terapis dan tamu akan pindah ke ruangan baru tersebut",
          "options": ["Hanya tamu yang pindah", "Ya, data terapis dan tamu akan pindah ke ruangan baru tersebut", "Tidak bisa pindah ruangan jika sudah mulai"]
        },
        {
          "q": "Jika shift seorang terapis diubah dari Pagi ke Siang di menu 'Jadwal Masuk', kapan perubahan ini mulai terlihat di halaman Schedule?",
          "a": "Langsung setelah data disimpan (Real-time)",
          "options": ["Esok hari", "Langsung setelah data disimpan (Real-time)", "Setelah sistem di-restart"]
        },
        {
          "q": "Jika status seorang terapis adalah 'Off' di menu Absen, apakah namanya masih tersedia untuk dipilih di menu 'Urutan Rolling'?",
          "a": "Tidak, terapis Off otomatis keluar dari urutan rolling",
          "options": ["Tetap ada di urutan pertama", "Ada, tapi warnanya merah", "Tidak, terapis Off otomatis keluar dari urutan rolling"]
        },
        {
          "q": "Jika menambahkan durasi baru (misal 45 menit) pada menu Reflexology di menu 'Treatment', apakah durasi tersebut akan muncul di dashboard potensi booking?",
          "a": "Ya, durasi baru akan muncul sebagai pilihan",
          "options": ["Tidak muncul", "Ya, durasi baru akan muncul sebagai pilihan", "Hanya muncul di menu laporan"]
        },
        {
          "q": "Jika tamu pria ingin booking 'Body Massage' tetapi terapis yang dipilih adalah terapis wanita yang hanya memiliki skill 'Reflexology', apakah sistem akan membatasi pilihan tersebut?",
          "a": "Ya, sistem akan membatasi pilihan berdasarkan keahlian menu",
          "options": ["Tidak, bebas pilih siapa saja", "Ya, sistem akan membatasi pilihan berdasarkan keahlian menu", "Sistem akan otomatis menutup sendiri"]
        },
        {
          "q": "Di menu 'Manajemen Ruangan', apa yang terjadi jika memasukkan 3 tamu ke ruangan yang kapasitasnya hanya 2 kasur (misal 'Ruang VIP')?",
          "a": "Sistem akan menolak atau memberikan peringatan 'Room Full'",
          "options": ["Sistem akan otomatis menambah kasur", "Sistem akan menolak atau memberikan peringatan 'Room Full'", "Tamu tetap bisa masuk"]
        },
        {
          "q": "Jika tombol 'Reset Rolling' ditekan di menu 'Urutan Rolling', apa yang terjadi pada daftar nama terapis?",
          "a": "Urutan akan kembali ke pengaturan awal berdasarkan jam masuk",
          "options": ["Semua nama terapis terhapus", "Urutan akan kembali ke pengaturan awal berdasarkan jam masuk", "Terapis otomatis menjadi Off semua"]
        },
        {
          "q": "Jika status seorang terapis adalah 'Sakit', apakah Anda masih bisa memasukkan booking atas nama terapis tersebut?",
          "a": "Tidak, terapis sakit tidak tersedia di pilihan booking",
          "options": ["Bisa, asal tamu setuju", "Tidak, terapis sakit tidak tersedia di pilihan booking", "Bisa, tapi harganya jadi lebih mahal"]
        }
      ]
    },
    // ==========================================
    // SUPERVISOR - USER GUIDES
    // ==========================================
    {
      id: "S-01",
      title: "Dealpos (Managerial)",
      url: "/videos/guide-dealpos-spv.mp4",
      category: "User Guide",
      roleAccess: "SUPERVISOR",
      isSoon: false,
      desc: "Fitur monitoring transaksi, laporan harian, dan kontrol stok untuk Supervisor.",
      quiz: [
        { q: "Apa peran utama Supervisor dalam penggunaan Dealpos?", a: "Monitoring transaksi dan laporan harian", options: ["Hanya input belanja", "Monitoring transaksi dan laporan harian", "Memperbaiki printer"] },
        { q: "Dimana Supervisor bisa mengecek total omzet outlet?", a: "Menu Dashboard & Reports", options: ["Menu Dashboard & Reports", "Menu Pengaturan", "Halaman Login"] },
        { q: "Apa yang harus dilakukan jika ada selisih stok?", a: "Melakukan Stock Opname di sistem", options: ["Menghapus transaksi", "Melakukan Stock Opname di sistem", "Membiarkan saja"] },
        { q: "Bagaimana cara membatalkan transaksi yang salah (Void)?", a: "Gunakan otorisasi akun Supervisor", options: ["Gunakan otorisasi akun Supervisor", "Cabut kabel power", "Telepon tamu"] },
        { q: "Laporan apa yang paling krusial dicek setiap tutup outlet?", a: "Closing Report (EOD)", options: ["Laporan Stok Barang", "Closing Report (EOD)", "Daftar hadir"] }
      ]
    },
    {
      id: "S-02",
      title: "IKIGAI HRIS SPV",
      url: "/videos/hris-spv.mp4",
      category: "User Guide",
      roleAccess: "SUPERVISOR",
      isSoon: false,
      desc: "Fitur approval absensi, pengajuan cuti tim, dan manajemen jadwal di HRIS.",
      quiz: [
        { q: "Apa tugas utama SPV di sistem HRIS?", a: "Melakukan approval absen & cuti tim", options: ["Membayar gaji langsung", "Melakukan approval absen & cuti tim", "Mengedit foto profil staff"] },
        { q: "Dimana SPV bisa melihat daftar staff yang terlambat?", a: "Attendance Report", options: ["Attendance Report", "Menu Pengumuman", "Menu Chat"] },
        { q: "Bagaimana jika staff lupa Clock-In?", a: "SPV melakukan koreksi via Attendance Request", options: ["Staff tidak digaji", "SPV melakukan koreksi via Attendance Request", "Abaikan saja"] },
        { q: "Menu apa yang digunakan untuk menyetujui lembur?", a: "Overtime Approval", options: ["Overtime Approval", "Menu Logout", "Menu Slip Gaji"] },
        { q: "Kapan SPV harus melakukan pengecekan HRIS?", a: "Setiap hari secara rutin", options: ["Setahun sekali", "Setiap hari secara rutin", "Hanya saat ada komplain"] }
      ]
    },
    {
      id: "S-03",
      title: "Portal IKIGAI (SPV)",
      url: "/videos/User Guide - IKIGAI Portal (HP Revisi).mp4",
      category: "User Guide",
      roleAccess: "SUPERVISOR",
      isVertical: true,
      isSoon: false,
      desc: "Akses dashboard Portal IKIGAI untuk cek slip gaji pimpinan dan pengajuan revisi.",
      quiz: [
        { q: "Apa kegunaan Portal IKIGAI bagi Supervisor?", a: "Cek slip gaji dan revisi data pribadi", options: ["Cek omzet seluruh cabang", "Cek slip gaji dan revisi data pribadi", "Main game"] },
        { q: "Dimana SPV mengajukan perbaikan data pribadi?", a: "Menu Pengajuan Revisi", options: ["Hubungi Terapis", "Menu Pengajuan Revisi", "Papan tulis outlet"] },
        { q: "Apakah SPV bisa melihat slip gaji staffnya di portal?", a: "Tidak, hanya data pribadi masing-masing", options: ["Bisa semua", "Tidak, hanya data pribadi masing-masing", "Hanya jika diizinkan"] },
        { q: "Keamanan portal bersifat?", a: "Rahasia & Pribadi", options: ["Boleh share password", "Rahasia & Pribadi", "Bebas diakses siapa saja"] },
        { q: "Apa fungsi revisi di portal?", a: "Memperbaiki kesalahan input data/absen", options: ["Menambah nominal gaji", "Memperbaiki kesalahan input data/absen", "Mengubah jadwal libur"] }
      ]
    },
    {
      id: "S-04",
      title: "Sistem Booking (Control)",
      url: "/videos/guide-booking.mp4",
      category: "User Guide",
      roleAccess: "SUPERVISOR",
      isSoon: false,
      desc: "Manajemen slot booking outlet dan kontrol reservasi tamu.",
      quiz: [
        { q: "Apa tanggung jawab SPV di Sistem Booking?", a: "Memastikan jadwal tamu tertata rapi", options: ["Menerima tamu di depan pintu", "Memastikan jadwal tamu tertata rapi", "Menghitung biaya listrik"] },
        { q: "Bagaimana cara menutup slot jika outlet penuh?", a: "Blokir jam tertentu di kalender", options: ["Matikan komputer", "Blokir jam tertentu di kalender", "Telepon semua tamu"] },
        { q: "Apa yang dilakukan jika terjadi double booking?", a: "Hubungi tamu & atur ulang jadwal", options: ["Hubungi tamu & atur ulang jadwal", "Diamkan saja", "Tutup outlet"] },
        { q: "Dimana SPV melihat ringkasan tamu hari ini?", a: "Dashboard/Daily View", options: ["Menu Settings", "Dashboard/Daily View", "Menu Profil"] },
        { q: "Sistem Booking membantu SPV dalam hal?", a: "Efisiensi alokasi terapis dan ruangan", options: ["Menghitung uang kembalian", "Efisiensi alokasi terapis dan ruangan", "Memesan makan siang"] }
      ]
    },
    {
      id: "S-05",
      title: "Trello Management",
      url: "/videos/trello.mp4",
      category: "User Guide",
      roleAccess: "SUPERVISOR",
      isSoon: false,
      desc: "Pengelolaan workflow tim outlet melalui Trello.",
      quiz: [
        { q: "Fungsi Trello bagi Supervisor outlet?", a: "Monitoring progres tugas tim", options: ["Tempat simpan foto", "Monitoring progres tugas tim", "Aplikasi chat"] },
        { q: "Apa itu 'Board' dalam Trello?", a: "Ruang kerja untuk satu proyek/outlet", options: ["Papan tulis fisik", "Ruang kerja untuk satu proyek/outlet", "Meja kasir"] },
        { q: "Cara memberi instruksi ke staff di Trello?", a: "Add staff ke Card & beri instruksi", options: ["Add staff ke Card & beri instruksi", "Tulis di status WA", "Berteriak di outlet"] },
        { q: "Fungsi 'Checklist' di dalam Card?", a: "Memecah tugas besar jadi langkah kecil", options: ["Mencoret nama staff", "Memecah tugas besar jadi langkah kecil", "Daftar belanja pribadi"] },
        { q: "Tanda tugas sudah selesai di Trello?", a: "Pindahkan Card ke kolom 'Done'", options: ["Hapus Card-nya", "Pindahkan Card ke kolom 'Done'", "Logout dari aplikasi"] }
      ]
    },
    {
      id: "S-06",
      title: "OneDrive Storage",
      url: "/videos/onedrive.mp4",
      category: "User Guide",
      roleAccess: "SUPERVISOR",
      isSoon: false,
      desc: "Penyimpanan dokumen outlet (Laporan, Foto SOP) di Cloud OneDrive.",
      quiz: [
        { q: "Kegunaan OneDrive bagi Supervisor?", a: "Penyimpanan dokumen outlet secara online", options: ["Mengedit video", "Penyimpanan dokumen outlet secara online", "Alat presentasi"] },
        { q: "Dokumen apa yang wajib diupload SPV?", a: "Laporan harian & foto bukti operasional", options: ["Foto selfie", "Laporan harian & foto bukti operasional", "Video film"] },
        { q: "Keuntungan cloud storage (OneDrive) adalah?", a: "Data aman meski komputer outlet rusak", options: ["Data aman meski komputer outlet rusak", "Tidak butuh akun", "Gratis tanpa batas"] },
        { q: "Cara mencari file laporan bulan lalu?", a: "Gunakan fitur Search/Folder Bulanan", options: ["Gunakan fitur Search/Folder Bulanan", "Tanya kasir cabang lain", "Buat laporan baru"] },
        { q: "Apakah file di OneDrive bisa diedit bersama?", a: "Ya, menggunakan fitur kolaborasi", options: ["Tidak bisa", "Ya, menggunakan fitur kolaborasi", "Hanya bisa satu orang"] }
      ]
    },
    {
      id: "S-07",
      title: "Google Calendar",
      url: "/videos/User Guide - Google Calender (Booking Room Meet).mp4",
      category: "User Guide",
      roleAccess: "SUPERVISOR",
      isSoon: false,
      desc: "Manajemen jadwal rapat outlet dan kalender koordinasi.",
      quiz: [
        { q: "Google Calendar digunakan SPV untuk?", a: "Mengatur jadwal meeting & agenda outlet", options: ["Menghitung gaji", "Mengatur jadwal meeting & agenda outlet", "Mengedit foto"] },
        { q: "Cara mengundang HO ke rapat outlet?", a: "Masukkan email HO di 'Add Guest'", options: ["Masukkan email HO di 'Add Guest'", "Tag di Instagram", "Kirim surat"] },
        { q: "Apa fungsi Notifikasi di kalender?", a: "Pengingat sebelum acara dimulai", options: ["Menghapus acara", "Pengingat sebelum acara dimulai", "Mengubah lokasi"] },
        { q: "Jika ada jadwal bentrok, apa yang dilakukan?", a: "Reschedule ke waktu yang kosong", options: ["Lanjut saja", "Reschedule ke waktu yang kosong", "Batalkan semua"] },
        { q: "Pentingnya integrasi kalender bagi SPV?", a: "Sinkronisasi jadwal dengan tim HO/Pusat", options: ["Agar HP terlihat canggih", "Sinkronisasi jadwal dengan tim HO/Pusat", "Mendapat promo diskon"] }
      ]
    },
    {
      id: "S-08",
      title: "Google Task",
      url: "/videos/google-task.mp4",
      category: "User Guide",
      roleAccess: "SUPERVISOR",
      isSoon: false,
      desc: "Monitoring tugas harian (To-Do List) agar tidak ada yang terlewat.",
      quiz: [
        { q: "Apa fungsi Google Task bagi SPV?", a: "Daftar tugas harian (To-Do List)", options: ["Alat pembayaran", "Daftar tugas harian (To-Do List)", "Streaming musik"] },
        { q: "Bagaimana cara menandai tugas yang selesai?", a: "Klik lingkaran/centang pada tugas", options: ["Klik lingkaran/centang pada tugas", "Hapus aplikasi", "Restart HP"] },
        { q: "Keuntungan menggunakan Google Task?", a: "Tugas terstruktur & pengingat fokus", options: ["Dapat uang tambahan", "Tugas terstruktur & pengingat fokus", "Bisa main game"] },
        { q: "Dimana kita bisa melihat Google Task?", a: "Samping Gmail atau aplikasi Task", options: ["Di galeri foto", "Samping Gmail atau aplikasi Task", "Di menu YouTube"] },
        { q: "Kapan sebaiknya SPV mengecek Google Task?", a: "Setiap pagi sebelum mulai operasional", options: ["Setahun sekali", "Setiap pagi sebelum mulai operasional", "Hanya saat libur"] }
      ]
    },
    // ==========================================
    // TERAPIS - USER GUIDES
    // ==========================================
    {
      id: "T-01",
      title: "Portal IKIGAI",
      url: "/videos/User Guide - IKIGAI Portal (HP Revisi).mp4",
      category: "User Guide",
      roleAccess: "TERAPIS",
      isVertical: true,
      isSoon: false,
      desc: "Akses cek slip gaji dan pengajuan revisi melalui Portal IKIGAI.",
      quiz: [
        { 
          q: "Apa kegunaan utama Portal IKIGAI bagi Terapis?", 
          a: "Cek slip gaji dan melakukan revisi", 
          options: ["Memesan makanan", "Cek slip gaji dan melakukan revisi", "Beli pulsa"] 
        },
        { 
          q: "Dimana Terapis dapat melihat rincian gaji bulanan?", 
          a: "Menu Slip Gaji", 
          options: ["Menu Slip Gaji", "Menu Galeri", "Menu Kontak"] 
        },
        { 
          q: "Jika ada kesalahan data absen, fitur apa yang digunakan di Portal?", 
          a: "Fitur Pengajuan Revisi", 
          options: ["Hapus Akun", "Fitur Pengajuan Revisi", "Mode Pesawat"] 
        },
        { 
          q: "Apakah slip gaji di Portal IKIGAI bersifat rahasia?", 
          a: "Ya, hanya bisa diakses akun pribadi", 
          options: ["Tidak, semua bisa lihat", "Ya, hanya bisa diakses akun pribadi", "Boleh dibagikan ke tamu"] 
        },
        { 
          q: "Kapan Terapis sebaiknya mengecek Portal IKIGAI?", 
          a: "Saat waktu gajian atau butuh revisi data", 
          options: ["Setiap menit", "Saat waktu gajian atau butuh revisi data", "Hanya saat libur"] 
        }
      ]
    },
    // ==========================================
    // HEAD OFFICE - USER GUIDES
    // ==========================================
    {
      id: "H-01",
      title: "Portal IKIGAI (HO)",
      url: "/videos/User Guide - IKIGAI Portal (HP Revisi).mp4",
      category: "User Guide",
      roleAccess: "HEAD OFFICE",
      isVertical: true,
      isSoon: false,
      desc: "Akses cek slip gaji dan pengajuan revisi data khusus staff Head Office.",
      quiz: [
        { q: "Apa fungsi utama Portal IKIGAI bagi staff HO?", a: "Cek slip gaji dan revisi data", options: ["Pesan tiket pesawat", "Cek slip gaji dan revisi data", "Update status sosial media"] },
        { q: "Dimana staff HO melihat rincian gaji?", a: "Menu Slip Gaji", options: ["Menu Slip Gaji", "Menu Berita", "Menu Galeri"] },
        { q: "Jika ada kesalahan input data pribadi, fitur apa yang digunakan?", a: "Pengajuan Revisi", options: ["Lapor polisi", "Pengajuan Revisi", "Hapus akun"] },
        { q: "Apakah pengajuan revisi di portal langsung disetujui?", a: "Tidak, melalui proses verifikasi", options: ["Ya, otomatis", "Tidak, melalui proses verifikasi", "Tergantung sinyal"] },
        { q: "Keamanan akses portal adalah tanggung jawab?", a: "Pemilik akun pribadi", options: ["Pemilik akun pribadi", "Semua orang", "Security kantor"] }
      ]
    },
    {
      id: "H-02",
      title: "Trello",
      url: "/videos/trello.mp4",
      category: "User Guide",
      roleAccess: "HEAD OFFICE",
      isSoon: false,
      desc: "Koordinasi antar departemen dan manajemen project di Trello.",
      quiz: [
        { q: "Trello digunakan Head Office untuk apa?", a: "Manajemen tugas dan koordinasi", options: ["Dengar musik", "Manajemen tugas dan koordinasi", "Streaming video"] },
        { q: "Apa yang dimaksud dengan 'Card' di Trello?", a: "Satu unit tugas atau pekerjaan", options: ["Kartu ATM", "Satu unit tugas atau pekerjaan", "Kartu nama"] },
        { q: "Bagaimana cara menandai rekan di Trello?", a: "Mention menggunakan @username", options: ["Mention menggunakan @username", "Kirim surat", "Telepon pribadi"] },
        { q: "Dimana kita meletakkan deadline pekerjaan?", a: "Fitur Due Date", options: ["Judul card", "Fitur Due Date", "Komentar saja"] },
        { q: "Apa fungsi 'Label' warna-warni di Trello?", a: "Kategorisasi/prioritas tugas", options: ["Hiasan saja", "Kategorisasi/prioritas tugas", "Menandai favorit"] }
      ]
    },
    {
      id: "H-03",
      title: "OneDrive",
      url: "/videos/onedrive.mp4",
      category: "User Guide",
      roleAccess: "HEAD OFFICE",
      isSoon: false,
      desc: "Penyimpanan data pusat dan kolaborasi dokumen di OneDrive.",
      quiz: [
        { q: "Apa keunggulan menyimpan file di OneDrive?", a: "Bisa diakses dari mana saja & aman", options: ["File jadi lebih kecil", "Bisa diakses dari mana saja & aman", "Tidak butuh internet"] },
        { q: "Bagaimana cara berbagi file ke rekan kerja?", a: "Klik Share dan masukkan email rekan", options: ["Copy file ke flashdisk", "Klik Share dan masukkan email rekan", "Screenshot layarnya"] },
        { q: "Apa fungsi 'Auto-Save' di OneDrive?", a: "Menyimpan perubahan secara otomatis", options: ["Menghapus file lama", "Menyimpan perubahan secara otomatis", "Membuat komputer mati"] },
        { q: "Bolehkah menyimpan file pribadi di OneDrive kantor?", a: "Tidak disarankan (khusus pekerjaan)", options: ["Boleh sekali", "Tidak disarankan (khusus pekerjaan)", "Wajib"] },
        { q: "Dimana kita mencari file yang terhapus di OneDrive?", a: "Recycle Bin", options: ["Downloads", "Recycle Bin", "Desktop"] }
      ]
    },
    {
      id: "H-04",
      title: "Google Calendar: Booking Room Meeting",
      url: "/videos/User Guide - Google Calender (Booking Room Meet).mp4",
      category: "User Guide",
      roleAccess: "HEAD OFFICE",
      isSoon: false,
      desc: "Prosedur reservasi ruang rapat agar tidak bentrok dengan departemen lain.",
      quiz: [
        { q: "Apa langkah pertama booking ruang meeting?", a: "Cek ketersediaan di Google Calendar", options: ["Langsung masuk ruangan", "Cek ketersediaan di Google Calendar", "Tanya satpam"] },
        { q: "Informasi apa yang wajib ada saat booking?", a: "Judul rapat, Jam, & Ruangan", options: ["Judul rapat, Jam, & Ruangan", "Daftar menu makanan", "Hobi peserta"] },
        { q: "Apa tujuan utama sistem booking ruangan ini?", a: "Menghindari jadwal bentrok", options: ["Pamer agenda", "Menghindari jadwal bentrok", "Formalitas saja"] },
        { q: "Bagaimana cara mengundang rekan ke rapat?", a: "Tambah email di kolom 'Add guests'", options: ["Cari di kantor", "Tambah email di kolom 'Add guests'", "Terima saja"] },
        { q: "Jika rapat batal, apa yang harus dilakukan?", a: "Hapus event di kalender segera", options: ["Hapus event di kalender segera", "Biarkan tetap ada", "Pura-pura lupa"] }
      ]
    },
  ];