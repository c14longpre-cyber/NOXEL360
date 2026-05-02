// C:\Users\Projet Noxel360\scripts\generateCountryLanguages.js
const { writeFileSync, mkdirSync } = require("fs");
const { resolve, dirname } = require("path");
const { countries, languages } = require("countries-list");

function generateCountryLanguages() {
  const result = [];

  for (const [countryCode, country] of Object.entries(countries)) {
    const langCodes = country.languages || [];

    const langs = langCodes.map((code) => {
      const lang = languages[code] || {};
      return {
        code,
        nameNative: lang.native || lang.name || code,
        nameEnglish: lang.name || lang.native || code,
        isOfficial: true
      };
    });

    result.push({
      countryCode,
      countryName: country.name,
      countryNativeName: country.native || country.name,
      languages: langs
    });
  }

  return result;
}

function main() {
  const data = generateCountryLanguages();

  // 🔥 IMPORTANT : on écrit dans le frontend, pas à la racine
  const outPath = resolve(
    __dirname,
    "frontend",
    "src",
    "data",
    "countryLanguages.json"
  );

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(data, null, 2), "utf-8");

  console.log(`✅ countryLanguages.json généré (${data.length} pays) -> ${outPath}`);
}

main();
