// src/components/LanguageModal.tsx
import React from "react";
import { useLanguage, LanguageCode } from "../i18n/LanguageContext";
import "./LanguageModal.css"; // optionnel, si tu as un css

type Props = {
  onClose: () => void;
};

const OPTIONS: { code: LanguageCode; label: string }[] = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "pt", label: "Português" },
  { code: "auto", label: "Auto" },
];

export default function LanguageModal({ onClose }: Props) {
  const { language, setLanguage } = useLanguage();

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    onClose();
  };

  return (
    <div className="language-modal-backdrop">
      <div className="language-modal-card">
        <h2>Choisir la langue de NOXEL360</h2>

        <div className="language-modal-list">
          {OPTIONS.map((opt) => (
            <button
              key={opt.code}
              onClick={() => handleSelect(opt.code)}
              className={
                "language-modal-item" +
                (language === opt.code ? " language-modal-item--active" : "")
              }
            >
              {opt.label}
            </button>
          ))}
        </div>

        <button
          className="language-modal-close"
          type="button"
          onClick={onClose}
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
