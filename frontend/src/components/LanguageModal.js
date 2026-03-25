import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLanguage } from "../i18n/LanguageContext";
import "./LanguageModal.css"; // optionnel, si tu as un css
const OPTIONS = [
    { code: "fr", label: "Français" },
    { code: "en", label: "English" },
    { code: "es", label: "Español" },
    { code: "pt", label: "Português" },
    { code: "auto", label: "Auto" },
];
export default function LanguageModal({ onClose }) {
    const { language, setLanguage } = useLanguage();
    const handleSelect = (code) => {
        setLanguage(code);
        onClose();
    };
    return (_jsx("div", { className: "language-modal-backdrop", children: _jsxs("div", { className: "language-modal-card", children: [_jsx("h2", { children: "Choisir la langue de NOXEL360" }), _jsx("div", { className: "language-modal-list", children: OPTIONS.map((opt) => (_jsx("button", { onClick: () => handleSelect(opt.code), className: "language-modal-item" +
                            (language === opt.code ? " language-modal-item--active" : ""), children: opt.label }, opt.code))) }), _jsx("button", { className: "language-modal-close", type: "button", onClick: onClose, children: "Fermer" })] }) }));
}
