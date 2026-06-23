import fs from "fs";

const path = "src/lib/services/catalog.service.ts";
const lines = fs.readFileSync(path, "utf8").split(/\r?\n/);

const endIdx = lines.findIndex((l) => l.trim() === "];" && lines.indexOf(l) > 15);
if (endIdx < 0) throw new Error("]; not found");

// Remove everything between getProducts() closing brace and ];
const startIdx = 19; // line 20 in 1-based = index 19 is `  {`

const fixed = [...lines.slice(0, 19), ...lines.slice(endIdx + 1)];
fs.writeFileSync(path, fixed.join("\n"));
console.log("Removed lines 20 to", endIdx + 1);
