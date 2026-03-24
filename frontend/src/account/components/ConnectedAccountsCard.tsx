import { useAuthStore } from "../../auth/AuthStore";

type ProviderItem = {
  key: "google" | "microsoft" | "apple" | "facebook" | "linkedin";
  label: string;
};

const PROVIDERS: ProviderItem[] = [
  { key: "google", label: "Google" },
  { key: "microsoft", label: "Microsoft" },
  { key: "apple", label: "Apple" },
  { key: "facebook", label: "Facebook" },
  { key: "linkedin", label: "LinkedIn" },
];

export default function ConnectedAccountsCard() {
  const { providers, loginWithProvider } = useAuthStore();

  function isConnected(providerKey: string) {
    return providers.some((p) => p.provider === providerKey);
  }

  return (
    <section className="nx-card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <h3 className="nx-card__title">Connected Accounts</h3>

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
                  {p.label}
                </span>
                <span style={{ fontSize: 12, opacity: 0.65 }}>
                  {connected ? "Connected" : "Not connected"}
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
                  ✓ Linked
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
                  Connect
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}