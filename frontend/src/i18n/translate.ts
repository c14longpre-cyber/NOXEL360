import type { TranslationDictionary } from "./types";
import { en } from "./locales/en";

const AVAILABLE_DICT_LOADERS: Record<string, () => Promise<TranslationDictionary>> = {
  fr: () => import("./locales/fr").then((m) => m.fr),
  es: () => import("./locales/es").then((m) => m.es),
  de: () => import("./locales/de").then((m) => m.de),
  it: () => import("./locales/it").then((m) => m.it),
  pt: () => import("./locales/pt").then((m) => m.pt),
  zh: () => import("./locales/zh").then((m) => m.zh),
  ar: () => import("./locales/ar").then((m) => m.ar),
  hi: () => import("./locales/hi").then((m) => m.hi),
  ru: () => import("./locales/ru").then((m) => m.ru),
  ja: () => import("./locales/ja").then((m) => m.ja),
  ko: () => import("./locales/ko").then((m) => m.ko),
  tr: () => import("./locales/tr").then((m) => m.tr),
  nl: () => import("./locales/nl").then((m) => m.nl),
  pl: () => import("./locales/pl").then((m) => m.pl),
  sv: () => import("./locales/sv").then((m) => m.sv),
  da: () => import("./locales/da").then((m) => m.da),
  fi: () => import("./locales/fi").then((m) => m.fi),
  no: () => import("./locales/no").then((m) => m.no),
  cs: () => import("./locales/cs").then((m) => m.cs),
  hu: () => import("./locales/hu").then((m) => m.hu),
  ro: () => import("./locales/ro").then((m) => m.ro),
  uk: () => import("./locales/uk").then((m) => m.uk),
  id: () => import("./locales/id").then((m) => m.id),
  vi: () => import("./locales/vi").then((m) => m.vi),
  th: () => import("./locales/th").then((m) => m.th),
};

export const DEFAULT_LANGUAGE = "en";

const cache: Map<string, TranslationDictionary> = new Map();
cache.set("en", en);

const inflight: Map<string, Promise<TranslationDictionary>> = new Map();

export function getCachedDictionary(code: string): TranslationDictionary | null {
  return cache.get(code.toLowerCase()) ?? null;
}

export async function loadDictionary(code: string): Promise<TranslationDictionary> {
  const lower = code.toLowerCase();

  const cached = cache.get(lower);
  if (cached) return cached;

  const pending = inflight.get(lower);
  if (pending) return pending;

  const loader = AVAILABLE_DICT_LOADERS[lower];
  if (!loader) {
    cache.set(lower, en);
    return en;
  }

  const promise = (async () => {
    try {
      const dict = await loader();
      cache.set(lower, dict);
      return dict;
    } catch (err) {
      console.warn(`[i18n] Failed to load dictionary "${lower}"`, err);
      cache.set(lower, en);
      return en;
    } finally {
      inflight.delete(lower);
    }
  })();

  inflight.set(lower, promise);
  return promise;
}

export async function preloadDictionaries(codes: string[]): Promise<void> {
  await Promise.all(codes.map((code) => loadDictionary(code)));
}

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;

  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = params[key];
    return value === undefined || value === null ? `{${key}}` : String(value);
  });
}

export function translateSync(
  language: string,
  key: string,
  params?: Record<string, string | number>,
  fallback?: string
): string {
  const dict = cache.get(language.toLowerCase()) || en;
  const value = dict[key] ?? en[key] ?? fallback ?? key;
  return interpolate(value, params);
}

export function hasTranslation(language: string, key: string): boolean {
  const dict = cache.get(language.toLowerCase());
  return Boolean(dict?.[key]);
}

