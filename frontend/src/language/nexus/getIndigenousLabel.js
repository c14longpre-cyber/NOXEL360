import { INDIGENOUS_BY_ISO2 } from "./indigenous";
export function getIndigenousLanguagesLabel(iso2) {
    if (!iso2)
        return "—";
    const key = iso2.toUpperCase();
    const nations = INDIGENOUS_BY_ISO2[key];
    if (!nations || nations.length === 0)
        return "—";
    const langs = nations
        .flatMap((n) => n.languages ?? [])
        .map((l) => (l.endonym ? `${l.label} (${l.endonym})` : l.label));
    // dédoublonnage simple
    const unique = Array.from(new Set(langs));
    return unique.length ? unique.join(", ") : "—";
}
