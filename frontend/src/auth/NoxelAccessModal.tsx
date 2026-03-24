import { useMemo } from "react";
import { createPortal } from "react-dom";
import { useAuthStore } from "./AuthStore";

type ProviderKey =
  | "google"
  | "microsoft"
  | "apple"
  | "facebook"
  | "linkedin"
  | "tiktok";

type ProviderItem = {
  key: ProviderKey;
  label: string;
  icon: string;
  enabled: boolean;
  accent?: "green" | "purple" | "neutral";
  note?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function NoxelAccessModal({ open, onClose }: Props) {
  const { loginWithProvider } = useAuthStore();

  const providers = useMemo<ProviderItem[]>(
    () => [
      {
        key: "google",
        label: "Google",
        icon: "G",
        enabled: true,
        accent: "green",
      },
      {
        key: "microsoft",
        label: "Microsoft",
        icon: "M",
        enabled: true,
        accent: "green",
      },
      {
        key: "apple",
        label: "Apple",
        icon: "",
        enabled: false,
        accent: "neutral",
        note: "Coming soon",
      },
      {
        key: "facebook",
        label: "Facebook",
        icon: "f",
        enabled: true,
        accent: "green",
      },
    {
  key: "linkedin",
  label: "LinkedIn",
  icon: "in",
  enabled: true,
  accent: "green",
},
      {
        key: "tiktok",
        label: "TikTok",
        icon: "♪",
        enabled: false,
        accent: "neutral",
        note: "Coming soon",
      },
    ],
    []
  );

  if (!open) return null;

  const overlayRoot = document.getElementById("overlay-root") || document.body;

  function handleProviderClick(provider: ProviderItem) {
    if (!provider.enabled) return;

    if (provider.key === "google") {
      loginWithProvider("google", "signin");
      onClose();
      return;
    }

    if (provider.key === "microsoft") {
      loginWithProvider("microsoft", "signin");
      onClose();
      return;
    }

    if (provider.key === "facebook") {
      loginWithProvider("facebook", "signin");
      onClose();
      return;
    }
if (provider.key === "linkedin") {
  loginWithProvider("linkedin", "signin");
  onClose();
  return;
}
    if (provider.key === "apple") {
      loginWithProvider("apple", "signin");
      onClose();
      return;
    }
  }

  function cardGlow(accent?: ProviderItem["accent"]) {
    if (accent === "green") {
      return "0 0 0 1px rgba(60,222,106,0.22), 0 0 24px rgba(60,222,106,0.12)";
    }
    if (accent === "purple") {
      return "0 0 0 1px rgba(112,42,165,0.22), 0 0 24px rgba(112,42,165,0.12)";
    }
    return "0 0 0 1px rgba(255,255,255,0.08)";
  }

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        background:
          "radial-gradient(circle at 30% 20%, rgba(60,222,106,0.10), transparent 30%), radial-gradient(circle at 75% 30%, rgba(112,42,165,0.10), transparent 30%), rgba(2,6,15,0.78)",
        backdropFilter: "blur(10px)",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <div
        className="nx-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 620,
          borderRadius: 28,
          padding: 22,
          background:
            "linear-gradient(180deg, rgba(10,16,26,0.92), rgba(6,10,18,0.96))",
          boxShadow:
            "0 0 0 1px rgba(60,222,106,0.20), 0 0 40px rgba(60,222,106,0.10), inset 0 0 30px rgba(255,255,255,0.03)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 1,
            width: "100%",
            marginBottom: 18,
            background:
              "linear-gradient(90deg, transparent, rgba(60,222,106,0.75), transparent)",
            boxShadow: "0 0 14px rgba(60,222,106,0.42)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "start",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 18,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 32,
                lineHeight: 1.1,
                fontWeight: 800,
              }}
            >
              Choose your access method
            </h2>

            <p
              style={{
                margin: "10px 0 0",
                fontSize: 15,
                opacity: 0.74,
              }}
            >
              Secure authentication across global platforms.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="nx-btn"
            style={{
              minWidth: 44,
              padding: "10px 14px",
            }}
            aria-label="Close access modal"
          >
            ✕
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 14,
          }}
        >
          {providers.map((provider) => (
            <button
              key={provider.key}
              type="button"
              onClick={() => handleProviderClick(provider)}
              disabled={!provider.enabled}
              style={{
                minHeight: 94,
                borderRadius: 18,
                border: "1px solid rgba(255,255,255,0.08)",
                background:
                  "linear-gradient(180deg, rgba(20,28,40,0.92), rgba(10,16,24,0.96))",
                boxShadow: cardGlow(provider.accent),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                color: provider.enabled ? "#eef2ff" : "rgba(238,242,255,0.48)",
                cursor: provider.enabled ? "pointer" : "not-allowed",
                transition: "transform .16s ease, box-shadow .16s ease, opacity .16s ease",
                opacity: provider.enabled ? 1 : 0.72,
              }}
              onMouseEnter={(e) => {
                if (!provider.enabled) return;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  fontSize: provider.icon === "in" ? 34 : 38,
                  fontWeight: 800,
                  lineHeight: 1,
                  color:
                    provider.accent === "green"
                      ? "#8cf0a7"
                      : provider.accent === "purple"
                        ? "#c18cff"
                        : "#eef2ff",
                  textShadow:
                    provider.accent === "green"
                      ? "0 0 12px rgba(60,222,106,0.22)"
                      : "none",
                }}
              >
                {provider.icon}
              </div>

              <div style={{ fontSize: 14, fontWeight: 700 }}>
                {provider.label}
              </div>

              <div style={{ fontSize: 11, opacity: 0.62 }}>
                {provider.enabled ? "Available" : provider.note || "Unavailable"}
              </div>
            </button>
          ))}
        </div>

        <div
          style={{
            marginTop: 18,
            paddingTop: 16,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            type="button"
            className="nx-btn"
            style={{
              padding: "10px 18px",
              opacity: 0.78,
            }}
            disabled
            title="Email login coming later"
          >
            Sign in with email
          </button>
        </div>
      </div>
    </div>,
    overlayRoot
  );
}