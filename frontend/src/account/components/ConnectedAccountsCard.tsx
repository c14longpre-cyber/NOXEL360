import { useAuthStore } from "../../auth/AuthStore";
import { useI18n } from "@/useI18n";

type ProviderItem = {
  key: "google" | "microsoft" | "apple" | "facebook" | "linkedin";
  labelKey: string;
};

const PROVIDERS: ProviderItem[] = [
  { key: "google", labelKey: "provider.google" },
  { key: "microsoft", labelKey: "provider.microsoft" },
  { key: "apple", labelKey: "provider.apple" },
  { key: "facebook", labelKey: "provider.facebook" },
  { key: "linkedin", labelKey: "provider.linkedin" },
];

export default function ConnectedAccountsCard() {
  const { providers, loginWithProvider } = useAuthStore();
  const { t } = useI18n();

  function isConnected(providerKey: string) {
    return providers.some((p) => p.provider === providerKey);
  }

  return (
    <section
      className="nx-card"
      style={{ display: "flex", flexDirection: "column", gap: 12 }}
    >
      <h3 className="nx-card__title">{t("connectedAccounts.title")}</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {PROVIDERS.map((p) => {
          const connected = isConnected(p.key);

          return (
            <div
              key={p.key}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid #10dada6e",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 15, fontWeight: 600 }}>
                  {t(p.labelKey)}
                </span>
                <span style={{ fontSize: 12, opacity: 0.65 }}>
                  {connected
                    ? t("connectedAccounts.status.connected")
                    : t("connectedAccounts.status.notConnected")}
                </span>
              </div>

              {connected ? (
                <span
                  style={{
                    fontSize: 12,
                    color: "#3CDE6A",
                    fontWeight: 600,
                  }}
                >
                  {t("connectedAccounts.linked")}
                </span>
              ) : (
                <button
                  className="nx-btn"
                  type="button"
                  onClick={() => loginWithProvider(p.key as any, "link")}
                  style={{
                    padding: "6px 12px",
                    fontSize: 13,
                  }}
                >
                  {t("connectedAccounts.connect")}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}