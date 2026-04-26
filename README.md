# Stuckie
Stonk tycoon for dicoding hackathon

# PROJECT BUILDING GUIDE
Stuckie adalah aplikasi edukasi investasi berbasis game **Tycoon & Simulation** yang dirancang untuk mengatasi rendahnya literasi keuangan di kalangan Gen-Z dan Milenial.

## 🕹️ Konsep Game
Stuckie memposisikan pemain sebagai operator terminal finansial di era 80-an masa depan. Pemain harus mengelola aset (SBN, Saham, Reksa Dana) yang harganya berfluktuasi secara real-time berdasarkan "sentimen pasar" yang dihasilkan oleh AI.

## 🚀 Fitur Utama
1. **Swipe-to-Invest (The Terminal):** Antarmuka bergaya kartu untuk memfilter instrumen investasi. Geser kanan untuk riset lebih lanjut, kiri untuk abaikan.
2. **AI Scout (RAG-based Advisor):** Fitur chat yang ditenagai **Azure OpenAI**. Pemain bisa menanyakan isi prospektus yang rumit dalam bahasa gaul. AI akan meringkas dokumen PDF asli menjadi poin-poin risiko dan keuntungan.
3. **The Market Tycoon:** Gameplay utama di mana pemain membeli aset saat harga turun (dipicu berita palsu/asli) dan menjualnya saat naik untuk membangun "Markas Finansial" yang lebih besar.
4. **Simulator "What If":** Kalkulator interaktif yang memvisualisasikan dampak gaya hidup (misal: "Biaya Kopi") terhadap proyeksi kekayaan 10 tahun ke depan menggunakan grafik retro.
5. **Micro-Investing Rewards:** Simulasi pembulatan uang kembalian belanja untuk investasi otomatis.

## 🛠️ Tech Stack
- **Framework:** Next.js (React) - Efisien untuk SEO dan performa.
- **State Management:** Zustand - Untuk mengelola ekonomi game (harga saham, saldo pemain).
- **Styling:** Tailwind CSS + Scanline CSS Effects (untuk estetika CRT/Retro).
- **AI/Cloud (Microsoft Azure):**
  - **Azure OpenAI Service:** Otak dari AI Scout.
  - **Azure AI Document Intelligence:** Ekstraksi data dari PDF Prospektus.
  - **Azure Static Web Apps:** Hosting aplikasi.
- **Database:** Supabase/Firebase (untuk leaderboard & progress saving).

## 🎨 Asset & UI Tools
Untuk menjaga estetika **Cassette Futurism**, gunakan tools berikut:
- **Figma:** Untuk prototyping UI taktis.
- **Aseprite / Piskel:** Membuat sprite pixel-art untuk aset infrastruktur markas.
- **Coolors.co:** Gunakan palet warna *Cyber-Industrial* (Amber/Green on Black).
- **Pixel It:** Mengonversi gambar real menjadi pixel art secara instan.