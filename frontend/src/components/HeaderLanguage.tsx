import { useState } from "react";
import LanguageModal from "./LanguageModal";
import { useLanguage } from "../language/LanguageStore";
import { useI18n } from "../useI18n";

export default function HeaderLanguage() {
  const [open, setOpen] = useState(false);
  const { currentLanguage } = useLanguage();
  const { t } = useI18n();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("header.language.open")}
        title={t("header.language.open")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          minWidth: 140,
          minHeight: 46,
          padding: "10px 16px",
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.14)",
          background: "rgba(255,255,255,0.05)",
          color: "white",
          fontWeight: 700,
          fontSize: 15,
          cursor: "pointer",
          position: "relative",
          zIndex: 30,
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <span style={{ fontSize: 18 }}>{currentLanguage.flag}</span>
        <span>{currentLanguage.code.toUpperCase()}</span>
        <span style={{ opacity: 0.72, fontWeight: 500 }}>
          {currentLanguage.nativeLabel}
        </span>
      </button>

      <LanguageModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}