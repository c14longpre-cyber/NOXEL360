import { useEffect, useMemo, useRef, useState } from "react";
import LanguageModal from "./LanguageModal";
import { useLanguage, type AppLanguage } from "../language/LanguageStore";
import { useI18n } from "../useI18n";
import { getFullyTranslatedLanguages } from "../i18n/languageCatalog";

/**
 * HeaderLanguage
 * ---------------
 * Trois façons de changer de langue :
 *
 * 1. Clic sur le bouton → dropdown avec TOUTES les langues pleinement
 *    traduites (source : `FULLY_TRANSLATED_CODES` dans languageCatalog.ts).
 *    Changement immédiat au clic, sans bouton "Appliquer".
 *
 * 2. Champ de recherche dans le dropdown → filtre sur label, endonyme, code.
 *    Utile dès qu'on dépasse ~8-10 langues traduites.
 *
 * 3. Lien "Sélecteur complet →" → ouvre le modal avec les 230+ langues
 *    (inclut celles en fallback anglais + les langues autochtones).
 *
 * `setLanguage` écrit dans le React Context partagé : tout composant qui
 * consomme `useI18n().t(...)` se re-rend instantanément.
 */
export default function HeaderLanguage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { currentLanguage, language, setLanguage } = useLanguage();
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!menuOpen) {
      setQuery("");
      return;
    }

    // Auto-focus le champ de recherche à l'ouverture
    const timer = setTimeout(() => searchRef.current?.focus(), 50);

    function onDown(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // Source dynamique : toute langue dont `translationStatus === "complete"`
  // apparaît automatiquement. Pour en ajouter une : il suffit de compléter
  // son fichier `locales/XX.ts` et d'ajouter le code dans FULLY_TRANSLATED_CODES.
  const translatedLanguages = useMemo(() => getFullyTranslatedLanguages(), []);

  const filteredLanguages = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return translatedLanguages;
    return translatedLanguages.filter(
      (lang) =>
        lang.code.toLowerCase().includes(q) ||
        lang.label.toLowerCase().includes(q) ||
        lang.nativeLabel.toLowerCase().includes(q)
    );
  }, [query, translatedLanguages]);

  const handleQuickSelect = (code: AppLanguage) => {
    setLanguage(code);
    setMenuOpen(false);
  };

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label={t("header.language.open")}
        aria-haspopup="listbox"
        aria-expanded={menuOpen}
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
          background: menuOpen ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.05)",
          color: "white",
          fontWeight: 700,
          fontSize: 15,
          cursor: "pointer",
          position: "relative",
          zIndex: 30,
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          transition: "background 120ms ease",
        }}
      >
        <span style={{ fontSize: 18 }}>{currentLanguage.flag}</span>
        <span>{currentLanguage.code.toUpperCase()}</span>
        <span style={{ opacity: 0.72, fontWeight: 500 }}>
          {currentLanguage.nativeLabel}
        </span>
        <span
          aria-hidden="true"
          style={{
            opacity: 0.6,
            fontSize: 11,
            marginLeft: 2,
            transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 150ms ease",
          }}
        >
          ▼
        </span>
      </button>

      {menuOpen && (
        <div
          role="listbox"
          aria-label={t("language.selector.title")}
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: 280,
            maxHeight: 440,
            display: "flex",
            flexDirection: "column",
            padding: 6,
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.14)",
            background:
              "linear-gradient(180deg, rgba(16,18,24,0.98) 0%, rgba(10,12,18,0.99) 100%)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            zIndex: 40,
            color: "white",
          }}
        >
          {/* Barre de recherche, visible si plus de 8 langues traduites */}
          {translatedLanguages.length > 8 && (
            <div style={{ padding: "4px 6px 8px" }}>
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t(
                  "header.language.searchPlaceholder",
                  undefined,
                  "Search a language…"
                )}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)",
                  color: "white",
                  fontSize: 13,
                  outline: "none",
                }}
              />
            </div>
          )}

          {/* Compteur discret */}
          <div
            style={{
              padding: "0 12px 6px",
              fontSize: 11,
              opacity: 0.55,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {filteredLanguages.length}{" "}
            {t(
              "header.language.fullyTranslated",
              undefined,
              "fully translated"
            )}
          </div>

          {/* Liste scrollable */}
          <div style={{ flex: 1, overflowY: "auto", paddingRight: 2 }}>
            {filteredLanguages.length === 0 && (
              <div
                style={{
                  padding: "14px 12px",
                  fontSize: 13,
                  opacity: 0.6,
                  textAlign: "center",
                }}
              >
                {t(
                  "header.language.noMatch",
                  undefined,
                  "No language matches."
                )}
              </div>
            )}

            {filteredLanguages.map((item) => {
              const active = item.code === language;
              return (
                <button
                  key={item.code}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => handleQuickSelect(item.code)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    textAlign: "left",
                    padding: "9px 12px",
                    borderRadius: 10,
                    border: "none",
                    background: active ? "rgba(60,222,106,0.14)" : "transparent",
                    color: "white",
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                  onMouseEnter={(e) => {
                    if (!active)
                      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span style={{ fontSize: 18 }}>{item.flag}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        opacity: 0.7,
                        fontSize: 12,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.nativeLabel}
                    </div>
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      opacity: 0.55,
                      textTransform: "uppercase",
                      fontFamily:
                        "ui-monospace, SFMono-Regular, Menlo, monospace",
                    }}
                  >
                    {item.code}
                  </span>
                  {active && (
                    <span style={{ color: "rgb(60,222,106)", fontWeight: 700 }}>
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div
            style={{
              height: 1,
              background: "rgba(255,255,255,0.08)",
              margin: "6px 4px",
            }}
          />

          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              setModalOpen(true);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "none",
              background: "transparent",
              color: "rgba(255,255,255,0.85)",
              cursor: "pointer",
              fontSize: 13,
              textAlign: "left",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <span>
              {t(
                "header.language.allLanguages",
                undefined,
                "All 230+ languages"
              )}
            </span>
            <span aria-hidden="true" style={{ opacity: 0.6 }}>
              →
            </span>
          </button>
        </div>
      )}

      <LanguageModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}


