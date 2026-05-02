export type IndigenousLanguage = {
  code?: string;     // ex: "iu" / "nv" / "mi" (optionnel)
  label: string;     // ex: "Inuktitut"
  endonym?: string;  // ex: "ᐃᓄᒃᑎᑐᑦ"
};

export type IndigenousNation = {
  id: string;        // unique
  name: string;      // ex: "Inuit"
  endonym?: string;  // ex: "ᐃᓄᐃᑦ"
  languages?: IndigenousLanguage[];
  notes?: string;    // optionnel (ultra court)
};

export type IndigenousByISO2 = Record<string, IndigenousNation[]>;

/**
 * IMPORTANT:
 * - C’est une “seed list” (exemples) pour que le UI fonctionne partout.
 * - Tu ajoutes au fur et à mesure. Format simple + stable.
 * - Les clés sont ISO2 en MAJUSCULE.
 */
export const INDIGENOUS_BY_ISO2: IndigenousByISO2 = {

  // ===== North America =====
  CA: [
    {
      id: "ca-inuit",
      name: "Inuit",
      endonym: "ᐃᓄᐃᑦ",
      languages: [
        { code: "iu", label: "Inuktitut", endonym: "ᐃᓄᒃᑎᑐᑦ" },
        { label: "Inuinnaqtun" },
      ],
    },
    {
      id: "ca-cree",
      name: "Cree",
      languages: [{ label: "Cree", endonym: "Nēhiyawēwin" }],
    },
    {
      id: "ca-anishinaabe",
      name: "Anishinaabe",
      languages: [{ label: "Ojibwe", endonym: "Anishinaabemowin" }],
    },
    {
      id: "ca-haudenosaunee",
      name: "Haudenosaunee",
      languages: [{ label: "Mohawk", endonym: "Kanien’kéha" }],
    },
  ],

  US: [
    {
      id: "us-navajo",
      name: "Navajo Nation",
      endonym: "Diné",
      languages: [{ code: "nv", label: "Navajo", endonym: "Diné bizaad" }],
    },
    {
      id: "us-cherokee",
      name: "Cherokee",
      languages: [{ label: "Cherokee", endonym: "ᏣᎳᎩ" }],
    },
    {
      id: "us-lakota",
      name: "Lakota",
      languages: [{ label: "Lakota", endonym: "Lakȟótiyapi" }],
    },
  ],

  MX: [
    { id: "mx-nahua", name: "Nahua", languages: [{ label: "Nahuatl", endonym: "Nāhuatl" }] },
    { id: "mx-maya", name: "Maya", languages: [{ label: "Yucatec Maya", endonym: "Maaya t’aan" }] },
    { id: "mx-mixtec", name: "Mixtec", languages: [{ label: "Mixtec", endonym: "Tu’un Savi" }] },
  ],

  // ===== South America =====
  BR: [
    { id: "br-guarani", name: "Guarani", languages: [{ label: "Guarani", endonym: "Avañe’ẽ" }] },
    { id: "br-yanomami", name: "Yanomami", languages: [{ label: "Yanomami" }] },
  ],
  PE: [
    { id: "pe-quechua", name: "Quechua peoples", languages: [{ label: "Quechua", endonym: "Runa Simi" }] },
    { id: "pe-aymara", name: "Aymara", languages: [{ label: "Aymara", endonym: "Aymar aru" }] },
  ],

  // ===== Oceania =====
  AU: [
    { id: "au-aboriginal", name: "Aboriginal and Torres Strait Islander peoples", notes: "Multiple nations & languages." },
    { id: "au-pitjantjatjara", name: "Pitjantjatjara", languages: [{ label: "Pitjantjatjara" }] },
  ],
  NZ: [
    { id: "nz-maori", name: "Māori", endonym: "Māori", languages: [{ code: "mi", label: "Māori", endonym: "Te Reo Māori" }] },
  ],

  // ===== Europe =====
  NO: [
    { id: "no-sami", name: "Sámi", endonym: "Sámit", languages: [{ label: "Northern Sámi", endonym: "Davvisámegiella" }] },
  ],
  FI: [
    { id: "fi-sami", name: "Sámi", endonym: "Sámit", languages: [{ label: "Northern Sámi", endonym: "Davvisámegiella" }] },
  ],

  // ===== Africa =====
  ET: [
    { id: "et-oromo", name: "Oromo", languages: [{ label: "Afaan Oromo" }] },
    { id: "et-amhara", name: "Amhara", languages: [{ label: "Amharic", endonym: "አማርኛ" }] },
  ],
  KE: [
    { id: "ke-maasai", name: "Maasai", languages: [{ label: "Maa" }] },
    { id: "ke-swahili", name: "Swahili", languages: [{ code: "sw", label: "Swahili", endonym: "Kiswahili" }] },
  ],

  // ===== Asia =====
  CN: [
    { id: "cn-tibetan", name: "Tibetan", languages: [{ label: "Tibetan", endonym: "བོད་སྐད་" }] },
    { id: "cn-uyghur", name: "Uyghur", languages: [{ label: "Uyghur", endonym: "ئۇيغۇرچە" }] },
  ],
  IN: [
    { id: "in-santali", name: "Santali", languages: [{ label: "Santali", endonym: "ᱥᱟᱱᱛᱟᱲᱤ" }] },
    { id: "in-kashmiri", name: "Kashmiri", languages: [{ label: "Kashmiri", endonym: "कॉशुर / کٲشُر" }] },
  ],
};
    


