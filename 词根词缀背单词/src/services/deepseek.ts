const baseUrl = (import.meta.env.VITE_DEEPSEEK_BASE_URL as string | undefined) ?? 'https://api.deepseek.com';
const legacyApiKey = typeof __DEEPSEEK_FALLBACK_KEY__ === 'string' && __DEEPSEEK_FALLBACK_KEY__.trim()
  ? __DEEPSEEK_FALLBACK_KEY__
  : undefined;
const apiKey = (import.meta.env.VITE_DEEPSEEK_API_KEY as string | undefined) ?? legacyApiKey;
const model = (import.meta.env.VITE_DEEPSEEK_MODEL as string | undefined) ?? 'deepseek-chat';

function buildUrl(path: string) {
  if (!baseUrl) return '';
  const trimmed = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  if (trimmed.endsWith('/v1') && path.startsWith('/v1')) return `${trimmed}${path.slice(3)}`;
  return `${trimmed}${path.startsWith('/') ? path : `/${path}`}`;
}

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

async function chat(messages: ChatMessage[], temperature = 0.4): Promise<string | null> {
  if (!baseUrl) return null;
  const url = buildUrl('/v1/chat/completions');
  const payload = {
    model,
    messages,
    temperature,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) return null;
  const data = await res.json() as { choices?: { message?: { content?: string } }[] };
  const text = data.choices?.[0]?.message?.content?.trim();
  return text || null;
}

export async function requestDeepseekExamples(morpheme: string): Promise<string[] | null> {
  const text = await chat(
    [
      { role: 'system', content: 'You generate concise English word lists only.' },
      { role: 'user', content: `Give 8 English words that contain the morpheme "${morpheme}". Return a comma-separated list only.` },
    ],
    0.4,
  );
  if (!text) return null;
  return text
    .split(/[,;\n\r]+/g)
    .map((v) => v.trim().toLowerCase())
    .filter((v) => v.length >= 3 && v.length <= 24)
    .slice(0, 12);
}

export interface DeepseekMorphemeDetail {
  meaning: string;
  examples: string[];
}

export interface DeepseekConnectionReport {
  ok: boolean;
  endpoint: string;
  model: string;
  hasApiKey: boolean;
  reply?: string;
  error?: string;
}

export async function probeDeepseekConnection(): Promise<DeepseekConnectionReport> {
  const endpoint = buildUrl('/v1/chat/completions');
  if (!baseUrl) {
    return {
      ok: false,
      endpoint,
      model,
      hasApiKey: Boolean(apiKey),
      error: '未配置 DeepSeek Base URL。',
    };
  }

  try {
    const reply = await chat(
      [
        { role: 'system', content: 'Reply in plain Chinese within 12 characters.' },
        { role: 'user', content: '请只回复：连接成功' },
      ],
      0,
    );

    if (!reply) {
      return {
        ok: false,
        endpoint,
        model,
        hasApiKey: Boolean(apiKey),
        error: '接口已返回，但没有拿到有效内容。',
      };
    }

    return {
      ok: true,
      endpoint,
      model,
      hasApiKey: Boolean(apiKey),
      reply,
    };
  } catch (error) {
    return {
      ok: false,
      endpoint,
      model,
      hasApiKey: Boolean(apiKey),
      error: error instanceof Error ? error.message : '请求失败',
    };
  }
}

export async function requestDeepseekMorphemeDetail(
  morpheme: string,
  type: 'prefix' | 'root' | 'suffix',
  relatedWords: string[],
): Promise<DeepseekMorphemeDetail | null> {
  const text = await chat(
    [
      { role: 'system', content: 'Return strict JSON only. Keep Chinese concise and accurate for vocabulary learning.' },
      {
        role: 'user',
        content: `For morpheme "${morpheme}" (${type}), with related words: ${relatedWords.slice(0, 10).join(', ') || 'none'}.
Return JSON:
{"meaning":"...","examples":["word1","word2","word3","word4"]}
Rules: examples must include this morpheme and be lowercase english words.`,
      },
    ],
    0.2,
  );
  if (!text) return null;
  try {
    const data = JSON.parse(text) as { meaning?: string; examples?: string[] };
    const meaning = data.meaning?.trim();
    const examples = (data.examples ?? [])
      .map((v) => v.trim().toLowerCase())
      .filter((v) => v.length >= 3 && v.length <= 24 && v.includes(morpheme.toLowerCase()))
      .slice(0, 8);
    if (!meaning) return null;
    return { meaning, examples };
  } catch {
    return null;
  }
}
