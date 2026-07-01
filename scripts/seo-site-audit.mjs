/**
 * Audit SEO tehnic — rulează local: node scripts/seo-site-audit.mjs
 * Verifică: canibalizare, duplicate title, pagini orfane potențiale, linkuri interne.
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";

const ROOT = join(import.meta.dirname, "..");
const SRC = join(ROOT, "src");

function walk(dir, ext, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === "node_modules" || entry === ".next") continue;
      walk(full, ext, files);
    } else if (full.endsWith(ext)) {
      files.push(full);
    }
  }
  return files;
}

function extractCommercialSlugs() {
  const pagesDir = join(SRC, "lib/seo/commercial/pages");
  const files = walk(pagesDir, ".ts");
  const slugs = [];
  const slugRe = /slug:\s*["'](statie-incarcare[^"']+)["']/g;
  for (const file of files) {
    const content = readFileSync(file, "utf8");
    let m;
    while ((m = slugRe.exec(content)) !== null) {
      slugs.push(m[1]);
    }
  }
  return [...new Set(slugs)];
}

function extractInternalLinks() {
  const tsxFiles = [...walk(join(SRC, "app"), ".tsx"), ...walk(join(SRC, "components"), ".tsx")];
  const hrefRe = /href=["'{](\/[^"'}\s#?]+)/g;
  const links = new Set();
  for (const file of tsxFiles) {
    const content = readFileSync(file, "utf8");
    let m;
    while ((m = hrefRe.exec(content)) !== null) {
      const href = m[1].split("?")[0].split("#")[0];
      if (href.startsWith("/") && !href.startsWith("//")) links.add(href);
    }
  }
  return links;
}

function extractMetaTitles() {
  const slugs = extractCommercialSlugs();
  const registry = readFileSync(join(SRC, "lib/seo/commercial/landing-conversion.ts"), "utf8");
  const titleRe = /metaTitle:\s*["']([^"']+)["']/g;
  const titles = new Map();
  let m;
  while ((m = titleRe.exec(registry)) !== null) {
    titles.set(m[1].toLowerCase(), (titles.get(m[1].toLowerCase()) || 0) + 1);
  }
  return { slugs, duplicateTitles: [...titles.entries()].filter(([, c]) => c > 1) };
}

function checkCannibalization(slugs) {
  const keywordGroups = new Map();
  for (const slug of slugs) {
    const kw = slug.replace("statie-incarcare-", "");
    const parts = kw.split("-");
    for (let i = 0; i < parts.length; i++) {
      const key = parts.slice(i).join("-");
      if (key.length < 3) continue;
      if (!keywordGroups.has(key)) keywordGroups.set(key, []);
      keywordGroups.get(key).push(slug);
    }
  }
  return [...keywordGroups.entries()]
    .filter(([, pages]) => pages.length > 1)
    .map(([kw, pages]) => ({ keyword: kw, pages: [...new Set(pages)] }))
    .filter((g) => g.pages.length > 1 && g.keyword.length > 4);
}

function main() {
  const slugs = extractCommercialSlugs();
  const internalLinks = extractInternalLinks();
  const { duplicateTitles } = extractMetaTitles();
  const cannibalization = checkCannibalization(slugs);

  const landingPaths = new Set(slugs.map((s) => `/${s}`));
  const orphans = [...landingPaths].filter((p) => {
    let refs = 0;
    for (const link of internalLinks) {
      if (link === p || link.startsWith(p + "/")) refs++;
    }
    return refs < 2;
  });

  const brokenPatterns = ["/statie-incarcare-abb", "/statie-incarcare-wallbox-premium"];
  const brokenFound = brokenPatterns.filter((p) => internalLinks.has(p));

  console.log("\n=== SEO Site Audit — ChargePro ===\n");
  console.log(`Landing pages: ${slugs.length}`);
  console.log(`Internal links unique: ${internalLinks.size}`);

  console.log("\n--- Canibalizare potențială ---");
  if (cannibalization.length === 0) {
    console.log("OK — fără suprapuneri majore detectate.");
  } else {
    cannibalization.slice(0, 10).forEach((c) => {
      console.log(`  [${c.keyword}] → ${c.pages.join(", ")}`);
    });
  }

  console.log("\n--- Title duplicate (conversion overrides) ---");
  if (duplicateTitles.length === 0) {
    console.log("OK");
  } else {
    duplicateTitles.forEach(([t, c]) => console.log(`  "${t}" × ${c}`));
  }

  console.log("\n--- Pagini landing cu puține linkuri interne (<2) ---");
  orphans.slice(0, 15).forEach((p) => console.log(`  ${p}`));

  console.log("\n--- Broken link patterns ---");
  if (brokenFound.length === 0) {
    console.log("OK — pattern-uri cunoscute absente.");
  } else {
    brokenFound.forEach((p) => console.log(`  FOUND: ${p}`));
  }

  console.log("\n--- Recomandări ---");
  console.log("  1. Import GSC CSV → src/lib/seo/gsc/opportunity-engine.ts");
  console.log("  2. Verifică orphans — adaugă link din hub /statii-incarcare");
  console.log("  3. Rulează Google Rich Results Test pe /produse/* după deploy");
  console.log("");
}

main();
