'use client';
import { useState, useRef } from 'react';

const FAQ = [
  { q: 'Apa itu SBN?', },
  { q: 'Saham vs Reksa Dana bedanya apa?' },
  { q: 'Kapan waktu terbaik beli saham?' },
  { q: 'Berapa modal minimal investasi?' },
  { q: 'Apa itu diversifikasi?' },
];

export default function AIScout() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Halo! Gue AI Scout, asisten investasi lo. Upload prospektus PDF atau tanya apa aja soal investasi! 🤖' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pdfContext, setPdfContext] = useState(null);
  const [pdfName, setPdfName] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);
  const [chatHistory, setChatHistory] = useState([]);

  const scrollToBottom = () => {
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith('.pdf')) {
      addAiMessage('❌ Hanya file PDF yang didukung.');
      return;
    }

    setUploadLoading(true);
    addAiMessage(`📄 Membaca "${file.name}"... tunggu sebentar.`);

    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/extract-pdf', { method: 'POST', body: form });
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      setPdfContext(data.text);
      setPdfName(file.name);
      setChatHistory([]);
      addAiMessage(`✅ Prospektus "${file.name}" berhasil dibaca (${data.pageCount} halaman)! Sekarang lo bisa tanya apa aja tentang isinya.`);
    } catch (err) {
      addAiMessage(`❌ Gagal membaca PDF: ${err.message}`);
    } finally {
      setUploadLoading(false);
      fileInputRef.current.value = '';
    }
  };

  const addAiMessage = (text) => {
    setMessages(prev => [...prev, { role: 'ai', text }]);
    scrollToBottom();
  };

  const handleSend = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');

    const userEntry = { role: 'user', text: msg };
    setMessages(prev => [...prev, userEntry]);
    setLoading(true);
    scrollToBottom();

    const newHistory = [...chatHistory, { role: 'user', content: msg }];

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory,
          context: pdfContext,
        }),
      });
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      const reply = data.reply;
      setChatHistory([...newHistory, { role: 'assistant', content: reply }]);
      setMessages(prev => [...prev, { role: 'ai', text: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: `❌ ${err.message}` }]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const clearPdf = () => {
    setPdfContext(null);
    setPdfName(null);
    setChatHistory([]);
    addAiMessage('🗑️ Prospektus dihapus. Sekarang gue balik ke mode umum.');
  };

  return (
    <div className="flex flex-col gap-3 font-mono h-full">
      <div className="text-amber-400 text-xs tracking-widest">▶ AI SCOUT — PENASIHAT KEUANGAN</div>

      {/* PDF Upload area */}
      <div className={`border rounded-lg p-2 text-xs transition-all
        ${pdfContext ? 'border-green-500/50 bg-green-900/10' : 'border-zinc-700 bg-zinc-900/50'}`}>
        {pdfContext ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-400">
              <span>📄</span>
              <span className="truncate max-w-[200px]">{pdfName}</span>
              <span className="text-green-600">— aktif</span>
            </div>
            <button onClick={clearPdf}
              className="text-zinc-500 hover:text-red-400 transition-colors text-xs px-1">
              ✕ hapus
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-zinc-500">Upload prospektus PDF untuk analisis mendalam</span>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadLoading}
              className="border border-amber-400/50 text-amber-400 px-2 py-1 rounded hover:bg-amber-400/20 transition-colors disabled:opacity-50">
              {uploadLoading ? '⏳ Membaca...' : '📤 Upload PDF'}
            </button>
          </div>
        )}
        <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleUpload} />
      </div>

      {/* Quick questions */}
      {!pdfContext && (
        <div className="flex flex-wrap gap-1">
          {FAQ.map(f => (
            <button key={f.q} onClick={() => handleSend(f.q)}
              className="text-xs border border-zinc-700 text-zinc-400 px-2 py-0.5 rounded hover:border-cyan-400 hover:text-cyan-400 transition-colors">
              {f.q}
            </button>
          ))}
        </div>
      )}

      {/* Chat */}
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto border border-zinc-800 rounded p-2 bg-zinc-900/50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap
              ${m.role === 'user'
                ? 'bg-amber-400/20 border border-amber-400/50 text-amber-200'
                : 'bg-zinc-800 border border-zinc-700 text-zinc-300'
              }`}>
              {m.role === 'ai' && <span className="text-cyan-400 font-bold mr-1">AI:</span>}
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 border border-zinc-700 text-zinc-500 rounded px-3 py-2 text-xs">
              AI: <span className="animate-pulse">●●●</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder={pdfContext ? `Tanya tentang ${pdfName}...` : 'Tanya soal investasi...'}
          disabled={loading}
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-xs text-white outline-none focus:border-amber-400 transition-colors disabled:opacity-50"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="border border-amber-400 text-amber-400 px-3 py-2 rounded text-xs hover:bg-amber-400/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          KIRIM
        </button>
      </div>
    </div>
  );
}
