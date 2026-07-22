import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from "react";
import worldSvgRaw from "./world-combined-clean.svg?raw";
import { COUNTRY_DATA } from "./countryData";
import { getCountryMetaByISO2 } from "./getCountryMeta";
import { resolveBestLanguage } from "./resolveLanguage";
import { useI18n } from "../../useI18n";
const LANGUAGE_BY_ISO2 = {
    US: "en",
    CA: "en",
    GB: "en",
    AU: "en",
    NZ: "en",
    IE: "en",
    SE: "sv",
    NO: "no",
    DK: "da",
    FI: "fi",
    IS: "sv",
    PL: "pl",
    CZ: "cs",
    SK: "cs",
    HU: "hu",
    RO: "ro",
    BG: "ro",
    GR: "el",
    UA: "uk",
    RS: "en",
    HR: "en",
    SI: "en",
    BA: "en",
    MK: "en",
    AL: "en",
    LT: "en",
    LV: "en",
    EE: "en",
    IN: "hi",
    PK: "en",
    BD: "bn",
    ID: "id",
    TH: "th",
    VN: "vi",
    PH: "en",
    KR: "ko",
    MY: "ms",
    ZA: "en",
    NG: "en",
    KE: "en",
    GH: "en",
    TZ: "en",
    UG: "en",
    ET: "en",
    RU: "ru",
    KZ: "ru",
    UZ: "ru",
    TM: "ru",
    KG: "ru",
    TJ: "ru",
    IR: "fa",
    IL: "he",
    TR: "tr",
    AF: "fa",
    NP: "en",
    LK: "en",
    FR: "fr",
    BE: "fr",
    CH: "fr",
    LU: "fr",
    MC: "fr",
    SN: "fr",
    CI: "fr",
    CM: "fr",
    CD: "fr",
    CG: "fr",
    GA: "fr",
    TG: "fr",
    BJ: "fr",
    ML: "fr",
    NE: "fr",
    BF: "fr",
    RW: "fr",
    BI: "fr",
    CF: "fr",
    TD: "fr",
    ES: "es",
    MX: "es",
    AR: "es",
    CO: "es",
    CL: "es",
    PE: "es",
    VE: "es",
    UY: "es",
    PY: "es",
    BO: "es",
    EC: "es",
    CR: "es",
    PA: "es",
    DO: "es",
    GT: "es",
    HN: "es",
    NI: "es",
    SV: "es",
    DE: "de",
    AT: "de",
    IT: "it",
    PT: "pt",
    BR: "pt",
    AO: "pt",
    MZ: "pt",
    NL: "nl",
    JP: "ja",
    CN: "zh",
    TW: "zh",
    SG: "zh",
    SA: "ar",
    AE: "ar",
    EG: "ar",
    DZ: "ar",
    MA: "ar",
    SD: "ar",
    IQ: "ar",
    JO: "ar",
    KW: "ar",
    LB: "ar",
    LY: "ar",
    OM: "ar",
    QA: "ar",
    SY: "ar",
    TN: "ar",
    YE: "ar",
};
function normalizeIso(raw) {
    if (!raw)
        return null;
    const clean = raw.trim().toLowerCase().replace(/^_+/, "");
    if (!/^[a-z]{2,3}$/.test(clean))
        return null;
    return clean.toUpperCase();
}
function findIsoFromElement(el) {
    let node = el;
    while (node) {
        const iso = normalizeIso(node.getAttribute("data-country-iso")) ||
            normalizeIso(node.getAttribute("data-iso")) ||
            normalizeIso(node.getAttribute("data-iso2")) ||
            normalizeIso(node.id);
        if (iso)
            return iso;
        node = node.parentElement;
    }
    return null;
}
export default function NexusLanguageMap({ currentLanguage, onSelectLanguage, }) {
    const { t } = useI18n();
    const [selectedIso, setSelectedIso] = useState("CA");
    const [hoveredIso, setHoveredIso] = useState(null);
    const [tooltip, setTooltip] = useState({
        visible: false,
        x: 0,
        y: 0,
        iso: null,
    });
    const mapHostRef = useRef(null);
    const countryByIso2 = useMemo(() => {
        const map = new Map();
        Object.values(COUNTRY_DATA).forEach((row) => {
            if (!row.iso2)
                return;
            map.set(row.iso2.toUpperCase(), {
                iso2: row.iso2,
                name: row.name,
                iso3: row.iso3,
                isoNumeric: row.isoNumeric,
                capital: row.capital,
                currency: row.currency,
                domain: row.domain,
                region: row.region,
                subregion: row.subregion,
                flag: row.flag,
                officialLanguages: row.officialLanguages,
                indigenousLanguages: row.indigenousLanguages,
            });
        });
        return map;
    }, []);
    const selectedCountry = countryByIso2.get(selectedIso) || null;
    const selectedMeta = getCountryMetaByISO2(selectedIso);
    const hoveredCountry = tooltip.iso ? countryByIso2.get(tooltip.iso) || null : null;
    useEffect(() => {
        const host = mapHostRef.current;
        if (!host)
            return;
        const svg = host.querySelector("svg");
        const countriesGroup = host.querySelector("#countries");
        if (!svg || !countriesGroup)
            return;
        const countryNodes = Array.from(countriesGroup.querySelectorAll("g, path, polygon, circle, ellipse, rect, use"));
        for (const node of countryNodes) {
            const iso = findIsoFromElement(node);
            if (iso) {
                node.setAttribute("data-country-iso", iso);
                node.style.cursor = "pointer";
                node.style.pointerEvents = "auto";
            }
        }
        const paintables = Array.from(countriesGroup.querySelectorAll("[data-country-iso]"));
        for (const node of paintables) {
            const iso = node.getAttribute("data-country-iso");
            if (!iso)
                continue;
            const isSelected = iso === selectedIso;
            const isHovered = iso === hoveredIso;
            node.style.transition =
                "fill 0.18s ease, opacity 0.18s ease, stroke 0.18s ease, filter 0.18s ease";
            node.style.pointerEvents = "auto";
            if (isSelected) {
                node.style.fill = "#3CDE6A";
                node.style.stroke = "#702AA5";
                node.style.strokeWidth = "1.2";
                node.style.opacity = "1";
                node.style.filter = "drop-shadow(0 0 4px rgba(60,222,106,0.55))";
            }
            else if (isHovered) {
                node.style.fill = "#8ae7a8";
                node.style.stroke = "#702AA5";
                node.style.strokeWidth = "0.9";
                node.style.opacity = "1";
                node.style.filter = "drop-shadow(0 0 3px rgba(138,231,168,0.45))";
            }
            else {
                node.style.fill = "#9BD5C1";
                node.style.stroke = "#0477BE";
                node.style.strokeWidth = "0.5";
                node.style.opacity = "0.95";
                node.style.filter = "none";
            }
        }
    }, [selectedIso, hoveredIso]);
    function resolveAndApplyLanguage(countryIso) {
        const resolved = resolveBestLanguage(countryIso, undefined, navigator.languages, LANGUAGE_BY_ISO2[countryIso] || "en");
        const finalLanguage = (resolved ||
            LANGUAGE_BY_ISO2[countryIso] ||
            "en");
        onSelectLanguage(finalLanguage);
    }
    function handleSvgClick(event) {
        const target = event.target;
        const iso = findIsoFromElement(target);
        if (!iso)
            return;
        setSelectedIso(iso);
    }
    function handleSvgMouseMove(event) {
        const target = event.target;
        const iso = findIsoFromElement(target);
        setHoveredIso(iso);
        if (!iso || !mapHostRef.current) {
            setTooltip((prev) => ({ ...prev, visible: false, iso: null }));
            return;
        }
        const rect = mapHostRef.current.getBoundingClientRect();
        setTooltip({
            visible: true,
            x: event.clientX - rect.left + 12,
            y: event.clientY - rect.top + 12,
            iso,
        });
    }
    function handleSvgMouseLeave() {
        setHoveredIso(null);
        setTooltip((prev) => ({ ...prev, visible: false, iso: null }));
    }
    function applySelectedCountryLanguage() {
        resolveAndApplyLanguage(selectedIso);
    }
    return (_jsxs("div", { style: {
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.35fr) minmax(320px, 0.65fr)",
            gap: 16,
        }, children: [_jsxs("div", { style: {
                    position: "relative",
                    borderRadius: 20,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.03)",
                    overflow: "hidden",
                    minHeight: 420,
                    padding: 8,
                }, children: [_jsx("div", { ref: mapHostRef, onClick: handleSvgClick, onMouseMove: handleSvgMouseMove, onMouseLeave: handleSvgMouseLeave, dangerouslySetInnerHTML: { __html: worldSvgRaw } }), tooltip.visible && tooltip.iso && (_jsxs("div", { style: {
                            position: "absolute",
                            left: tooltip.x,
                            top: tooltip.y,
                            zIndex: 20,
                            pointerEvents: "none",
                            background: "rgba(10,12,18,0.94)",
                            color: "white",
                            border: "1px solid rgba(255,255,255,0.14)",
                            borderRadius: 12,
                            padding: "8px 10px",
                            fontSize: 12,
                            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                            maxWidth: 220,
                        }, children: [_jsx("div", { style: { fontWeight: 700 }, children: hoveredCountry?.name || tooltip.iso }), _jsx("div", { style: { opacity: 0.75 }, children: tooltip.iso })] }))] }), _jsxs("aside", { style: {
                    borderRadius: 20,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.04)",
                    padding: 16,
                    color: "white",
                }, children: [_jsx("div", { style: {
                            fontSize: 12,
                            opacity: 0.72,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                        }, children: t("language.selector.title") }), _jsx("h3", { style: { margin: "8px 0 12px", fontSize: 22 }, children: selectedCountry?.name || selectedMeta?.iso2 || t("language.selector.selectCountry") }), selectedCountry?.flag ? (_jsx("img", { src: selectedCountry.flag, alt: selectedCountry.name, style: {
                            width: 56,
                            height: 38,
                            objectFit: "cover",
                            borderRadius: 8,
                            marginBottom: 12,
                            border: "1px solid rgba(255,255,255,0.12)",
                        } })) : null, _jsxs("div", { style: { display: "grid", gap: 8, fontSize: 14 }, children: [_jsxs("div", { children: [_jsx("strong", { children: "ISO2:" }), " ", selectedIso || "—"] }), _jsxs("div", { children: [_jsx("strong", { children: "ISO3:" }), " ", selectedCountry?.iso3 || selectedMeta?.iso3 || "—"] }), _jsxs("div", { children: [_jsxs("strong", { children: [t("language.selector.capital"), ":"] }), " ", selectedCountry?.capital || selectedMeta?.capital || "—"] }), _jsxs("div", { children: [_jsxs("strong", { children: [t("language.selector.region"), ":"] }), " ", selectedCountry?.region || "—"] }), _jsxs("div", { children: [_jsxs("strong", { children: [t("language.selector.subregion"), ":"] }), " ", selectedCountry?.subregion || "—"] }), _jsxs("div", { children: [_jsxs("strong", { children: [t("language.selector.domain"), ":"] }), " ", selectedCountry?.domain || selectedMeta?.domain || "—"] }), _jsxs("div", { children: [_jsxs("strong", { children: [t("language.selector.currency"), ":"] }), " ", selectedCountry?.currency || selectedMeta?.currencyCode || "—"] }), _jsxs("div", { children: [_jsxs("strong", { children: [t("language.selector.officialLanguages"), ":"] }), " ", selectedCountry?.officialLanguages?.join(", ") || "—"] }), _jsxs("div", { children: [_jsxs("strong", { children: [t("language.selector.indigenousLanguages"), ":"] }), " ", selectedCountry?.indigenousLanguages?.join(", ") || "—"] }), _jsxs("div", { children: [_jsxs("strong", { children: [t("language.selector.mappedLanguage"), ":"] }), " ", LANGUAGE_BY_ISO2[selectedIso] || "not mapped yet"] })] }), _jsx("div", { style: { marginTop: 16 }, children: _jsx("button", { type: "button", onClick: applySelectedCountryLanguage, style: {
                                borderRadius: 999,
                                padding: "10px 14px",
                                border: "1px solid rgba(60,222,106,0.9)",
                                background: "rgba(60,222,106,0.14)",
                                color: "white",
                                cursor: "pointer",
                            }, children: t("language.selector.apply") }) }), _jsxs("p", { style: { marginTop: 16, fontSize: 12, opacity: 0.65 }, children: [t("language.selector.current"), ": ", currentLanguage.toUpperCase()] })] })] }));
}
