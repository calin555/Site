export interface ImportedProductData {
  name?: string;
  shortDescription?: string;
  description?: string;
  image?: string;
  images?: string[];
  suggestedPowerKw?: number;
  suggestedConnectors?: string[];
  suggestedCategorySlug?: string;
  source: "alibaba" | "generic";
  sourceUrl: string;
}

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function decodeHtml(text: string): string {
  return text
    .replace(/\\n/g, "\n")
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function metaContent(html: string, property: string): string | undefined {
  const patterns = [
    new RegExp(
      `property=["']${property}["']\\s+content=["']([^"']+)`,
      "i"
    ),
    new RegExp(
      `content=["']([^"']+)["']\\s+property=["']${property}["']`,
      "i"
    ),
    new RegExp(`name=["']${property}["']\\s+content=["']([^"']+)`, "i"),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeHtml(match[1]);
  }

  return undefined;
}

function titleFromHtml(html: string): string | undefined {
  const title = html.match(/<title[^>]*>([^<]+)/i)?.[1];
  if (!title) return undefined;
  return decodeHtml(title.split(" - Buy ")[0].split(" - Alibaba")[0]);
}

function parseDetailData(html: string): Record<string, unknown> | null {
  const match = html.match(/window\.detailData\s*=\s*(\{[\s\S]*?\});\s*\n/);
  if (!match) return null;

  try {
    return JSON.parse(match[1]) as Record<string, unknown>;
  } catch {
    return null;
  }
}

interface AlibabaProperty {
  attrName?: string;
  attrValue?: string;
}

function uniqueProperties(items: AlibabaProperty[]): AlibabaProperty[] {
  const map = new Map<string, string>();

  for (const item of items) {
    const name = item.attrName?.trim();
    const value = item.attrValue?.trim();
    if (!name || !value) continue;

    const existing = map.get(name);
    if (!existing) {
      map.set(name, value);
      continue;
    }

    if (!existing.split(",").map((v) => v.trim()).includes(value)) {
      map.set(name, `${existing}, ${value}`);
    }
  }

  return [...map.entries()].map(([attrName, attrValue]) => ({
    attrName,
    attrValue,
  }));
}

function parsePowerKw(text: string): number | undefined {
  const matches = [...text.matchAll(/(\d+(?:\.\d+)?)\s*kW/gi)].map((m) =>
    parseFloat(m[1])
  );
  if (!matches.length) return undefined;
  return Math.max(...matches);
}

function parseConnectors(...values: string[]): string[] {
  const text = values.join(" ").toLowerCase();
  const connectors: string[] = [];

  if (/type\s*2|type2/.test(text)) connectors.push("Type 2");
  if (/type\s*1|type1/.test(text)) connectors.push("Type 1");
  if (/ccs\s*1|ccs1/.test(text)) connectors.push("CCS2");
  if (/ccs\s*2|ccs2/.test(text)) connectors.push("CCS2");
  if (/chademo/.test(text)) connectors.push("CHAdeMO");
  if (/tesla/.test(text)) connectors.push("Tesla");

  return [...new Set(connectors)];
}

function suggestCategory(name: string, properties: AlibabaProperty[]): string | undefined {
  const text = `${name} ${properties.map((p) => `${p.attrName} ${p.attrValue}`).join(" ")}`.toLowerCase();

  if (/dc|fast charg|ccs|chademo|gb\/t|gbt/.test(text)) return "statii-dc";
  if (/ac|wallbox|type\s*2|type\s*1|7\.4|11\s*kw|22\s*kw/.test(text)) return "statii-ac";
  if (/cabl|conector|accesor|adapter|protect/.test(text)) return "accesorii";
  if (/ocpp|smart|wifi|4g|app|rfid/.test(text)) return "smart-ocpp";

  return undefined;
}

function buildDescription(
  name: string,
  application: string | undefined,
  properties: AlibabaProperty[],
  sourceUrl: string
): string {
  const lines: string[] = [name];

  if (application) {
    lines.push("", `Aplicație: ${application}`);
  }

  if (properties.length) {
    lines.push("", "Specificații tehnice:");
    for (const prop of properties) {
      lines.push(`• ${prop.attrName}: ${prop.attrValue}`);
    }
  }

  lines.push("", `Sursă: ${sourceUrl}`);
  return lines.join("\n");
}

function buildShortDescription(name: string, application?: string): string {
  const base = application ? `${name}. ${application}` : name;
  if (base.length <= 160) return base;
  return `${base.slice(0, 157).trim()}...`;
}

function parseAlibaba(html: string, sourceUrl: string): ImportedProductData {
  const detailData = parseDetailData(html);
  const globalData = detailData?.globalData as
    | { product?: Record<string, unknown> }
    | undefined;
  const product = globalData?.product;

  const subject = decodeHtml(String(product?.subject ?? ""));
  const name =
    subject ||
    metaContent(html, "og:title") ||
    titleFromHtml(html) ||
    undefined;

  const application = product?.applicationProperty
    ? decodeHtml(String(product.applicationProperty))
    : undefined;

  const properties = uniqueProperties([
    ...((product?.productBasicProperties as AlibabaProperty[]) ?? []),
    ...((product?.productOtherProperties as AlibabaProperty[]) ?? []),
  ]);

  const mediaItems = (product?.mediaItems as Array<{ imageUrl?: { big?: string } }>) ?? [];
  const images = mediaItems
    .map((item) => item.imageUrl?.big)
    .filter((url): url is string => Boolean(url));

  const image =
    images[0] ||
    metaContent(html, "og:image") ||
    html.match(/https:\/\/sc\d+\.alicdn\.com\/[^"'\s]+/i)?.[0];

  const powerText = properties
    .filter((p) => /power|putere|output/i.test(p.attrName ?? ""))
    .map((p) => p.attrValue)
    .join(" ");

  const connectorValues = properties
    .filter((p) => /interface|charging|connector|standard/i.test(p.attrName ?? ""))
    .map((p) => p.attrValue ?? "");

  const description =
    buildDescription(name ?? "Produs", application, properties, sourceUrl) ||
    metaContent(html, "og:description") ||
    metaContent(html, "description");

  return {
    name,
    shortDescription: name ? buildShortDescription(name, application) : undefined,
    description,
    image,
    images,
    suggestedPowerKw: parsePowerKw(`${name ?? ""} ${powerText}`),
    suggestedConnectors: parseConnectors(...connectorValues, name ?? ""),
    suggestedCategorySlug: name ? suggestCategory(name, properties) : undefined,
    source: "alibaba",
    sourceUrl,
  };
}

function parseGeneric(html: string, sourceUrl: string): ImportedProductData {
  const name =
    metaContent(html, "og:title") ||
    titleFromHtml(html) ||
    undefined;

  const description =
    metaContent(html, "og:description") ||
    metaContent(html, "description");

  const image = metaContent(html, "og:image");

  return {
    name,
    shortDescription: description?.slice(0, 160),
    description: description
      ? `${description}\n\nSursă: ${sourceUrl}`
      : undefined,
    image,
    images: image ? [image] : [],
    source: "generic",
    sourceUrl,
  };
}

function isAlibabaUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host.includes("alibaba.com");
  } catch {
    return false;
  }
}

export async function importProductFromUrl(
  rawUrl: string
): Promise<ImportedProductData> {
  const sourceUrl = rawUrl.trim();
  if (!sourceUrl) {
    throw new Error("Introdu un URL valid.");
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(sourceUrl);
  } catch {
    throw new Error("URL invalid.");
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("URL-ul trebuie să înceapă cu http sau https.");
  }

  const response = await fetch(sourceUrl, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "en-US,en;q=0.9",
    },
    redirect: "follow",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Nu am putut accesa pagina (cod ${response.status}).`);
  }

  const html = await response.text();
  if (!html || html.length < 500) {
    throw new Error("Pagina nu conține date suficiente pentru import.");
  }

  const result = isAlibabaUrl(sourceUrl)
    ? parseAlibaba(html, sourceUrl)
    : parseGeneric(html, sourceUrl);

  if (!result.name && !result.description && !result.image) {
    throw new Error(
      "Nu am găsit titlu, descriere sau imagine pe această pagină."
    );
  }

  return result;
}
