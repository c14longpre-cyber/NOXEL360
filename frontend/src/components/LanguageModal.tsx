
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLanguage, type AppLanguage } from "../language/LanguageStore";
import { useI18n } from "../useI18n";
import NexusLanguageMap from "../language/nexus/NexusLanguageMap";
type Props = {
  open: boolean;
  onClose: () => void;
};

type ViewMode = "list" | "map";

type MapLanguageHotspot = {
  id: string;
  label: string;
  x: number;
  y: number;
  code: AppLanguage;
};

const MAP_POINTS: MapLanguageHotspot[] = [
  { id: "canada", label: "Canada / English", x: 22, y: 24, code: "en" },
  { id: "quebec", label: "Québec / Français", x: 28, y: 28, code: "fr" },
  { id: "spain", label: "Spain / Español", x: 47, y: 38, code: "es" },
  { id: "germany", label: "Germany / Deutsch", x: 52, y: 30, code: "de" },
  { id: "italy", label: "Italy / Italiano", x: 55, y: 40, code: "it" },
  { id: "portugal", label: "Portugal / Português", x: 44, y: 40, code: "pt" },
  { id: "netherlands", label: "Netherlands / Nederlands", x: 49, y: 27, code: "nl" },
  { id: "japan", label: "Japan / 日本語", x: 85, y: 31, code: "ja" },
  { id: "china", label: "China / 中文", x: 77, y: 33, code: "zh" },
  { id: "saudi", label: "Arabic / العربية", x: 63, y: 43, code: "ar" },
];

function LanguageWorldMap({
  currentCode,
  onPick,
}: {
  currentCode: AppLanguage;
  onPick: (code: AppLanguage) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const { t } = useI18n();

  const hoveredPoint = MAP_POINTS.find((p) => p.id === hovered);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        borderRadius: 20,
        border: "1px solid rgba(255,255,255,0.1)",
        background:
          "radial-gradient(circle at 20% 20%, rgba(60,222,106,0.10), transparent 28%), radial-gradient(circle at 80% 30%, rgba(112,42,165,0.12), transparent 30%), rgba(255,255,255,0.03)",
        padding: 16,
      }}
    >
      <svg
        viewBox="0 0 1000 520"
        style={{
          width: "100%",
          height: "auto",
          display: "block",
        }}
        aria-label="Language map"
      >
        <rect
          x="0"
          y="0"
          width="1000"
          height="520"
          rx="20"
          fill="rgba(7,10,18,0.65)"
        />

        <g opacity="0.2" fill="rgba(255,255,255,0.12)">
          <ellipse cx="180" cy="180" rx="120" ry="70" />
          <ellipse cx="310" cy="280" rx="90" ry="120" />
          <ellipse cx="520" cy="170" rx="80" ry="50" />
          <ellipse cx="565" cy="245" rx="85" ry="110" />
          <ellipse cx="790" cy="190" rx="170" ry="95" />
          <ellipse cx="860" cy="330" rx="95" ry="60" />
        </g>

        {MAP_POINTS.map((point) => {
          const active = point.code === currentCode;
          const cx = point.x * 10;
          const cy = point.y * 10;

          return (
            <g
              key={point.id}
              onMouseEnter={() => setHovered(point.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onPick(point.code)}
              style={{ cursor: "pointer" }}
            >
              <circle
                cx={cx}
                cy={cy}
                r={active ? 16 : 11}
                fill={active ? "rgba(60,222,106,0.95)" : "rgba(255,255,255,0.9)"}
                stroke={active ? "rgba(112,42,165,0.95)" : "rgba(0,0,0,0.35)"}
                strokeWidth={active ? 5 : 3}
              />
              <circle
                cx={cx}
                cy={cy}
                r={active ? 28 : 22}
                fill="transparent"
                stroke={active ? "rgba(60,222,106,0.35)" : "rgba(255,255,255,0.12)"}
                strokeWidth="2"
              />
            </g>
          );
        })}
      </svg>

      <div
        style={{
          marginTop: 12,
          minHeight: 24,
          fontSize: 14,
          color: "rgba(255,255,255,0.78)",
        }}
      >
        {hoveredPoint
          ? `${t("language.selector.selectedArea")}: ${hoveredPoint.label}`
          : t("language.selector.mapHint")}
      </div>
    </div>
  );
}

export default function LanguageModal({ open, onClose }: Props) {
  const { languages, language, setLanguage } = useLanguage();
  const { t } = useI18n();
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.body.classList.add("modal-open");
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  function handleSelect(code: AppLanguage) {
    setLanguage(code);
    onClose();
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("language.selector.title")}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        background: "rgba(0,0,0,0.62)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
<div
  onClick={(e) => e.stopPropagation()}
style={{
  position: "relative",
  zIndex: 2147483647,
  width: "100vw",
height: "100vh",
maxHeight: "100vh",
borderRadius: 0,
padding: 32,
  overflowY: "auto",

  border: "1px solid rgba(255,255,255,0.14)",
  background:
    "linear-gradient(180deg, rgba(16,18,24,0.98) 0%, rgba(10,12,18,0.99) 100%)",
  boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
 
  color: "white",
}}
>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 18,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 30,
                opacity: 0.72,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Noxel Interface
            </div>
            <h2 style={{ margin: "6px 0 8px", fontSize: 30 }}>
              {t("language.selector.chooseLanguage")}
            </h2>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                style={{
                  borderRadius: 999,
                  padding: "10px 14px",
                  border:
                    viewMode === "list"
                      ? "1px solid rgba(60,222,106,0.9)"
                      : "1px solid rgba(255,255,255,0.14)",
                  background:
                    viewMode === "list"
                      ? "rgba(60,222,106,0.14)"
                      : "rgba(255,255,255,0.04)",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                {t("language.selector.viewList")}
              </button>

              <button
                type="button"
                onClick={() => setViewMode("map")}
                style={{
                  borderRadius: 999,
                  padding: "10px 14px",
                  border:
                    viewMode === "map"
                      ? "1px solid rgba(60,222,106,0.9)"
                      : "1px solid rgba(255,255,255,0.14)",
                  background:
                    viewMode === "map"
                      ? "rgba(60,222,106,0.14)"
                      : "rgba(255,255,255,0.04)",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                {t("language.selector.viewMap")}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t("common.close")}
            style={{
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.05)",
              color: "white",
              borderRadius: 14,
              padding: "10px 14px",
              cursor: "pointer",
            }}
          >
            {t("common.close")}
          </button>
        </div>

        {viewMode === "list" ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
            }}
          >
            {languages.map((item) => {
              const active = item.code === language;

              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleSelect(item.code)}
                  style={{
                    textAlign: "left",
                    borderRadius: 20,
                    padding: "16px 18px",
                    cursor: "pointer",
                    border: active
                      ? "1px solid rgba(60,222,106,0.9)"
                      : "1px solid rgba(255,255,255,0.10)",
                    background: active
                      ? "linear-gradient(180deg, rgba(60,222,106,0.16), rgba(112,42,165,0.16))"
                      : "rgba(255,255,255,0.04)",
                    color: "white",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 24 }}>{item.flag}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{item.label}</div>
                      <div style={{ opacity: 0.72, fontSize: 14 }}>{item.nativeLabel}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <NexusLanguageMap
  currentLanguage={language}
  onSelectLanguage={handleSelect}
/>
        )}
      </div>
    </div>,
    document.body
  );
}