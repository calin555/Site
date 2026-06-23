const MAX_CHUNK_CHARS = 420;

function splitIntoChunks(text: string): string[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  if (normalized.length <= MAX_CHUNK_CHARS) {
    return [normalized];
  }

  const paragraphs = normalized.split(/\n{2,}/);
  const chunks: string[] = [];
  let current = "";

  for (const paragraph of paragraphs) {
    const piece = paragraph.trim();
    if (!piece) continue;

    if (piece.length > MAX_CHUNK_CHARS) {
      if (current) {
        chunks.push(current.trim());
        current = "";
      }

      const sentences = piece.split(/(?<=[.!?])\s+/);
      for (const sentence of sentences) {
        if (`${current} ${sentence}`.trim().length > MAX_CHUNK_CHARS) {
          if (current.trim()) chunks.push(current.trim());
          current = sentence;
        } else {
          current = `${current} ${sentence}`.trim();
        }
      }
      continue;
    }

    if (`${current}\n\n${piece}`.length > MAX_CHUNK_CHARS) {
      if (current.trim()) chunks.push(current.trim());
      current = piece;
    } else {
      current = current ? `${current}\n\n${piece}` : piece;
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

async function translateWithMyMemory(text: string): Promise<string> {
  const email = process.env.MYMEMORY_EMAIL;
  const params = new URLSearchParams({
    q: text,
    langpair: "en|ro",
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

  if (!res.ok || !data.responseData?.translatedText) {
    throw new Error("Traducerea automată nu este disponibilă momentan.");
  }

  if (data.quotaFinished) {
    throw new Error(
      "Limita zilnică de traducere a fost atinsă. Editează manual descrierea sau încearcă mâine."
    );
  }

  return data.responseData.translatedText;
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
            "Tradu textul în română pentru un site e-commerce de stații de încărcare EV. Păstrează formatarea, listele și specificațiile tehnice. Nu adăuga informații noi.",
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

export async function translateEnglishToRomanian(text: string): Promise<string> {
  const input = text.trim();
  if (!input) return "";

  if (process.env.OPENAI_API_KEY) {
    if (input.length <= 12000) {
      return translateWithOpenAI(input);
    }

    const chunks = splitIntoChunks(input);
    const translated: string[] = [];
    for (const chunk of chunks) {
      translated.push(await translateWithOpenAI(chunk));
    }
    return translated.join("\n\n");
  }

  const chunks = splitIntoChunks(input);
  const translated: string[] = [];

  for (const chunk of chunks) {
    translated.push(await translateWithMyMemory(chunk));
    await new Promise((resolve) => setTimeout(resolve, 350));
  }

  return translated.join("\n\n");
}
