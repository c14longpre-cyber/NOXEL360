import { useAccountStore } from "../../account/AccountStore";
import ConnectedAccountsCard from "../../account/components/ConnectedAccountsCard";
import { useAuthStore } from "../../auth/AuthStore";
import NoxelAccessButton from "../../auth/NoxelAccessButton";
import UserMenu from "../../components/UserMenu";
import NoxelAccountIcon from "../../components/NoxelAccountIcon";
import { useI18n } from "@/useI18n";

function normalizeTier(
  tier?: string
): "bronze" | "silver" | "gold" | "platinum" | "diamond" {
  const value = (tier || "").toLowerCase();

  if (value === "bronze") return "bronze";
  if (value === "silver") return "silver";
  if (value === "gold") return "gold";
  if (value === "platinum") return "platinum";
  return "diamond";
}

export default function AccountPage() {
  const { account, loading, error, backendSource, refreshAccount } =
    useAccountStore();

  const { user, isAuthenticated, loading: authLoading } = useAuthStore();
  const { t } = useI18n();

  const currentTier = normalizeTier(account?.billing.tier);

  return (
    <div className="noxel-landing">
      <div className="nx-wrap">
        <header className="nx-hero">
          <div className="account-hero-layout">
            <div className="account-hero-left">
              <img
                src="/logos/noxel360.svg"
                alt="NOXEL360"
                style={{ height: 150 }}
              />
            </div>

            <div className="account-hero-center">
              <h1 className="nx-title">{t("account.title")}</h1>
              <p className="nx-subtitle">{t("account.subtitle")}</p>
            </div>

            <div className="account-hero-right">
              <div
                className="account-hero-top"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                  justifyContent: "flex-end",
                }}
              >
                <NoxelAccountIcon
                  connected={isAuthenticated}
                  tier={currentTier}
                  size={78}
                />

                <button
                  className={`nx-btn refresh-btn ${loading ? "loading" : ""}`}
                  onClick={refreshAccount}
                  type="button"
                  title={t("account.refresh")}
                  aria-label={t("account.refresh")}
                  disabled={loading}
                >
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M21 12a9 9 0 1 1-2.64-6.36"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M21 4v6h-6"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {!isAuthenticated ? <NoxelAccessButton /> : <UserMenu />}
              </div>

              <div
                className="account-hero-meta"
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  justifyContent: "flex-end",
                  marginTop: 10,
                }}
              >
                <span className="pill">
                  {t("account.source")}:{" "}
                  {backendSource === "backend"
                    ? t("account.source.live")
                    : t("account.source.fallback")}
                </span>

                <span className="pill">
                  {t("account.status")}:{" "}
                  {loading ? t("common.loading") : t("account.ready")}
                </span>

                <span className="pill">
                  {t("account.auth")}:{" "}
                  {authLoading
                    ? t("account.checking")
                    : isAuthenticated
                    ? t("account.connected")
                    : t("account.guest")}
                </span>

                {user?.name && (
                  <span className="pill">
                    {t("account.signedInAs")}: {user.name}
                  </span>
                )}

                {user?.email && <span className="pill">{user.email}</span>}

                {error && (
                  <span className="pill">
                    {t("account.error")}: {error}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        <div
          className="nx-grid"
          style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
        >
          <article className="nx-card">
            <div className="nx-card__title">{t("account.profile")}</div>
            <p className="nx-card__text">
              <strong>{t("account.name")}:</strong>{" "}
              {account?.profile.name ?? user?.name ?? "—"}
              <br />
              <strong>{t("account.email")}:</strong>{" "}
              {account?.profile.email ?? user?.email ?? "—"}
              <br />
              <strong>{t("account.language")}:</strong>{" "}
              {account?.profile.language ?? "—"}
              <br />
              <strong>{t("account.workspace")}:</strong>{" "}
              {account?.profile.workspace ?? "—"}
            </p>
          </article>

          <article className="nx-card">
            <div className="nx-card__title">{t("account.billing")}</div>
            <p className="nx-card__text">
              <strong>{t("account.tier")}:</strong>{" "}
              {account?.billing.tier ?? "—"}
              <br />
              <strong>{t("account.status")}:</strong>{" "}
              {account?.billing.status ?? "—"}
              <br />
              <strong>{t("account.renewal")}:</strong>{" "}
              {account?.billing.renewalDate ?? "—"}
              <br />
              <strong>{t("account.plan")}:</strong>{" "}
              {account?.billing.plan ?? "—"}
            </p>
          </article>

          <article className="nx-card">
            <div className="nx-card__title">{t("account.preferences")}</div>
            <p className="nx-card__text">
              <strong>{t("account.theme")}:</strong>{" "}
              {account?.preferences.theme ?? "—"}
              <br />
              <strong>{t("account.notifications")}:</strong>{" "}
              {account?.preferences.notifications ?? "—"}
              <br />
              <strong>{t("account.interfaceMode")}:</strong>{" "}
              {account?.preferences.interfaceMode ?? "—"}
              <br />
              <strong>{t("account.morphProfile")}:</strong>{" "}
              {account?.preferences.morphProfile ?? "—"}
            </p>
          </article>

          <article className="nx-card">
            <div className="nx-card__title">{t("account.security")}</div>
            <p className="nx-card__text">
              <strong>{t("account.password")}:</strong>{" "}
              {account?.security.password ?? "—"}
              <br />
              <strong>{t("account.twoFactor")}:</strong>{" "}
              {account?.security.twoFactor ?? "—"}
              <br />
              <strong>{t("account.lastLogin")}:</strong>{" "}
              {account?.security.lastLogin ?? "—"}
              <br />
              <strong>{t("account.sessionProtection")}:</strong>{" "}
              {account?.security.sessionProtection ?? "—"}
            </p>
          </article>
        </div>

        <div style={{ marginTop: 20 }}>
          <ConnectedAccountsCard />
        </div>
      </div>
    </div>
  );
}