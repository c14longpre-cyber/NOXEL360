# Contributing translations to NOXEL360

Thank you for helping make NOXEL360 accessible in your language. This
document explains **how to add or improve** a translation — including
special protocols for Indigenous and minority languages.

---

## Quick start (major languages)

1. Pick a language code from `frontend/src/i18n/data/iso_639-1.json`
2. Create `frontend/src/i18n/locales/XX.ts` where `XX` is the code
3. Copy the content of `en.ts` as a starting template
4. Translate each **value** (keep the **keys** unchanged)
5. Register your file in `frontend/src/i18n/translate.ts`:
   ```typescript
   XX: () => import("./locales/XX").then((m) => m.XX),
   ```
6. Add the code to `FULLY_TRANSLATED_CODES` in
   `frontend/src/i18n/languageCatalog.ts`
7. Open a pull request

The interface now automatically reloads your dictionary when someone
selects the language. No other code change needed.

---

## Respect protocols for Indigenous and minority languages

NOXEL360 aims to honor the languages of First Peoples and ancestral
communities. These languages deserve more care than a simple machine
translation.

### Who should translate

- **Only native speakers or community-approved translators** should
  contribute Indigenous-language translations.
- If you are not a speaker but want to help, please:
  - Reach out to language councils, tribal governments, or cultural
    organizations (examples: Inuit Tapiriit Kanatami, Navajo Language
    Academy, Te Taura Whiri i te Reo Māori, Maaya Network).
  - Do **not** use Google Translate, DeepL, or other automated tools
    for these languages — the output is frequently wrong and often
    offensive.

### Orthography and scripts

- Use the writing system and orthography **preferred by the community**,
  not necessarily the most common one online.
- Inuktitut may be written in syllabics (ᐃᓄᒃᑎᑐᑦ) or Latin
  (Inuktitut) depending on the region — ask which your community uses.
- Respect diacritics, tone marks, and non-standard characters. Test
  your file in the browser to confirm they render correctly.

### Endonyms (native names)

When you contribute a new language, also provide:

- The **endonym** (the name of the language in the language itself)
- Optionally the **name of the people** speaking it

Add these to `INDIGENOUS_SEEDS` in `languageCatalog.ts`:

```typescript
{
  code: "iu",
  label: "Inuktitut",
  nativeLabel: "ᐃᓄᒃᑎᑐᑦ",
  flag: "🇨🇦",
  family: "Eskimo–Aleut",
},
```

### Attribution

Your pull request should include, in a comment at the top of your
`XX.ts` file:

```typescript
/**
 * Translator: [Your name or pseudonym, if you wish]
 * Community: [Nation, council, or organization]
 * Reviewed by: [Optional — second native speaker who checked]
 * Date: YYYY-MM-DD
 */
```

We will add your attribution to a public `ATTRIBUTIONS.md` file so your
contribution is recognized.

### Dialects and variants

Many Indigenous languages have multiple dialects (Western vs Eastern
Inuktitut, Pikani vs Siksika Blackfoot, Quechua Cuzco vs Quechua Ayacucho).
If your translation reflects a specific variant, please say so in the
comment, and use an ISO 639-3 + region suffix if appropriate
(for example: `iu-CA-NU` for Inuktitut spoken in Nunavut).

---

## Review process

All translations — major or Indigenous — go through a review step:

1. Automated check: all keys from `en.ts` are present, no broken JSON
2. Human review: a maintainer or community contact confirms quality
3. Merge

Indigenous-language pull requests may require coordination with a
council or organization and can therefore take longer. This is normal
and expected — we would rather wait than publish a disrespectful
translation.

---

## Partial translations

It's fine to submit a partial translation (for example, just the common
strings and the language selector). The missing keys will automatically
fall back to English at runtime, and the code will be listed as
`partial` instead of `complete` in the interface. This is still
progress and is welcome.

---

## Questions

Open an issue tagged `i18n` or `indigenous-language` on the NOXEL360
repository. We will respond in English or French.

Merci. Miigwech. Thank you. ᓇᑯᕐᒦᒃ.
