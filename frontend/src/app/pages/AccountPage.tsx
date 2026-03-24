import { useAccountStore } from "../../account/AccountStore";
import ConnectedAccountsCard from "../../account/components/ConnectedAccountsCard";
import { useAuthStore } from "../../auth/AuthStore";
import NoxelAccessButton from "../../auth/NoxelAccessButton";
import UserMenu from "../../components/UserMenu";
import NoxelAccountIcon from "../../components/NoxelAccountIcon";

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
              <h1 className="nx-title">Account Center</h1>
              <p className="nx-subtitle">
                Manage your profile, plan, preferences, security, and connected
                sign-in providers.
              </p>
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
                  title="Refresh account"
                  aria-label="Refresh account"
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
                  Source: {backendSource === "backend" ? "Live" : "Fallback"}
                </span>

                <span className="pill">
                  Status: {loading ? "Loading..." : "Ready"}
                </span>

                <span className="pill">
                  Auth:{" "}
                  {authLoading
                    ? "Checking session..."
                    : isAuthenticated
                      ? "Connected"
                      : "Guest"}
                </span>

                {user?.name ? (
                  <span className="pill">Signed in as: {user.name}</span>
                ) : null}

                {user?.email ? <span className="pill">{user.email}</span> : null}

                {error ? <span className="pill">Error: {error}</span> : null}
              </div>
            </div>
          </div>
        </header>

        <div
          className="nx-grid"
          style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
        >
          <article className="nx-card">
            <div className="nx-card__title">Profile</div>
            <p className="nx-card__text">
              <strong>Name:</strong> {account?.profile.name ?? user?.name ?? "—"}
              <br />
              <strong>Email:</strong> {account?.profile.email ?? user?.email ?? "—"}
              <br />
              <strong>Language:</strong> {account?.profile.language ?? "—"}
              <br />
              <strong>Workspace:</strong> {account?.profile.workspace ?? "—"}
            </p>
          </article>

          <article className="nx-card">
            <div className="nx-card__title">Plan &amp; Billing</div>
            <p className="nx-card__text">
              <strong>Tier:</strong> {account?.billing.tier ?? "—"}
              <br />
              <strong>Status:</strong> {account?.billing.status ?? "—"}
              <br />
              <strong>Renewal:</strong> {account?.billing.renewalDate ?? "—"}
              <br />
              <strong>Plan:</strong> {account?.billing.plan ?? "—"}
            </p>
          </article>

          <article className="nx-card">
            <div className="nx-card__title">Preferences</div>
            <p className="nx-card__text">
              <strong>Theme:</strong> {account?.preferences.theme ?? "—"}
              <br />
              <strong>Notifications:</strong>{" "}
              {account?.preferences.notifications ?? "—"}
              <br />
              <strong>Interface mode:</strong>{" "}
              {account?.preferences.interfaceMode ?? "—"}
              <br />
              <strong>Morph profile:</strong>{" "}
              {account?.preferences.morphProfile ?? "—"}
            </p>
          </article>

          <article className="nx-card">
            <div className="nx-card__title">Security</div>
            <p className="nx-card__text">
              <strong>Password:</strong> {account?.security.password ?? "—"}
              <br />
              <strong>2FA:</strong> {account?.security.twoFactor ?? "—"}
              <br />
              <strong>Last login:</strong> {account?.security.lastLogin ?? "—"}
              <br />
              <strong>Session protection:</strong>{" "}
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
