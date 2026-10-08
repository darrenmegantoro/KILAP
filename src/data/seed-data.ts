export const categories = [
  {
    id: "pelayanan_informasi_publik",
    name: "Pengelolaan Pelayanan Informasi Publik",
    jenis: "Generic",
    description:
      "Pelajari tentang standar pelayanan informasi publik Bank Indonesia, mulai dari prinsip layanan, kualitas penyampaian informasi, pemanfaatan kanal layanan, hingga evaluasi dan pengendalian mutu pelayanan agar pelaksanaannya konsisten dan akuntabel.",
    sortOrder: 1,
  },
  {
    id: "biaya_perolehan_informasi_publik",
    name: "Pengenaan Biaya Perolehan Informasi Publik",
    jenis: "Generic",
    description:
      "Pelajari tentang ketentuan biaya perolehan informasi publik, terutama bahwa informasi publik pada dasarnya diberikan tanpa biaya, sedangkan biaya yang timbul karena penggandaan atau perekaman dokumen dibebankan kepada pemohon sesuai ketentuan yang berlaku.",
    sortOrder: 2,
  },
  {
    id: "permohonan_informasi",
    name: "Pengelolaan Permohonan Informasi",
    jenis: "Permohonan Informasi",
    description:
      "Pelajari tentang proses penerimaan dan penanganan permohonan informasi publik, termasuk persyaratan, alur layanan, tindak lanjut, serta hal-hal yang perlu diperhatikan agar permohonan diproses secara tepat.",
    sortOrder: 3,
  },
  {
    id: "pengajuan_keberatan",
    name: "Pengelolaan Pengajuan Keberatan",
    jenis: "Pengajuan Keberatan",
    description:
      "Pelajari tentang kondisi yang dapat menjadi dasar pengajuan keberatan, pihak yang berwenang, tata cara penyampaian, batas waktu, dan proses penanganannya agar pegawai memahami mekanisme keberatan secara benar.",
    sortOrder: 4,
  },
  {
    id: "penyelesaian_sengketa_informasi",
    name: "Pengelolaan Penyelesaian Sengketa Informasi",
    jenis: "Penyelesaian Sengketa",
    description:
      "Pelajari tentang tahapan penyelesaian sengketa informasi publik setelah proses keberatan, termasuk konteks terjadinya sengketa, jalur penyelesaian, serta hal-hal yang perlu dipahami dalam mendukung penanganannya.",
    sortOrder: 5,
  },
] as const;

export type SeedFaq = {
  kategori_id: string;
  level_kemahiran: number;
  bloom_label: string;
  indikator_perilaku: string;
  pertanyaan: string;
  jawaban: string;
  baris_excel: number;
};

export const faqs: SeedFaq[] = [
  {
    kategori_id: "pelayanan_informasi_publik",
    level_kemahiran: 1,
    bloom_label: "Remembering",
    indikator_perilaku:
      "Mengetahui kanal yang tersedia untuk memperoleh layanan informasi publik Bank Indonesia.",
    pertanyaan:
      "Ketika ingin mencari informasi publik Bank Indonesia, publik bisa mendapatkannya melalui mana saja?",
    jawaban:
      "Informasi publik Bank Indonesia dapat diakses melalui situs web Bank Indonesia, Contact Center Bank Indonesia Bicara yaitu call center, email, media sosial, Ruang Layanan Informasi Publik (visitor center), atau media lain yang digunakan oleh Bank Indonesia di bawah koordinasi PPID.",
    baris_excel: 5,
  },
  {
    kategori_id: "pelayanan_informasi_publik",
    level_kemahiran: 2,
    bloom_label: "Understanding",
    indikator_perilaku:
      "Menjelaskan bahwa pelayanan informasi publik tidak hanya tersedia melalui kanal pusat, tetapi juga melalui petugas informasi di Kantor Perwakilan Dalam Negeri.",
    pertanyaan:
      "Untuk masyarakat yang berada di daerah, apakah bisa mendapatkan pelayanan informasi publik langsung dari Kantor Perwakilan Bank Indonesia?",
    jawaban:
      "Ya. Bank Indonesia memberikan pelayanan informasi publik melalui Contact Center Bank Indonesia Bicara dan petugas informasi di seluruh Kantor Perwakilan Dalam Negeri.",
    baris_excel: 6,
  },
  {
    kategori_id: "pelayanan_informasi_publik",
    level_kemahiran: 3,
    bloom_label: "Applying",
    indikator_perilaku:
      "Memberikan pelayanan atau mengarahkan masyarakat melalui kanal yang tersedia dengan tetap memenuhi prinsip pelayanan yang ditetapkan.",
    pertanyaan:
      "Untuk masyarakat tidak bisa datang langsung ke kantor Bank Indonesia, apakah saya tetap bisa mendapatkan layanan informasi publik?",
    jawaban:
      "Bisa. Bank Indonesia menyediakan layanan melalui situs web Bank Indonesia, Contact Center Bank Indonesia Bicara, email, media sosial, Ruang Layanan Informasi Publik (visitor center), atau media lain yang digunakan Bank Indonesia di bawah koordinasi PPID.",
    baris_excel: 7,
  },
  {
    kategori_id: "pelayanan_informasi_publik",
    level_kemahiran: 4,
    bloom_label: "Analyzing",
    indikator_perilaku:
      "Menganalisis kondisi masyarakat untuk menentukan alternatif kanal layanan yang dapat digunakan.",
    pertanyaan:
      "Untuk masyarakat kesulitan menggunakan website Bank Indonesia. Apakah ada cara lain untuk mendapatkan informasi?",
    jawaban:
      "Ya. Selain situs web Bank Indonesia, pelayanan informasi publik dapat diperoleh melalui Contact Center Bank Indonesia Bicara yaitu call center, email, media sosial, Ruang Layanan Informasi Publik (visitor center), atau media lain yang digunakan oleh Bank Indonesia di bawah koordinasi PPID.",
    baris_excel: 8,
  },
  {
    kategori_id: "biaya_perolehan_informasi_publik",
    level_kemahiran: 1,
    bloom_label: "Remembering",
    indikator_perilaku:
      "Mengetahui bahwa informasi publik Bank Indonesia diberikan secara gratis.",
    pertanyaan:
      "Apakah saya harus membayar untuk memperoleh informasi publik dari Bank Indonesia?",
    jawaban:
      "Tidak. Pejabat Pengelola Informasi dan Dokumentasi menyediakan informasi publik secara gratis (tidak dipungut biaya).",
    baris_excel: 14,
  },
  {
    kategori_id: "biaya_perolehan_informasi_publik",
    level_kemahiran: 2,
    bloom_label: "Understanding",
    indikator_perilaku:
      "Menjelaskan bahwa terdapat biaya tertentu yang dapat timbul dalam proses memperoleh dokumen.",
    pertanyaan:
      "Kalau informasi publik gratis, dalam kondisi apa saya tetap bisa mengeluarkan biaya?",
    jawaban:
      "Biaya yang timbul dari proses pengadaan atau perekaman dokumen menjadi tanggungan pemohon informasi. Jadi, yang dapat menjadi tanggungan pemohon adalah biaya yang muncul dari proses tersebut, bukan biaya atas informasi publiknya.",
    baris_excel: 15,
  },
  {
    kategori_id: "biaya_perolehan_informasi_publik",
    level_kemahiran: 3,
    bloom_label: "Applying",
    indikator_perilaku:
      "Menjelaskan penerapan ketentuan biaya kepada pemohon sesuai kondisi permintaan informasi.",
    pertanyaan:
      "Kalau saya meminta salinan atau hasil perekaman dokumen, apakah biayanya ditanggung Bank Indonesia?",
    jawaban:
      "Informasi publik tetap disediakan secara gratis atau tidak dipungut biaya. Namun, biaya yang timbul dari proses pengadaan atau perekaman dokumen menjadi tanggungan pemohon informasi.",
    baris_excel: 16,
  },
  {
    kategori_id: "biaya_perolehan_informasi_publik",
    level_kemahiran: 4,
    bloom_label: "Analyzing",
    indikator_perilaku:
      "Membedakan antara biaya atas pelayanan informasi publik dengan biaya yang muncul dari proses pengadaan atau perekaman dokumen.",
    pertanyaan:
      "Kalau saya diminta menanggung biaya fotokopi atau perekaman dokumen, apakah berarti Bank Indonesia mengenakan biaya layanan informasi?",
    jawaban:
      "Tidak. Bank Indonesia menyediakan informasi publik secara gratis (tidak dipungut biaya). Yang menjadi tanggungan pemohon adalah biaya yang timbul dari proses pengadaan atau perekaman dokumen.",
    baris_excel: 17,
  },
  {
    kategori_id: "permohonan_informasi",
    level_kemahiran: 1,
    bloom_label: "Remembering",
    indikator_perilaku:
      "Mengetahui kanal dan persyaratan dasar permohonan informasi publik.",
    pertanyaan: "Bagaimana cara mengajukan permohonan informasi publik?",
    jawaban:
      "Permohonan dapat diajukan melalui portal e-PPID secara daring, surat, email, telepon, datang langsung ke Ruang Layanan Informasi Publik (visitor center), atau melalui meja layanan informasi di Kantor Perwakilan Bank Indonesia.",
    baris_excel: 23,
  },
  {
    kategori_id: "permohonan_informasi",
    level_kemahiran: 2,
    bloom_label: "Understanding",
    indikator_perilaku: "Menjelaskan dokumen yang harus dilengkapi oleh pemohon.",
    pertanyaan: "Dokumen apa yang harus dilengkapi oleh pemohon?",
    jawaban:
      "Pemohon mengisi formulir online/offline dan melengkapi salinan KTP untuk perorangan atau surat kuasa/bukti pengesahan badan hukum untuk lembaga/organisasi.",
    baris_excel: 24,
  },
  {
    kategori_id: "permohonan_informasi",
    level_kemahiran: 3,
    bloom_label: "Applying",
    indikator_perilaku:
      "Menjelaskan proses yang terjadi ketika berkas pemohon telah lengkap.",
    pertanyaan:
      "Kalau dokumen pemohon sudah lengkap, apa yang terjadi selanjutnya?",
    jawaban:
      "Pemohon akan menerima tanda bukti yang diberikan oleh petugas layanan informasi. Selanjutnya, PPID Bank Indonesia memberikan pemberitahuan tertulis yang merupakan jawaban atas permohonan informasi publik.",
    baris_excel: 25,
  },
  {
    kategori_id: "permohonan_informasi",
    level_kemahiran: 4,
    bloom_label: "Analyzing",
    indikator_perilaku:
      "Mengidentifikasi tindak lanjut berdasarkan kondisi kelengkapan berkas dan status permohonan.",
    pertanyaan:
      "Kalau berkas pemohon belum lengkap, apa yang akan dilakukan Bank Indonesia?",
    jawaban:
      "PPID Bank Indonesia akan meminta kelengkapan data kepada pemohon dengan menghubungi melalui telepon/surat/e-mail. Dalam prosedur juga disebutkan bahwa berkas lengkap akan diterima paling lambat 3 hari kerja.",
    baris_excel: 26,
  },
  {
    kategori_id: "permohonan_informasi",
    level_kemahiran: 5,
    bloom_label: "Evaluating",
    indikator_perilaku:
      "Menilai kondisi permohonan berdasarkan waktu penyampaian jawaban dan menentukan hak pemohon berikutnya.",
    pertanyaan:
      "Pemohon sudah mengajukan permohonan, tetapi belum mendapat jawaban. Berapa lama seharusnya pemohon menunggu dan apa yang bisa pemohon lakukan jika tidak ditanggapi?",
    jawaban:
      "PPID Bank Indonesia memberikan jawaban paling lambat 10 hari kerja sejak permohonan diterima dan dapat diperpanjang paling lambat 7 hari kerja berikutnya. Jika pemohon tidak puas dengan jawaban dan/atau permohonan informasi publik tidak ditanggapi, pemohon dapat mengajukan keberatan informasi publik.",
    baris_excel: 27,
  },
  {
    kategori_id: "permohonan_informasi",
    level_kemahiran: 6,
    bloom_label: "Creating",
    indikator_perilaku:
      "Membantu membentuk permohonan yang lengkap berdasarkan kebutuhan informasi publik dan persyaratan yang ditetapkan.",
    pertanyaan:
      "Pemohon tahu informasi yang ingin diminta, tetapi bingung bagaimana mengajukan permohonannya. Apa yang harus pemohon lakukan dan siapkan?",
    jawaban:
      "Permohonan dilakukan dengan mengisi formulir secara online/offline dan melengkapi salinan KTP untuk perorangan atau surat kuasa/bukti pengesahan badan hukum untuk lembaga/organisasi. Permohonan tersebut dapat disampaikan melalui portal e-PPID, surat, email, telepon, visitor center, atau meja layanan informasi di Kantor Perwakilan Bank Indonesia.",
    baris_excel: 28,
  },
  {
    kategori_id: "pengajuan_keberatan",
    level_kemahiran: 1,
    bloom_label: "Remembering",
    indikator_perilaku:
      "Mengetahui kondisi yang dapat menjadi alasan keberatan informasi publik.",
    pertanyaan: "Dalam kondisi apa pemohon dapat mengajukan keberatan?",
    jawaban:
      "Keberatan dapat diajukan apabila permohonan informasi ditolak; informasi berkala tidak disediakan; permintaan informasi tidak ditanggapi; ditanggapi tidak sebagaimana yang diminta; tidak dipenuhi; biaya yang dikenakan tidak wajar; atau informasi disampaikan melebihi jangka waktu yang ditentukan.",
    baris_excel: 34,
  },
  {
    kategori_id: "pengajuan_keberatan",
    level_kemahiran: 2,
    bloom_label: "Understanding",
    indikator_perilaku:
      "Menjelaskan kanal, persyaratan, dan batas waktu pengajuan keberatan.",
    pertanyaan: "Bagaimana dan kapan pemohon harus mengajukan keberatan?",
    jawaban:
      "Keberatan diajukan kepada Atasan PPID melalui portal e-PPID, surat, email, telepon, visitor center, atau meja layanan informasi, selambat-lambatnya 30 hari kerja sejak permohonan informasi ditolak/ditentukannya alasan keberatan lainnya.",
    baris_excel: 35,
  },
  {
    kategori_id: "pengajuan_keberatan",
    level_kemahiran: 3,
    bloom_label: "Applying",
    indikator_perilaku:
      "Menjelaskan persyaratan yang harus dipenuhi dalam pengajuan keberatan.",
    pertanyaan: "Apa saja yang harus pemohon siapkan untuk mengajukan keberatan?",
    jawaban:
      "Pengajuan dilakukan dengan mengisi formulir keberatan informasi (online/offline) dan memenuhi persyaratan berupa salinan KTP/surat kuasa/bukti pengesahan badan hukum. Pemohon kemudian menerima tanda bukti pengajuan keberatan.",
    baris_excel: 36,
  },
  {
    kategori_id: "pengajuan_keberatan",
    level_kemahiran: 4,
    bloom_label: "Analyzing",
    indikator_perilaku:
      "Mengidentifikasi apakah pengalaman pemohon termasuk salah satu alasan keberatan yang ditetapkan.",
    pertanyaan:
      "Pemohon mendapat jawaban dari Bank Indonesia, tetapi jawabannya tidak sesuai dengan informasi yang diminta. Apakah pemohon bisa mengajukan keberatan?",
    jawaban:
      "Bisa. Salah satu Alasan Keberatan adalah “permintaan informasi ditanggapi tidak sebagaimana yang diminta.”",
    baris_excel: 37,
  },
  {
    kategori_id: "pengajuan_keberatan",
    level_kemahiran: 5,
    bloom_label: "Evaluating",
    indikator_perilaku:
      "Menilai tindak lanjut berikutnya berdasarkan tanggapan Atasan PPID.",
    pertanyaan:
      "Pemohon sudah menerima tanggapan atas keberatan, tetapi masih tidak puas. Apa yang bisa pemohon lakukan?",
    jawaban:
      "Jika pemohon tidak puas terhadap tanggapan keberatan, maka dalam waktu 14 hari kerja setelah tanggapan, pemohon dapat mengajukan permohonan sengketa informasi publik ke Komisi Informasi.",
    baris_excel: 38,
  },
  {
    kategori_id: "penyelesaian_sengketa_informasi",
    level_kemahiran: 1,
    bloom_label: "Remembering",
    indikator_perilaku:
      "Mengetahui kondisi yang memungkinkan pengajuan penyelesaian sengketa informasi publik.",
    pertanyaan:
      "Kapan pemohon dapat membawa masalah informasi publik ke Komisi Informasi?",
    jawaban:
      "Upaya penyelesaian sengketa dapat diajukan apabila tanggapan Atasan PPID dalam proses keberatan tidak memuaskan pemohon.",
    baris_excel: 44,
  },
  {
    kategori_id: "penyelesaian_sengketa_informasi",
    level_kemahiran: 2,
    bloom_label: "Understanding",
    indikator_perilaku:
      "Menjelaskan lembaga tujuan dan batas waktu pengajuan sengketa.",
    pertanyaan: "Ke mana dan kapan sengketa informasi harus diajukan?",
    jawaban:
      "Sengketa diajukan kepada Komisi Informasi Pusat dan/atau Komisi Informasi Provinsi/Kabupaten/Kota dalam waktu paling lambat 14 hari kerja setelah diterimanya tanggapan tertulis dari Atasan PPID.",
    baris_excel: 45,
  },
  {
    kategori_id: "penyelesaian_sengketa_informasi",
    level_kemahiran: 3,
    bloom_label: "Applying",
    indikator_perilaku: "Menjelaskan proses penyelesaian sengketa kepada masyarakat.",
    pertanyaan: "Setelah pemohon mengajukan sengketa, prosesnya seperti apa?",
    jawaban:
      "Komisi Informasi mulai mengupayakan penyelesaian melalui Mediasi dan/atau Ajudikasi nonlitigasi paling lambat 14 hari kerja setelah menerima permohonan penyelesaian sengketa informasi publik.",
    baris_excel: 46,
  },
  {
    kategori_id: "penyelesaian_sengketa_informasi",
    level_kemahiran: 4,
    bloom_label: "Analyzing",
    indikator_perilaku:
      "Mengidentifikasi posisi kasus masyarakat dalam rangkaian permohonan–keberatan–sengketa.",
    pertanyaan:
      "Pemohon belum pernah mengajukan keberatan, tetapi ingin langsung mengajukan sengketa. Apakah proses saya sudah sampai tahap sengketa?",
    jawaban:
      "Berdasarkan prosedur BI, penyelesaian sengketa diajukan apabila tanggapan Atasan PPID dalam proses keberatan tidak memuaskan pemohon. Dengan demikian, tahap sengketa mengikuti proses keberatan terlebih dahulu.",
    baris_excel: 47,
  },
  {
    kategori_id: "penyelesaian_sengketa_informasi",
    level_kemahiran: 4,
    bloom_label: "Analyzing",
    indikator_perilaku: "Menjelaskan batas waktu keseluruhan penyelesaian sengketa.",
    pertanyaan: "Berapa lama sengketa informasi dapat diproses?",
    jawaban:
      "Proses penyelesaian sengketa paling lambat dapat diselesaikan dalam waktu 100 hari kerja.",
    baris_excel: 48,
  },
];
