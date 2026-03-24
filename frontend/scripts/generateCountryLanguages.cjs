// frontend/scripts/generateCountryLanguages.js
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
        isOfficial: true // dans ce dataset, ce sont les langues du pays
      };
    });

    result.push({
      countryCode: countryCode.toUpperCase(),        // "CA", "US", "FR"...
      countryName: country.name,                     // "Canada"
      countryNativeName: country.native || country.name, // "Canada" ou nom natif
      languages: langs
    });
  }

  return result;
}

function main() {
  const data = generateCountryLanguages();

  // 🔥 On écrit directement dans le frontend
  const outPath = resolve(__dirname, "..", "src", "data", "countryLanguages.json");
  mkdirSync(dirname(outPath), { recursive: true });

  writeFileSync(outPath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`✅ countryLanguages.json généré (${data.length} pays) -> ${outPath}`);
}

main();
