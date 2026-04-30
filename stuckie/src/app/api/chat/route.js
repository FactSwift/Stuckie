import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const client = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_KEY,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}`,
  defaultQuery: { 'api-version': '2024-02-01' },
  defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_KEY },
});

export async function POST(req) {
  try {
    const { messages, context } = await req.json();

    const systemPrompt = context
      ? `Kamu adalah AI Scout, asisten investasi cerdas dalam game Stuckie. 
Kamu memiliki akses ke prospektus investasi berikut. Jawab pertanyaan pengguna berdasarkan isi prospektus ini.
Gunakan bahasa Indonesia yang mudah dipahami, santai, dan informatif.
Jika pertanyaan tidak berkaitan dengan prospektus, tetap jawab dengan pengetahuan investasi umum.

=== ISI PROSPEKTUS ===
${context.slice(0, 12000)}
=== AKHIR PROSPEKTUS ===`
      : `Kamu adalah AI Scout, asisten investasi cerdas dalam game Stuckie.
Jawab pertanyaan soal investasi (saham, reksa dana, obligasi, dll) dengan bahasa Indonesia yang mudah dipahami dan santai.
Berikan jawaban yang praktis dan relevan untuk investor pemula.`;

    const response = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    return NextResponse.json({
      reply: response.choices[0].message.content,
    });
  } catch (err) {
    console.error('Chat error:', err);
    return NextResponse.json(
      { error: 'Gagal menghubungi AI. Pastikan konfigurasi Azure OpenAI sudah benar.' },
      { status: 500 }
    );
  }
}
