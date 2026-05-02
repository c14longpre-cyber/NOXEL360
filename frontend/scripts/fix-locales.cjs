const fs = require("fs");
const path = require("path");

const localesDir = path.join(process.cwd(), "src", "i18n", "locales");
const outputDir = path.join(process.cwd(), "src", "i18n", "locales_fixed");

fs.mkdirSync(outputDir, { recursive: true });

function extractObjectLiteral(tsContent, varName) {
  const marker = `export const ${varName}`;
  const start = tsContent.indexOf(marker);
  if (start === -1) {
    throw new Error(`Impossible de trouver ${varName}`);
  }

  const braceStart = tsContent.indexOf("{", start);
  if (braceStart === -1) {
    throw new Error(`Impossible de trouver l'objet de ${varName}`);
  }

  let depth = 0;
  let end = -1;

  for (let i = braceStart; i < tsContent.length; i++) {
    const ch = tsContent[i];
    if (ch === "{") depth++;
    if (ch === "}") depth--;
    if (depth === 0) {
      end = i;
      break;
    }
  }

  if (end === -1) {
    throw new Error(`Objet non fermé pour ${varName}`);
  }

  return tsContent.slice(braceStart, end + 1);
}

function parseTranslationObject(tsContent, varName) {
  const objectLiteral = extractObjectLiteral(tsContent, varName);
  const regex = /"([^"]+)"\s*:\s*"((?:\\.|[^"\\])*)"/g;
  const obj = {};
  let match;

  while ((match = regex.exec(objectLiteral)) !== null) {
    obj[match[1]] = match[2]
      .replace(/\\"/g, '"')
      .replace(/\\n/g, "\n");
  }

  return obj;
}

function esc(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n");
}

const enPath = path.join(localesDir, "en.ts");
const enContent = fs.readFileSync(enPath, "utf8");
const enObj = parseTranslationObject(enContent, "en");
const enKeys = Object.keys(enObj);

const files = fs.readdirSync(localesDir)
  .filter((f) => f.endsWith(".ts"));

for (const file of files) {
  const fullPath = path.join(localesDir, file);
  const lang = path.basename(file, ".ts");
  const content = fs.readFileSync(fullPath, "utf8");

  let currentObj = {};
  try {
    currentObj = parseTranslationObject(content, lang);
  } catch (err) {
    console.log(`❌ ${file} ignoré (parse error: ${err.message})`);
    continue;
  }

  const merged = {};

  for (const key of enKeys) {
    merged[key] = Object.prototype.hasOwnProperty.call(currentObj, key)
      ? currentObj[key]
      : enObj[key];
  }

  const lines = [];
  lines.push('import type { TranslationDictionary } from "../types";');
  lines.push("");
  lines.push(`export const ${lang}: TranslationDictionary = {`);

  for (const key of enKeys) {
    lines.push(`  "${key}": "${esc(merged[key])}",`);
  }

  lines.push("};");
  lines.push("");

  const outPath = path.join(outputDir, file);
  fs.writeFileSync(outPath, lines.join("\n"), "utf8");

  const missingCount = enKeys.filter((k) => !(k in currentObj)).length;
  console.log(`✅ ${file} -> locales_fixed (${missingCount} clés ajoutées)`);
}
