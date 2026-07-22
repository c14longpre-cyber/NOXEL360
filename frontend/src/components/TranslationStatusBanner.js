import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useI18n } from "../useI18n";
import { useLanguage } from "../language/LanguageStore";
/**
 * TranslationStatusBanner
 * -----------------------
 * Bandeau discret qui apparaît en haut de page quand l'utilisateur a
 * choisi une langue dont l'UI n'est pas encore traduite. Invite les
 * locuteurs natifs à contribuer, sans bloquer l'expérience.
 *
 * Affiche automatiquement :
 *   - Le nom natif de la langue active (endonyme)
 *   - Un message en anglais (lingua franca) ET dans la langue active
 *     si disponible (sinon en anglais uniquement)
 *   - Un bouton "Dismiss" pour masquer pour la session
 */
export default function TranslationStatusBanner() {
    const { isFullyTranslated } = useI18n();
    const { currentLanguage } = useLanguage();
    const [dismissed, setDismissed] = useState(false);
    if (isFullyTranslated || dismissed)
        return null;
    return (_jsxs("div", { role: "status", "aria-live": "polite", style: {
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 16px",
            margin: "12px 16px",
            borderRadius: 12,
            border: "1px solid rgba(112,42,165,0.35)",
            background: "linear-gradient(90deg, rgba(112,42,165,0.12) 0%, rgba(60,222,106,0.08) 100%)",
            color: "white",
            fontSize: 13,
        }, children: [_jsx("span", { style: { fontSize: 18 }, children: "\uD83C\uDF10" }), _jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [_jsxs("div", { style: { fontWeight: 600 }, children: [currentLanguage.nativeLabel, " ", _jsx("span", { style: { opacity: 0.7, fontWeight: 400 }, children: "\u2014 translation in progress" })] }), _jsxs("div", { style: { opacity: 0.75, marginTop: 2 }, children: ["The interface is shown in English while a native-speaker translation is prepared.", " ", _jsx("a", { href: "https://github.com/", target: "_blank", rel: "noreferrer", style: { color: "rgb(60,222,106)", textDecoration: "underline" }, children: "Contribute a translation \u2192" })] })] }), _jsx("button", { type: "button", onClick: () => setDismissed(true), "aria-label": "Dismiss", style: {
                    border: "1px solid rgba(255,255,255,0.14)",
                    background: "transparent",
                    color: "white",
                    borderRadius: 8,
                    padding: "6px 10px",
                    cursor: "pointer",
                    fontSize: 12,
                }, children: "Dismiss" })] }));
}
