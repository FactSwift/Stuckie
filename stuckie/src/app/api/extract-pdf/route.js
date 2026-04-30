import { DocumentAnalysisClient, AzureKeyCredential } from '@azure/ai-form-recognizer';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const client = new DocumentAnalysisClient(
      process.env.AZURE_DOC_INTEL_ENDPOINT,
      new AzureKeyCredential(process.env.AZURE_DOC_INTEL_KEY)
    );

    const poller = await client.beginAnalyzeDocument('prebuilt-read', buffer);
    const result = await poller.pollUntilDone();

    // Ekstrak semua teks dari halaman
    const text = result.pages
      .flatMap(p => p.lines ?? [])
      .map(l => l.content)
      .join('\n');

    return NextResponse.json({
      text,
      pageCount: result.pages.length,
      fileName: file.name,
    });
  } catch (err) {
    console.error('PDF extraction error:', err);
    return NextResponse.json(
      { error: 'Gagal membaca PDF. Pastikan konfigurasi Azure Document Intelligence sudah benar.' },
      { status: 500 }
    );
  }
}
