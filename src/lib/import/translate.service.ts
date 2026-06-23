/** MyMemory free API — max 500 chars per request */
const MYMEMORY_MAX_CHARS = 450;

function hasChinese(text: string): boolean {
  return /[\u4e00-\u9fff]/.test(text);
}

function sourceLangPair(text: string): string {
  return hasChinese(text) ? "zh-CN|ro" : "en|ro";
}

function hardSplit(text: string, maxLen: number): string[] {
  const result: string[] = [];
  let remaining = text.trim();

  while (remaining.length > maxLen) {
    let cut = remaining.lastIndexOf(" ", maxLen);
    if (cut < maxLen * 0.4) cut = maxLen;
    result.push(remaining.slice(0, cut).trim());
    remaining = remaining.slice(cut).trim();
  }

  if (remaining) result.push(remaining);
  return result;
}

function splitIntoChunks(text: string, maxLen = MYMEMORY_MAX_CHARS): string[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];
  if (normalized.length <= maxLen) return [normalized];

  const lines = normalized.split("\n");
  const chunks: string[] = [];
  let current = "";

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      if (current && !current.endsWith("\n")) current += "\n";
      continue;
    }

    if (line.length > maxLen) {
      if (current.trim()) {
        chunks.push(current.trim());
        current = "";
      }
      chunks.push(...hardSplit(line, maxLen));
      continue;
    }

    const candidate = current ? `${current}\n${line}` : line;
    if (candidate.length > maxLen) {
      if (current.trim()) chunks.push(current.trim());
      current = line;
    } else {
      current = candidate;
    }
  }

  if (current.trim()) chunks.push(current.trim());

  return chunks.flatMap((chunk) =>
    chunk.length > maxLen ? hardSplit(chunk, maxLen) : [chunk]
  );
}

function isMyMemoryLimitError(text: string): boolean {
  return /QUERY LENGTH LIMIT EXCEEDED/i.test(text);
}

async function translateWithMyMemory(
  text: string,
  langpair = "en|ro"
): Promise<string> {
  const email = process.env.MYMEMORY_EMAIL;
  const params = new URLSearchParams({
    q: text,
    langpair,
  });
  if (email) params.set("de", email);

  const res = await fetch(
    `https://api.mymemory.translated.net/get?${params.toString()}`
  );
  const data = (await res.json()) as {
    responseData?: { translatedText?: string };
    responseStatus?: number;
    quotaFinished?: boolean;
  };

  const translated = data.responseData?.translatedText?.trim();
  if (!res.ok || !translated) {
    throw new Error("Traducerea automată nu este disponibilă momentan.");
  }

  if (data.quotaFinished) {
    throw new Error(
      "Limita zilnică de traducere a fost atinsă. Editează manual descrierea sau încearcă mâine."
    );
  }

  if (isMyMemoryLimitError(translated)) {
    throw new Error("MYMEMORY_QUERY_TOO_LONG");
  }

  return translated;
}

async function translateChunkWithMyMemory(
  text: string,
  langpair: string
): Promise<string> {
  try {
    return await translateWithMyMemory(text, langpair);
  } catch (err) {
    if (
      err instanceof Error &&
      err.message === "MYMEMORY_QUERY_TOO_LONG" &&
      text.length > 200
    ) {
      const smaller = hardSplit(text, Math.floor(text.length / 2));
      const parts: string[] = [];
      for (const part of smaller) {
        parts.push(await translateChunkWithMyMemory(part, langpair));
        await new Promise((resolve) => setTimeout(resolve, 350));
      }
      return parts.join("\n");
    }
    throw err;
  }
}

async function translateWithOpenAI(text: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY lipsește.");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_TRANSLATE_MODEL ?? "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "Tradu textul în română pentru un site e-commerce de stații de încărcare EV. Sursa poate fi în chineză, engleză sau altă limbă. Păstrează formatarea, listele, bullet points și specificațiile tehnice (kW, V, Type 2, etc.). Nu adăuga informații noi.",
        },
        { role: "user", content: text },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error("Traducerea cu OpenAI a eșuat.");
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const translated = data.choices?.[0]?.message?.content?.trim();
  if (!translated) throw new Error("Răspuns invalid de la serviciul de traducere.");
  return translated;
}

async function translateWithMyMemoryChunked(
  text: string,
  langpair: string
): Promise<string> {
  const chunks = splitIntoChunks(text);
  const translated: string[] = [];

  for (const chunk of chunks) {
    translated.push(await translateChunkWithMyMemory(chunk, langpair));
    await new Promise((resolve) => setTimeout(resolve, 350));
  }

  return translated.join("\n");
}

export async function translateToRomanian(text: string): Promise<string> {
  const input = text.trim();
  if (!input) return "";

  if (process.env.OPENAI_API_KEY) {
    if (input.length <= 12000) {
      return translateWithOpenAI(input);
    }

    const chunks = splitIntoChunks(input, 4000);
    const translated: string[] = [];
    for (const chunk of chunks) {
      translated.push(await translateWithOpenAI(chunk));
    }
    return translated.join("\n\n");
  }

  const langpair = sourceLangPair(input);
  return translateWithMyMemoryChunked(input, langpair);
}

/** @deprecated Folosește translateToRomanian */
export async function translateEnglishToRomanian(text: string): Promise<string> {
  return translateToRomanian(text);
}
