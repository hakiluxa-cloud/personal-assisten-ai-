// Konstanta OPENAI_API_URL menyimpan endpoint OpenAI Chat Completions API yang dipanggil dari server.
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Fungsi sanitizeMessages memastikan hanya role dan content valid yang dikirim ke provider AI.
function sanitizeMessages(messages) {
  if (!Array.isArray(messages)) return [];

  return messages
    .filter(
      (message) =>
        message &&
        ['system', 'user', 'assistant'].includes(message.role) &&
        typeof message.content === 'string' &&
        message.content.trim().length > 0,
    )
    .map((message) => ({
      role: message.role,
      content: message.content.trim(),
    }));
}

// Fungsi POST menerima history chat dari client, memanggil OpenAI API dengan API key server-side, lalu mengembalikan teks jawaban.
export async function POST(request) {
  try {
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: 'API_KEY belum diatur di environment variable server.' },
        { status: 500 },
      );
    }

    const body = await request.json();
    const messages = sanitizeMessages(body?.messages);

    if (messages.length === 0) {
      return Response.json(
        { error: 'Payload messages wajib berisi minimal satu pesan valid.' },
        { status: 400 },
      );
    }

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Kamu adalah personal AI chat assistant yang ramah, ringkas, dan membantu.',
          },
          ...messages,
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const providerError = data?.error?.message || 'API provider gagal memproses request.';
      return Response.json({ error: providerError }, { status: response.status });
    }

    const text = data?.choices?.[0]?.message?.content?.trim();

    if (!text) {
      return Response.json(
        { error: 'Respons AI kosong atau format respons tidak sesuai.' },
        { status: 502 },
      );
    }

    return Response.json({ text });
  } catch (error) {
    return Response.json(
      { error: error?.message || 'Terjadi kesalahan internal server.' },
      { status: 500 },
    );
  }
}
