const fs = require("fs");
const path = require("path");

const localesDir = path.join(process.cwd(), "src", "i18n", "locales");
const enPath = path.join(localesDir, "en.ts");

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

function parseTranslationKeys(tsContent, varName) {
  const objectLiteral = extractObjectLiteral(tsContent, varName);
  const regex = /"([^"]+)"\s*:/g;
  const keys = [];
  let match;

  while ((match = regex.exec(objectLiteral)) !== null) {
    keys.push(match[1]);
  }

  return keys;
}

const enContent = fs.readFileSync(enPath, "utf8");
const enKeys = parseTranslationKeys(enContent, "en");

const files = fs.readdirSync(localesDir)
  .filter((f) => f.endsWith(".ts") && f !== "en.ts");

let hasErrors = false;

for (const file of files) {
  const fullPath = path.join(localesDir, file);
  const lang = path.basename(file, ".ts");
  const content = fs.readFileSync(fullPath, "utf8");

  let keys = [];
  try {
    keys = parseTranslationKeys(content, lang);
  } catch (err) {
    hasErrors = true;
    console.log(`❌ ${lang}.ts`);
    console.log(`   Parse error`);
    console.log(`   - ${err.message}`);
    continue;
  }

  const keySet = new Set(keys);

  const missing = enKeys.filter((k) => !keySet.has(k));
  const extra = keys.filter((k) => !enKeys.includes(k));

  if (missing.length === 0 && extra.length === 0) {
    console.log(`✅ ${lang}.ts OK`);
    continue;
  }

  hasErrors = true;
  console.log(`❌ ${lang}.ts`);
  if (missing.length) {
    console.log(`   Missing (${missing.length})`);
    missing.forEach((k) => console.log(`   - ${k}`));
  }
  if (extra.length) {
    console.log(`   Extra (${extra.length})`);
    extra.forEach((k) => console.log(`   + ${k}`));
  }
}

if (!hasErrors) {
  console.log("\\n🎉 Tous les fichiers locales ont exactement les mêmes clés que en.ts");
}
