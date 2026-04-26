/**
 * Métadonnées pays (ISO3, capital, devise, région, TLD) pour remplacer
 * la dépendance manquante à `world-countries`. Seuls les pays les plus
 * fréquemment consultés ont des entrées riches — les autres tombent sur
 * un objet vide, ce qui est sans danger (les champs s'affichent "—").
 *
 * Pour enrichir : ajouter d'autres ISO2 dans la table ci-dessous.
 */

export type CountryMetaRow = {
  iso3?: string;
  numeric?: string;
  capital?: string;
  domain?: string;
  currencyCode?: string;
  currencySymbol?: string;
  region?: string;
  subregion?: string;
};

export const COUNTRY_META_BY_ISO2: Record<string, CountryMetaRow> = {
  CA: { iso3: "CAN", numeric: "124", capital: "Ottawa", domain: ".ca", currencyCode: "CAD", currencySymbol: "$", region: "Americas", subregion: "Northern America" },
  US: { iso3: "USA", numeric: "840", capital: "Washington, D.C.", domain: ".us", currencyCode: "USD", currencySymbol: "$", region: "Americas", subregion: "Northern America" },
  MX: { iso3: "MEX", numeric: "484", capital: "Mexico City", domain: ".mx", currencyCode: "MXN", currencySymbol: "$", region: "Americas", subregion: "North America" },
  BR: { iso3: "BRA", numeric: "076", capital: "Brasília", domain: ".br", currencyCode: "BRL", currencySymbol: "R$", region: "Americas", subregion: "South America" },
  AR: { iso3: "ARG", numeric: "032", capital: "Buenos Aires", domain: ".ar", currencyCode: "ARS", currencySymbol: "$", region: "Americas", subregion: "South America" },
  CL: { iso3: "CHL", numeric: "152", capital: "Santiago", domain: ".cl", currencyCode: "CLP", currencySymbol: "$", region: "Americas", subregion: "South America" },
  CO: { iso3: "COL", numeric: "170", capital: "Bogotá", domain: ".co", currencyCode: "COP", currencySymbol: "$", region: "Americas", subregion: "South America" },
  PE: { iso3: "PER", numeric: "604", capital: "Lima", domain: ".pe", currencyCode: "PEN", currencySymbol: "S/.", region: "Americas", subregion: "South America" },

  FR: { iso3: "FRA", numeric: "250", capital: "Paris", domain: ".fr", currencyCode: "EUR", currencySymbol: "€", region: "Europe", subregion: "Western Europe" },
  DE: { iso3: "DEU", numeric: "276", capital: "Berlin", domain: ".de", currencyCode: "EUR", currencySymbol: "€", region: "Europe", subregion: "Western Europe" },
  ES: { iso3: "ESP", numeric: "724", capital: "Madrid", domain: ".es", currencyCode: "EUR", currencySymbol: "€", region: "Europe", subregion: "Southern Europe" },
  IT: { iso3: "ITA", numeric: "380", capital: "Rome", domain: ".it", currencyCode: "EUR", currencySymbol: "€", region: "Europe", subregion: "Southern Europe" },
  PT: { iso3: "PRT", numeric: "620", capital: "Lisbon", domain: ".pt", currencyCode: "EUR", currencySymbol: "€", region: "Europe", subregion: "Southern Europe" },
  NL: { iso3: "NLD", numeric: "528", capital: "Amsterdam", domain: ".nl", currencyCode: "EUR", currencySymbol: "€", region: "Europe", subregion: "Western Europe" },
  BE: { iso3: "BEL", numeric: "056", capital: "Brussels", domain: ".be", currencyCode: "EUR", currencySymbol: "€", region: "Europe", subregion: "Western Europe" },
  CH: { iso3: "CHE", numeric: "756", capital: "Bern", domain: ".ch", currencyCode: "CHF", currencySymbol: "Fr.", region: "Europe", subregion: "Western Europe" },
  AT: { iso3: "AUT", numeric: "040", capital: "Vienna", domain: ".at", currencyCode: "EUR", currencySymbol: "€", region: "Europe", subregion: "Western Europe" },
  GB: { iso3: "GBR", numeric: "826", capital: "London", domain: ".uk", currencyCode: "GBP", currencySymbol: "£", region: "Europe", subregion: "Northern Europe" },
  IE: { iso3: "IRL", numeric: "372", capital: "Dublin", domain: ".ie", currencyCode: "EUR", currencySymbol: "€", region: "Europe", subregion: "Northern Europe" },
  SE: { iso3: "SWE", numeric: "752", capital: "Stockholm", domain: ".se", currencyCode: "SEK", currencySymbol: "kr", region: "Europe", subregion: "Northern Europe" },
  NO: { iso3: "NOR", numeric: "578", capital: "Oslo", domain: ".no", currencyCode: "NOK", currencySymbol: "kr", region: "Europe", subregion: "Northern Europe" },
  DK: { iso3: "DNK", numeric: "208", capital: "Copenhagen", domain: ".dk", currencyCode: "DKK", currencySymbol: "kr", region: "Europe", subregion: "Northern Europe" },
  FI: { iso3: "FIN", numeric: "246", capital: "Helsinki", domain: ".fi", currencyCode: "EUR", currencySymbol: "€", region: "Europe", subregion: "Northern Europe" },
  IS: { iso3: "ISL", numeric: "352", capital: "Reykjavík", domain: ".is", currencyCode: "ISK", currencySymbol: "kr", region: "Europe", subregion: "Northern Europe" },
  PL: { iso3: "POL", numeric: "616", capital: "Warsaw", domain: ".pl", currencyCode: "PLN", currencySymbol: "zł", region: "Europe", subregion: "Eastern Europe" },
  CZ: { iso3: "CZE", numeric: "203", capital: "Prague", domain: ".cz", currencyCode: "CZK", currencySymbol: "Kč", region: "Europe", subregion: "Eastern Europe" },
  HU: { iso3: "HUN", numeric: "348", capital: "Budapest", domain: ".hu", currencyCode: "HUF", currencySymbol: "Ft", region: "Europe", subregion: "Eastern Europe" },
  RO: { iso3: "ROU", numeric: "642", capital: "Bucharest", domain: ".ro", currencyCode: "RON", currencySymbol: "lei", region: "Europe", subregion: "Eastern Europe" },
  GR: { iso3: "GRC", numeric: "300", capital: "Athens", domain: ".gr", currencyCode: "EUR", currencySymbol: "€", region: "Europe", subregion: "Southern Europe" },
  UA: { iso3: "UKR", numeric: "804", capital: "Kyiv", domain: ".ua", currencyCode: "UAH", currencySymbol: "₴", region: "Europe", subregion: "Eastern Europe" },
  RU: { iso3: "RUS", numeric: "643", capital: "Moscow", domain: ".ru", currencyCode: "RUB", currencySymbol: "₽", region: "Europe", subregion: "Eastern Europe" },

  CN: { iso3: "CHN", numeric: "156", capital: "Beijing", domain: ".cn", currencyCode: "CNY", currencySymbol: "¥", region: "Asia", subregion: "Eastern Asia" },
  JP: { iso3: "JPN", numeric: "392", capital: "Tokyo", domain: ".jp", currencyCode: "JPY", currencySymbol: "¥", region: "Asia", subregion: "Eastern Asia" },
  KR: { iso3: "KOR", numeric: "410", capital: "Seoul", domain: ".kr", currencyCode: "KRW", currencySymbol: "₩", region: "Asia", subregion: "Eastern Asia" },
  IN: { iso3: "IND", numeric: "356", capital: "New Delhi", domain: ".in", currencyCode: "INR", currencySymbol: "₹", region: "Asia", subregion: "Southern Asia" },
  ID: { iso3: "IDN", numeric: "360", capital: "Jakarta", domain: ".id", currencyCode: "IDR", currencySymbol: "Rp", region: "Asia", subregion: "South-Eastern Asia" },
  TH: { iso3: "THA", numeric: "764", capital: "Bangkok", domain: ".th", currencyCode: "THB", currencySymbol: "฿", region: "Asia", subregion: "South-Eastern Asia" },
  VN: { iso3: "VNM", numeric: "704", capital: "Hanoi", domain: ".vn", currencyCode: "VND", currencySymbol: "₫", region: "Asia", subregion: "South-Eastern Asia" },
  PH: { iso3: "PHL", numeric: "608", capital: "Manila", domain: ".ph", currencyCode: "PHP", currencySymbol: "₱", region: "Asia", subregion: "South-Eastern Asia" },
  MY: { iso3: "MYS", numeric: "458", capital: "Kuala Lumpur", domain: ".my", currencyCode: "MYR", currencySymbol: "RM", region: "Asia", subregion: "South-Eastern Asia" },
  SG: { iso3: "SGP", numeric: "702", capital: "Singapore", domain: ".sg", currencyCode: "SGD", currencySymbol: "$", region: "Asia", subregion: "South-Eastern Asia" },
  BD: { iso3: "BGD", numeric: "050", capital: "Dhaka", domain: ".bd", currencyCode: "BDT", currencySymbol: "৳", region: "Asia", subregion: "Southern Asia" },
  PK: { iso3: "PAK", numeric: "586", capital: "Islamabad", domain: ".pk", currencyCode: "PKR", currencySymbol: "₨", region: "Asia", subregion: "Southern Asia" },
  TR: { iso3: "TUR", numeric: "792", capital: "Ankara", domain: ".tr", currencyCode: "TRY", currencySymbol: "₺", region: "Asia", subregion: "Western Asia" },
  IR: { iso3: "IRN", numeric: "364", capital: "Tehran", domain: ".ir", currencyCode: "IRR", currencySymbol: "﷼", region: "Asia", subregion: "Southern Asia" },
  IL: { iso3: "ISR", numeric: "376", capital: "Jerusalem", domain: ".il", currencyCode: "ILS", currencySymbol: "₪", region: "Asia", subregion: "Western Asia" },
  SA: { iso3: "SAU", numeric: "682", capital: "Riyadh", domain: ".sa", currencyCode: "SAR", currencySymbol: "﷼", region: "Asia", subregion: "Western Asia" },
  AE: { iso3: "ARE", numeric: "784", capital: "Abu Dhabi", domain: ".ae", currencyCode: "AED", currencySymbol: "د.إ", region: "Asia", subregion: "Western Asia" },

  EG: { iso3: "EGY", numeric: "818", capital: "Cairo", domain: ".eg", currencyCode: "EGP", currencySymbol: "£", region: "Africa", subregion: "Northern Africa" },
  MA: { iso3: "MAR", numeric: "504", capital: "Rabat", domain: ".ma", currencyCode: "MAD", currencySymbol: "د.م.", region: "Africa", subregion: "Northern Africa" },
  DZ: { iso3: "DZA", numeric: "012", capital: "Algiers", domain: ".dz", currencyCode: "DZD", currencySymbol: "د.ج", region: "Africa", subregion: "Northern Africa" },
  TN: { iso3: "TUN", numeric: "788", capital: "Tunis", domain: ".tn", currencyCode: "TND", currencySymbol: "د.ت", region: "Africa", subregion: "Northern Africa" },
  ZA: { iso3: "ZAF", numeric: "710", capital: "Pretoria", domain: ".za", currencyCode: "ZAR", currencySymbol: "R", region: "Africa", subregion: "Southern Africa" },
  NG: { iso3: "NGA", numeric: "566", capital: "Abuja", domain: ".ng", currencyCode: "NGN", currencySymbol: "₦", region: "Africa", subregion: "Western Africa" },
  KE: { iso3: "KEN", numeric: "404", capital: "Nairobi", domain: ".ke", currencyCode: "KES", currencySymbol: "KSh", region: "Africa", subregion: "Eastern Africa" },
  ET: { iso3: "ETH", numeric: "231", capital: "Addis Ababa", domain: ".et", currencyCode: "ETB", currencySymbol: "Br", region: "Africa", subregion: "Eastern Africa" },
  SN: { iso3: "SEN", numeric: "686", capital: "Dakar", domain: ".sn", currencyCode: "XOF", currencySymbol: "CFA", region: "Africa", subregion: "Western Africa" },

  AU: { iso3: "AUS", numeric: "036", capital: "Canberra", domain: ".au", currencyCode: "AUD", currencySymbol: "$", region: "Oceania", subregion: "Australia and New Zealand" },
  NZ: { iso3: "NZL", numeric: "554", capital: "Wellington", domain: ".nz", currencyCode: "NZD", currencySymbol: "$", region: "Oceania", subregion: "Australia and New Zealand" },
};
