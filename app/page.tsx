import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-[#157a6e] selection:text-white">
      {/* 1. NAVIGATION BAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight text-white">
              LibFlow<span className="text-[#157a6e]">.</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#about" className="hover:text-[#157a6e] transition-colors">Tentang</a>
            <a href="#features" className="hover:text-[#157a6e] transition-colors">Fitur Utama</a>
            <a href="#pricing" className="hover:text-[#157a6e] transition-colors">Paket Sewa</a>
            <a href="#contact" className="hover:text-[#157a6e] transition-colors">Kontak</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/admin" className="hidden sm:block text-sm font-semibold text-zinc-300 hover:text-white">
              Masuk Admin
            </Link>
            <a
              href="#pricing"
              className="bg-[#157a6e] hover:bg-[#116359] text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm shadow-teal-900/30 hover:shadow-md"
            >
              Mulai Coba Gratis
            </a>
          </div>
        </div>
      </nav>

      {/* 2. HERO / INTRODUCTION SECTION */}
      <section id="about" className="pt-36 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Text Content */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 shadow-sm">
              <span className="w-4 h-4 rounded-full bg-[#157a6e] text-white flex items-center justify-center text-[10px]">✦</span>
              Sistem Manajemen Perpustakaan Terintegrasi 2026
            </div>

            <h1 className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Kelola katalog & peminjaman, <br />
              <span className="italic font-serif text-[#157a6e] font-normal">jauh lebih praktis.</span>
            </h1>

            <p className="text-lg text-zinc-400 max-w-lg mx-auto lg:mx-0 font-normal leading-relaxed">
              LibFlow menyatukan pencatatan buku, data peminjam (borrowers), hingga lokasi rak buku dalam satu dashboard modern dan efisien.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#pricing"
                className="w-full sm:w-auto bg-[#157a6e] hover:bg-[#116359] text-white font-medium px-6 py-3.5 rounded-full text-base transition-all flex items-center justify-center gap-2 shadow-md shadow-teal-900/20"
              >
                Coba Bebas Biaya <span className="text-lg">→</span>
              </a>
              <Link
                href="/admin"
                className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 font-medium px-6 py-3.5 rounded-full text-base transition-all flex items-center justify-center gap-2"
              >
                <span className="text-xs text-[#157a6e]">▶</span> Lihat Tampilan Panel
              </Link>
            </div>

            <div className="pt-8 flex items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-zinc-500">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#157a6e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                Cloud Backup Otomatis
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#157a6e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                SLA System 99.9%
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#157a6e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                Digunakan 100+ Perpustakaan
              </span>
            </div>
          </div>

          {/* Right Column: Visual Component / Preview Admin Dashboard Real Data */}
          <div className="lg:col-span-6 relative">
            <div className="bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 p-6 sm:p-7 relative">
              {/* Window Controls */}
              <div className="flex gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                  <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Borrower Management</h4>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-400 font-semibold px-2 py-0.5 rounded-full border border-indigo-500/30">
                    Live Status
                  </span>
                </div>

                {/* Mock Borrower Data Table */}
                <div className="border border-zinc-800 rounded-xl overflow-hidden text-left">
                  <table className="w-full text-[11px] text-zinc-300">
                    <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800">
                      <tr>
                        <th className="p-2">BORROWER</th>
                        <th className="p-2">BOOK</th>
                        <th className="p-2">DURATION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      <tr>
                        <td className="p-2 font-medium text-white">erik</td>
                        <td className="p-2">IPS</td>
                        <td className="p-2 text-zinc-400">0 detik</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium text-white">name</td>
                        <td className="p-2">IPA</td>
                        <td className="p-2 text-zinc-400">14 hari 23 jam</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium text-white">Suki</td>
                        <td className="p-2">IPS</td>
                        <td className="p-2">
                          <span className="text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded text-[9px] font-semibold">
                            Belum dikembalikan
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Real Stat Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                    <p className="text-xl font-bold text-white">24</p>
                    <p className="text-[11px] text-zinc-500 font-medium">Total Book</p>
                  </div>
                  <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                    <p className="text-xl font-bold text-white">1,280</p>
                    <p className="text-[11px] text-zinc-500 font-medium">Active Users</p>
                  </div>
                  <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                    <p className="text-xl font-bold text-emerald-400">Optimal</p>
                    <p className="text-[11px] text-zinc-500 font-medium">System Status</p>
                  </div>
                </div>
              </div>

              {/* Floating Badge (Top Right) */}
              <div className="absolute -top-5 -right-3 bg-[#157a6e] text-white p-3 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-bold border border-teal-500/30">
                <span className="text-base">📚</span>
                <div>
                  <div className="text-sm font-extrabold">Rak A7</div>
                  <div className="text-[10px] font-normal opacity-90">Lokasi Terbaru</div>
                </div>
              </div>

              {/* Floating Badge (Bottom Left) */}
              <div className="absolute -bottom-6 -left-4 bg-zinc-900 border border-zinc-800 text-zinc-200 p-3 rounded-xl shadow-xl flex items-center gap-3 text-xs font-medium">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">✓</div>
                <div>
                  <div className="font-semibold text-white">Transaksi Sukses</div>
                  <div className="text-[10px] text-zinc-400">Buku IPA dikembalikan</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section id="features" className="py-20 bg-zinc-900 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Fitur Lengkap Pengelolaan Perpustakaan
            </h2>
            <p className="text-zinc-400 mt-4">
              Dirancang khusus untuk mempermudah tugas pustakawan dan admin katalog secara efisien.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-[#157a6e] transition-colors">
              <div className="w-12 h-12 bg-[#157a6e]/20 border border-[#157a6e]/40 rounded-xl text-[#157a6e] flex items-center justify-center text-xl mb-6">📖</div>
              <h3 className="text-xl font-bold text-white mb-2">Book Management</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Kelola katalog judul buku, deskripsi, kode buku, serta pemantauan ketersediaan status secara langsung.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-[#157a6e] transition-colors">
              <div className="w-12 h-12 bg-[#157a6e]/20 border border-[#157a6e]/40 rounded-xl text-[#157a6e] flex items-center justify-center text-xl mb-6">👥</div>
              <h3 className="text-xl font-bold text-white mb-2">Borrower Management</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Pencatatan data peminjam lengkap dengan waktu pinjam, estimasi pengembalian, durasi, dan kontak HP.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-[#157a6e] transition-colors">
              <div className="w-12 h-12 bg-[#157a6e]/20 border border-[#157a6e]/40 rounded-xl text-[#157a6e] flex items-center justify-center text-xl mb-6">📍</div>
              <h3 className="text-xl font-bold text-white mb-2">Location Management</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Atur letak lokasi buku berdasarkan kode rak (seperti Rak A7, Rak A5) dan kategori buku dengan rapi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRICING PACKAGES */}
      <section id="pricing" className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Paket Berlangganan Sistem Perpustakaan
          </h2>
          <p className="text-zinc-400 mt-4">
            Pilih paket yang paling sesuai dengan kebutuhan perpustakaan sekolah atau instansi Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Starter Plan */}
          <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Basic Library</h3>
              <p className="text-zinc-500 text-sm mt-1">Untuk perpustakaan skala kecil / Sekolah Dasar.</p>
              <div className="mt-6">
                <span className="text-4xl font-extrabold text-white">Rp 199rb</span>
                <span className="text-zinc-500 text-sm"> / bulan</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-zinc-400">
                <li className="flex items-center gap-2">✓ Hingga 1,000 Data Buku</li>
                <li className="flex items-center gap-2">✓ Fitur Borrowers Management</li>
                <li className="flex items-center gap-2">✓ Manajemen Rak/Lokasi Dasar</li>
              </ul>
            </div>
            <button className="mt-8 w-full py-3 rounded-full border border-zinc-700 font-semibold text-zinc-200 hover:bg-zinc-800 transition-colors">
              Pilih Paket Basic
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-zinc-900 p-8 rounded-2xl border-2 border-[#157a6e] flex flex-col justify-between relative shadow-xl shadow-teal-950/40">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#157a6e] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Paling Populer
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">Pro Library</h3>
              <p className="text-zinc-400 text-sm mt-1">Untuk Sekolah Menengah & Perguruan Tinggi.</p>
              <div className="mt-6">
                <span className="text-4xl font-extrabold text-white">Rp 499rb</span>
                <span className="text-zinc-500 text-sm"> / bulan</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-zinc-300">
                <li className="flex items-center gap-2">✓ Unlimited Data Buku & Pemijam</li>
                <li className="flex items-center gap-2">✓ Notifikasi Pengembalian Peminjam</li>
                <li className="flex items-center gap-2">✓ Dashboard Analytics Status Sistem</li>
                <li className="flex items-center gap-2">✓ Multi-Admin Access Control</li>
              </ul>
            </div>
            <button className="mt-8 w-full py-3 rounded-full bg-[#157a6e] text-white font-semibold hover:bg-[#116359] transition-colors shadow-md">
              Mulai Uji Coba Gratis
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Custom / Daerah</h3>
              <p className="text-zinc-500 text-sm mt-1">Untuk jaringan perpustakaan daerah / multi-cabang.</p>
              <div className="mt-6">
                <span className="text-4xl font-extrabold text-white">Custom</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-zinc-400">
                <li className="flex items-center gap-2">✓ Integrasi API & Server Dedicated</li>
                <li className="flex items-center gap-2">✓ Kustomisasi Fitur Sesuai Kebutuhan</li>
                <li className="flex items-center gap-2">✓ Dukungan Teknis 24/7 Prioritas</li>
              </ul>
            </div>
            <button className="mt-8 w-full py-3 rounded-full border border-zinc-700 font-semibold text-zinc-200 hover:bg-zinc-800 transition-colors">
              Hubungi Tim Sales
            </button>
          </div>
        </div>
      </section>

      {/* 5. CONTACT US & MAPS SECTION */}
      <section id="contact" className="py-20 bg-zinc-900 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Hubungi Kami
            </h2>
            <p className="text-zinc-400 mt-4">
              Ada pertanyaan seputar integrasi sistem perpustakaan? Kirim pesan atau kunjungi lokasi kami.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <form className="space-y-4 bg-zinc-950 p-8 rounded-2xl border border-zinc-800">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Masukkan nama Anda"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-100 text-sm focus:outline-none focus:border-[#157a6e]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Email</label>
                <input
                  type="email"
                  placeholder="email@sekolah.sch.id"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-100 text-sm focus:outline-none focus:border-[#157a6e]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Pesan</label>
                <textarea
                  rows={4}
                  placeholder="Tuliskan pertanyaan atau kebutuhan sistem Anda..."
                  className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-100 text-sm resize-none focus:outline-none focus:border-[#157a6e]"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-[#157a6e] hover:bg-[#116359] text-white font-semibold py-3.5 rounded-xl transition-all shadow-md"
              >
                Kirim Pesan
              </button>
            </form>

            {/* Google Maps & Office Info */}
            <div className="flex flex-col h-full justify-between gap-6">
              <div className="w-full h-80 rounded-2xl overflow-hidden border border-zinc-800 shadow-sm relative">
                <iframe
                  title="Office Location"
                  className="w-full h-full border-0 grayscale opacity-80 hover:opacity-100 transition-opacity"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63363.604708782674!2d110.26881214863276!3d-6.982718900000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708b0069d48d79%3A0x6a552a36b14a7cfc!2sKost%20Mbah%20Dar!5e0!3m2!1sen!2sid!4v1794056059385!5m2!1sen!2sid"                  loading="lazy"
                ></iframe>
              </div>
              <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row justify-between gap-4 text-sm text-zinc-400">
                <div>
                  <h4 className="font-bold text-white mb-1">Kontak Langsung</h4>
                  <p>Email: admin@library.com</p>
                  <p>Telepon: +62 21 555 0192</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-zinc-950 border-t border-zinc-900 text-zinc-500 text-center text-xs">
        <p>© 2026 LibFlow Library System. All rights reserved.</p>
      </footer>
    </div>
  );
}