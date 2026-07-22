/**
 * Moteur de formatage NOXEL — basé sur Intl natif navigateur.
 *
 * Couvre :
 *   - Dates (court, moyen, long, personnalisé, avec timezone)
 *   - Temps relatif ("il y a 3 heures", "in 2 days")
 *   - Nombres (séparateurs locaux, pourcentages, scientifique)
 *   - Devises (avec override d'affichage : montrer CAD même en France)
 *   - Unités (km/mi, kg/lb, °C/°F, L/gal…)
 *   - Listes ("A, B and C" vs "A, B et C" vs "A、B、C")
 *   - Pluriels (règles CLDR : 1 item, 2 items, 5 items en russe…)
 *
 * Chaque fonction accepte `locale` + `region` et merge avec les
 * préférences utilisateur.
 */
/**
 * Construit le code BCP 47 combiné.
 * Fallback sur une locale reconnue par Intl si la langue est
 * autochtone et non supportée (ex: "iu" → "en-CA" pour le formatage,
 * mais on garde "iu" pour l'affichage de l'UI).
 */
export function buildLocaleTag(ctx) {
    const lang = ctx.language.toLowerCase();
    const region = ctx.region.code.toUpperCase();
    // Intl ne connaît pas "iu", "nv", "chr", etc. → on utilise la
    // langue coloniale / majoritaire du pays comme base de formatage
    // tout en gardant le code UI original ailleurs.
    const INTL_FALLBACK = {
        iu: "en", ike: "en", ikt: "en",
        cr: "en", oj: "en", moh: "en", mic: "en", ath: "en", bla: "en", crg: "en",
        nv: "en", chr: "en", lkt: "en", dak: "en", chy: "en", ypk: "en",
        nah: "es", yua: "es", quc: "es", mam: "es", arn: "es", yrl: "pt",
        haw: "en", sm: "en", to: "en", fj: "en", ty: "fr",
        se: "no", smj: "se", sma: "no", sms: "fi", smn: "fi",
        kw: "en", gv: "en", fy: "nl", rm: "de", fur: "it",
        sc: "it", scn: "it", vec: "it", co: "fr", oc: "fr", br: "fr",
        bo: "zh", ug: "zh", mn: "en", ckb: "ar", kmr: "tr", sat: "hi", ks: "hi",
        am: "en", om: "en", ti: "en", so: "en", ha: "en", ig: "en", yo: "en",
        zu: "en", xh: "en", st: "en", tn: "en", ts: "en", ve: "en",
        sw: "en", rw: "en", ln: "fr", wo: "fr", ber: "ar",
    };
    const effectiveLang = INTL_FALLBACK[lang] || lang;
    const calendar = ctx.preferences?.calendar;
    const numberingSystem = ctx.preferences?.numberingSystem;
    const extensions = [];
    if (calendar)
        extensions.push(`ca-${calendar}`);
    if (numberingSystem)
        extensions.push(`nu-${numberingSystem}`);
    const base = `${effectiveLang}-${region}`;
    return extensions.length > 0 ? `${base}-u-${extensions.join("-")}` : base;
}
/** Timezone effective (préférence > région). */
function effectiveTimezone(ctx) {
    return ctx.preferences?.timezone || ctx.region.timezone || undefined;
}
/** Format horaire effectif. */
function effective12h(ctx) {
    const pref = ctx.preferences?.timeFormat;
    if (pref === "12h")
        return true;
    if (pref === "24h")
        return false;
    return ctx.region.timeFormat === "12h";
}
/** Système de mesure effectif. */
export function effectiveMeasurementSystem(ctx) {
    return ctx.preferences?.measurementSystem || ctx.region.measurementSystem || "metric";
}
// ============================================================================
// DATES
// ============================================================================
export function formatDate(date, ctx, style = "medium") {
    const d = date instanceof Date ? date : new Date(date);
    return new Intl.DateTimeFormat(buildLocaleTag(ctx), {
        dateStyle: style,
        timeZone: effectiveTimezone(ctx),
    }).format(d);
}
export function formatTime(date, ctx, style = "short") {
    const d = date instanceof Date ? date : new Date(date);
    return new Intl.DateTimeFormat(buildLocaleTag(ctx), {
        timeStyle: style,
        hour12: effective12h(ctx),
        timeZone: effectiveTimezone(ctx),
    }).format(d);
}
export function formatDateTime(date, ctx, dateStyle = "medium", timeStyle = "short") {
    const d = date instanceof Date ? date : new Date(date);
    return new Intl.DateTimeFormat(buildLocaleTag(ctx), {
        dateStyle,
        timeStyle,
        hour12: effective12h(ctx),
        timeZone: effectiveTimezone(ctx),
    }).format(d);
}
export function formatDateCustom(date, ctx, options) {
    const d = date instanceof Date ? date : new Date(date);
    return new Intl.DateTimeFormat(buildLocaleTag(ctx), {
        timeZone: effectiveTimezone(ctx),
        ...options,
    }).format(d);
}
// ============================================================================
// TEMPS RELATIF
// ============================================================================
export function formatRelativeTime(value, unit, ctx, numeric = "auto") {
    return new Intl.RelativeTimeFormat(buildLocaleTag(ctx), {
        numeric,
    }).format(value, unit);
}
/**
 * Formatage intelligent : "il y a 5 min", "hier", "dans 2 heures".
 * Calcule automatiquement la meilleure unité.
 */
export function formatTimeAgo(date, ctx) {
    const d = date instanceof Date ? date : new Date(date);
    const diffMs = d.getTime() - Date.now();
    const absSec = Math.abs(diffMs) / 1000;
    const UNITS = [
        ["year", 60 * 60 * 24 * 365],
        ["month", 60 * 60 * 24 * 30],
        ["week", 60 * 60 * 24 * 7],
        ["day", 60 * 60 * 24],
        ["hour", 60 * 60],
        ["minute", 60],
        ["second", 1],
    ];
    for (const [unit, sec] of UNITS) {
        if (absSec >= sec || unit === "second") {
            const value = Math.round(diffMs / 1000 / sec);
            return formatRelativeTime(value, unit, ctx);
        }
    }
    return formatDate(d, ctx);
}
// ============================================================================
// NOMBRES
// ============================================================================
export function formatNumber(value, ctx, options) {
    return new Intl.NumberFormat(buildLocaleTag(ctx), options).format(value);
}
export function formatPercent(value, ctx, fractionDigits = 1) {
    return new Intl.NumberFormat(buildLocaleTag(ctx), {
        style: "percent",
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    }).format(value);
}
export function formatCompact(value, ctx) {
    return new Intl.NumberFormat(buildLocaleTag(ctx), {
        notation: "compact",
        compactDisplay: "short",
    }).format(value);
}
// ============================================================================
// DEVISES
// ============================================================================
/**
 * Formate une devise. Si aucune devise n'est passée, utilise la devise
 * de la région active (ou l'override utilisateur).
 */
export function formatCurrency(value, ctx, currency) {
    const code = currency ||
        ctx.preferences?.preferredCurrency ||
        ctx.region.currencyCode ||
        "USD";
    return new Intl.NumberFormat(buildLocaleTag(ctx), {
        style: "currency",
        currency: code,
    }).format(value);
}
function convertDistanceToMeters(input) {
    if ("meters" in input)
        return input.meters;
    if ("km" in input)
        return input.km * 1000;
    return input.miles * 1609.344;
}
export function formatDistance(input, ctx, opts) {
    const meters = convertDistanceToMeters(input);
    const system = effectiveMeasurementSystem(ctx);
    const locale = buildLocaleTag(ctx);
    let value;
    let unit;
    const chosen = opts?.unit || "auto";
    if (chosen === "auto") {
        if (system === "imperial") {
            if (meters < 304.8) {
                // < 1000 ft → feet
                value = meters / 0.3048;
                unit = "foot";
            }
            else {
                value = meters / 1609.344;
                unit = "mile";
            }
        }
        else {
            if (meters < 1000) {
                value = meters;
                unit = "meter";
            }
            else {
                value = meters / 1000;
                unit = "kilometer";
            }
        }
    }
    else if (chosen === "meters") {
        value = meters;
        unit = "meter";
    }
    else if (chosen === "kilometers") {
        value = meters / 1000;
        unit = "kilometer";
    }
    else if (chosen === "miles") {
        value = meters / 1609.344;
        unit = "mile";
    }
    else {
        value = meters / 0.3048;
        unit = "foot";
    }
    return new Intl.NumberFormat(locale, {
        style: "unit",
        unit,
        unitDisplay: "short",
        maximumFractionDigits: value >= 10 ? 0 : 1,
    }).format(value);
}
export function formatTemperature(input, ctx) {
    const system = effectiveMeasurementSystem(ctx);
    const celsius = "celsius" in input ? input.celsius : (input.fahrenheit - 32) * (5 / 9);
    const locale = buildLocaleTag(ctx);
    if (system === "imperial") {
        const f = celsius * (9 / 5) + 32;
        return new Intl.NumberFormat(locale, {
            style: "unit",
            unit: "fahrenheit",
            unitDisplay: "short",
            maximumFractionDigits: 0,
        }).format(f);
    }
    return new Intl.NumberFormat(locale, {
        style: "unit",
        unit: "celsius",
        unitDisplay: "short",
        maximumFractionDigits: 0,
    }).format(celsius);
}
export function formatMass(input, ctx) {
    const system = effectiveMeasurementSystem(ctx);
    const locale = buildLocaleTag(ctx);
    const grams = "kg" in input ? input.kg * 1000 :
        "g" in input ? input.g :
            input.pounds * 453.592;
    let value;
    let unit;
    if (system === "imperial") {
        value = grams / 453.592;
        unit = "pound";
    }
    else if (grams < 1000) {
        value = grams;
        unit = "gram";
    }
    else {
        value = grams / 1000;
        unit = "kilogram";
    }
    return new Intl.NumberFormat(locale, {
        style: "unit",
        unit,
        unitDisplay: "short",
        maximumFractionDigits: value >= 10 ? 0 : 1,
    }).format(value);
}
export function formatVolume(input, ctx) {
    const system = effectiveMeasurementSystem(ctx);
    const locale = buildLocaleTag(ctx);
    const ml = "liters" in input ? input.liters * 1000 :
        "ml" in input ? input.ml :
            input.gallons * 3785.41;
    let value;
    let unit;
    if (system === "imperial") {
        value = ml / 3785.41;
        unit = "gallon";
    }
    else if (ml < 1000) {
        value = ml;
        unit = "milliliter";
    }
    else {
        value = ml / 1000;
        unit = "liter";
    }
    return new Intl.NumberFormat(locale, {
        style: "unit",
        unit,
        unitDisplay: "short",
        maximumFractionDigits: value >= 10 ? 0 : 1,
    }).format(value);
}
// ============================================================================
// LISTES
// ============================================================================
export function formatList(items, ctx, style = "long", type = "conjunction") {
    return new Intl.ListFormat(buildLocaleTag(ctx), {
        style,
        type,
    }).format(items);
}
// ============================================================================
// PLURIELS
// ============================================================================
export function pluralRule(count, ctx, type = "cardinal") {
    return new Intl.PluralRules(buildLocaleTag(ctx), { type }).select(count);
}
/**
 * Helper : choisir une traduction selon le pluriel.
 *   plural(count, ctx, { one: "1 item", other: "{n} items" })
 */
export function plural(count, ctx, forms, replace = "{n}") {
    const rule = pluralRule(count, ctx);
    const template = forms[rule] || forms.other || "";
    return template.replace(replace, String(count));
}
