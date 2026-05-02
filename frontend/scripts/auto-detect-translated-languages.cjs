const fs = require("fs");
const path = require("path");

const projectRoot = process.cwd();
const localesDir = path.join(projectRoot, "src", "i18n", "locales");
const typesPath = path.join(projectRoot, "src", "i18n", "types.ts");
const backupPath = path.join(projectRoot, "src", "i18n", "types.backup.ts");

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

function readLocaleKeys(filePath, lang) {
  const content = fs.readFileSync(filePath, "utf8");
  return parseTranslationKeys(content, lang);
}

const enPath = path.join(localesDir, "en.ts");
const enKeys = readLocaleKeys(enPath, "en");
const enKeySet = new Set(enKeys);

const localeFiles = fs.readdirSync(localesDir)
  .filter((f) => f.endsWith(".ts"))
  .sort((a, b) => a.localeCompare(b));

const extended = [];
const complete = [];
const partial = [];
const parseErrors = [];

for (const file of localeFiles) {
  const lang = path.basename(file, ".ts");
  const fullPath = path.join(localesDir, file);

  try {
    const keys = readLocaleKeys(fullPath, lang);
    const keySet = new Set(keys);

    const missing = enKeys.filter((k) => !keySet.has(k));
    const extra = keys.filter((k) => !enKeySet.has(k));

    extended.push(lang);

    if (missing.length === 0 && extra.length === 0) {
      complete.push(lang);
    } else {
      partial.push({
        lang,
        missing: missing.length,
        extra: extra.length,
      });
    }
  } catch (err) {
    parseErrors.push({ lang, error: err.message });
  }
}

if (fs.existsSync(typesPath)) {
  fs.copyFileSync(typesPath, backupPath);
}

const supportedUnion = extended.map((lang) => `  | "${lang}"`).join("\n");

const coreComplete = complete.join('", "');
const extendedAll = extended.join('", "');
const fullyAll = complete.join('", "');

const typesContent = `/**
 * Types pour le système i18n NOXEL.
 */

/** Code d'une langue supportée */
export type SupportedLanguage =
${supportedUnion};

/** Code de langue générique (ex: "fr-CA", "ike") */
export type AppLanguage = string;

export type TranslationValue = string;
export type TranslationDictionary = Record<string, TranslationValue>;
export type TranslationParams = Record<string, string | number>;

export type TranslationStatus =
  | "complete"
  | "partial"
  | "untranslated"
  | "missing";

export type LanguageOption = {
  code: AppLanguage;
  label: string;
  nativeLabel: string;
  flag?: string;
  family?: string;
  indigenous?: boolean;
  direction?: "ltr" | "rtl";
  translationStatus?: TranslationStatus;
};

/** Langues 100% validées (mêmes clés que en.ts) */
export const CORE_FULLY_TRANSLATED_LANGUAGES = [
  "${coreComplete}"
] as const;

/** Langues avec fichiers présents dans /locales */
export const EXTENDED_TRANSLATED_LANGUAGES: SupportedLanguage[] = [
  "${extendedAll}"
];

/** Langues officiellement considérées fully translated */
export const FULLY_TRANSLATED_LANGUAGES: SupportedLanguage[] = [
  "${fullyAll}"
];
`;

fs.writeFileSync(typesPath, typesContent, "utf8");

console.log("\\n=== AUTO DETECT RESULT ===");
console.log(`Complete: ${complete.length}`);
console.log(`Extended: ${extended.length}`);
console.log(`Partial:  ${partial.length}`);
console.log(`Errors:   ${parseErrors.length}`);

console.log("\\nComplete languages:");
console.log(complete.join(", "));

if (partial.length) {
  console.log("\\nPartial languages:");
  for (const item of partial) {
    console.log(`- ${item.lang}: missing=${item.missing}, extra=${item.extra}`);
  }
}

if (parseErrors.length) {
  console.log("\\nParse errors:");
  for (const item of parseErrors) {
    console.log(`- ${item.lang}: ${item.error}`);
  }
}

console.log(`\\n✅ Updated: ${typesPath}`);
console.log(`🛟 Backup:  ${backupPath}`);
