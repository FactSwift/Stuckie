'use client';
import { useState } from 'react';

const FAQ = [
  {
    q: 'Apa itu SBN?',
    a: 'SBN (Surat Berharga Negara) = utang negara ke lo. Lo minjemin duit ke pemerintah, mereka bayar bunga (kupon) tiap bulan. Dijamin 100% sama negara, jadi basically risk-free. Cocok buat dana darurat yang mau dapet return lebih dari deposito.',
  },
  {
    q: 'Saham vs Reksa Dana bedanya apa?',
    a: 'Saham = lo beli langsung kepemilikan perusahaan. Potensi cuan gede, tapi harus riset sendiri & tahan mental kalau merah. Reksa Dana = lo titip duit ke manajer investasi profesional yang kelola portofolio. Lebih santai, tapi ada biaya pengelolaan (expense ratio).',
  },
  {
    q: 'Kapan waktu terbaik beli saham?',
    a: 'Jujur? Gak ada yang tau pasti. Tapi strategi DCA (Dollar Cost Averaging) — beli rutin tiap bulan tanpa peduli harga — terbukti efektif jangka panjang. Daripada nunggu "harga terendah" yang gak pernah ketemu, mending konsisten aja.',
  },
  {
    q: 'Berapa modal minimal investasi?',
    a: 'Reksa Dana: mulai Rp10.000 aja di beberapa platform. Saham: 1 lot = 100 lembar, jadi tergantung harga sahamnya. BBCA misalnya ~Rp950.000/lot. SBN: biasanya minimal Rp1 juta. Intinya: mulai dari yang lo mampu, yang penting mulai!',
  },
  {
    q: 'Apa itu diversifikasi?',
    a: 'Jangan taruh semua telur di satu keranjang. Spread investasi lo ke beberapa instrumen berbeda (saham, obligasi, reksa dana) supaya kalau satu sektor anjlok, yang lain bisa nahan. Rule of thumb: 60% saham, 30% obligasi, 10% cash/pasar uang.',
  },
];

export default function AIScout() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Yo! Gue AI Scout lo. Tanya apa aja soal investasi, gue jawab pake bahasa manusia. 🤖' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);

    // Simple FAQ matching
    const match = FAQ.find(f =>
      f.q.toLowerCase().split(' ').some(word => userMsg.toLowerCase().includes(word))
    );

    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: match?.a || 'Hmm, pertanyaan bagus. Untuk jawaban yang lebih detail, lo butuh koneksi ke Azure OpenAI (belum disetup di prototype ini). Tapi coba tanya soal: SBN, Saham, Reksa Dana, DCA, atau Diversifikasi!',
      }]);
    }, 600);
  };

  return (
    <div className="flex flex-col gap-3 font-mono h-full">
      <div className="text-amber-400 text-xs tracking-widest">▶ AI SCOUT — FINANCIAL ADVISOR</div>

      {/* Quick Questions */}
      <div className="flex flex-wrap gap-1">
        {FAQ.map(f => (
          <button
            key={f.q}
            onClick={() => { setInput(f.q); }}
            className="text-xs border border-zinc-700 text-zinc-400 px-2 py-0.5 rounded hover:border-cyan-400 hover:text-cyan-400 transition-colors"
          >
            {f.q}
          </button>
        ))}
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto border border-zinc-800 rounded p-2 bg-zinc-900/50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded px-3 py-2 text-xs leading-relaxed
              ${m.role === 'user'
                ? 'bg-amber-400/20 border border-amber-400/50 text-amber-200'
                : 'bg-zinc-800 border border-zinc-700 text-zinc-300'
              }`}>
              {m.role === 'ai' && <span className="text-cyan-400 font-bold mr-1">AI:</span>}
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Tanya soal investasi..."
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-xs text-white outline-none focus:border-amber-400 transition-colors"
        />
        <button
          onClick={handleSend}
          className="border border-amber-400 text-amber-400 px-3 py-2 rounded text-xs hover:bg-amber-400/20 transition-colors"
        >
          SEND
        </button>
      </div>
    </div>
  );
}
