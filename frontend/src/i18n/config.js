// 🌐 Toutes les langues supportées (coloniales + autochtones, version simplifiée)
export const SUPPORTED_LANGUAGES = [
    // 🌎 Amérique du Nord — coloniales
    { code: "en-US", label: "English (US)", region: "americas" },
    { code: "fr-CA", label: "Français (Canada)", region: "americas" },
    { code: "es-US", label: "Español (US)", region: "americas" },
    // 🌎 Amérique du Nord — autochtones
    { code: "ike", label: "Inuktitut", region: "americas-indigenous" },
    { code: "cre", label: "Cree", region: "americas-indigenous" },
    { code: "oji", label: "Ojibwe", region: "americas-indigenous" },
    { code: "nav", label: "Navajo", region: "americas-indigenous" },
    { code: "apm", label: "Apache", region: "americas-indigenous" },
    { code: "ypk", label: "Yupik", region: "americas-indigenous" },
    // 🌎 Amérique latine — coloniales
    { code: "es-MX", label: "Español (LatAm)", region: "americas" },
    { code: "pt-BR", label: "Português (Brasil)", region: "americas" },
    { code: "fr-GF", label: "Français (Guyane)", region: "americas" },
    // 🌎 Amérique latine — autochtones
    { code: "qu", label: "Quechua", region: "americas-indigenous" },
    { code: "gn", label: "Guarani", region: "americas-indigenous" },
    { code: "ay", label: "Aymara", region: "americas-indigenous" },
    { code: "nah", label: "Nahuatl", region: "americas-indigenous" },
    { code: "yua", label: "Maya Yucatec", region: "americas-indigenous" },
    // 🌍 Europe — principales
    { code: "fr-FR", label: "Français (France)", region: "europe" },
    { code: "en-GB", label: "English (UK)", region: "europe" },
    { code: "es-ES", label: "Español (España)", region: "europe" },
    { code: "de-DE", label: "Deutsch", region: "europe" },
    { code: "it-IT", label: "Italiano", region: "europe" },
    { code: "pt-PT", label: "Português (Portugal)", region: "europe" },
    { code: "nl-NL", label: "Nederlands", region: "europe" },
    // 🌍 Europe — autochtones / minoritaires
    { code: "eu", label: "Euskara (Basque)", region: "europe-indigenous" },
    { code: "br", label: "Breton", region: "europe-indigenous" },
    { code: "ga", label: "Gaélique irlandais", region: "europe-indigenous" },
    { code: "gd", label: "Gaélique écossais", region: "europe-indigenous" },
    { code: "mt", label: "Maltais", region: "europe" },
    // 🌍 Afrique — coloniales
    { code: "fr-AF", label: "Français (Afrique)", region: "africa" },
    { code: "en-AF", label: "English (Africa)", region: "africa" },
    { code: "pt-AO", label: "Português (Angola)", region: "africa" },
    // 🌍 Afrique — autochtones
    { code: "sw", label: "Swahili", region: "africa-indigenous" },
    { code: "ha", label: "Hausa", region: "africa-indigenous" },
    { code: "yo", label: "Yoruba", region: "africa-indigenous" },
    { code: "zu", label: "Zulu", region: "africa-indigenous" },
    { code: "am", label: "Amharic", region: "africa-indigenous" },
    { code: "wo", label: "Wolof", region: "africa-indigenous" },
    { code: "ln", label: "Lingala", region: "africa-indigenous" },
    { code: "ber", label: "Berbère / Amazigh", region: "africa-indigenous" },
    // 🌏 Asie — principales
    { code: "zh-CN", label: "Mandarin", region: "asia" },
    { code: "ja-JP", label: "Japonais", region: "asia" },
    { code: "ko-KR", label: "Coréen", region: "asia" },
    { code: "hi-IN", label: "Hindi", region: "asia" },
    { code: "ar-SA", label: "Arabe", region: "middle-east" },
    // 🌏 Asie — autochtones / régionales
    { code: "ta", label: "Tamoul", region: "asia-indigenous" },
    { code: "te", label: "Télougou", region: "asia-indigenous" },
    { code: "vi", label: "Vietnamien", region: "asia-indigenous" },
    { code: "km", label: "Khmer", region: "asia-indigenous" },
    { code: "tl", label: "Tagalog", region: "asia-indigenous" },
    // 🌊 Océanie — autochtones
    { code: "mi", label: "Māori", region: "oceania-indigenous" },
    { code: "sm", label: "Samoan", region: "oceania-indigenous" },
    { code: "aus", label: "Langues aborigènes (AU)", region: "oceania-indigenous" },
];
// Pour le futur pop-up par continent
export const REGIONS = [
    { id: "americas", label: "Amériques" },
    { id: "europe", label: "Europe" },
    { id: "africa", label: "Afrique" },
    { id: "asia", label: "Asie" },
    { id: "middle-east", label: "Moyen-Orient" },
    { id: "oceania-indigenous", label: "Océanie" },
];
