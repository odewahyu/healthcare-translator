import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const runtime = 'edge';

export async function POST(request) {
  const { text, inputLang, targetLang } = await request.json();

  // Map language codes to full names (for better prompting)
  const languageNames = {
    'en': 'English',
    'id': 'Indonesian',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'zh': 'Chinese',
    'ja': 'Japanese',
    'ar': 'Arabic'
  };

  const prompt = `
  Translate this medical conversation from ${languageNames[inputLang.split('-')[0]]} to ${languageNames[targetLang]}.
  Preserve exact medical terminology. Only return the translation.

  Text: "${text}"
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3
    });

    return new Response(response.choices[0].message.content);
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}