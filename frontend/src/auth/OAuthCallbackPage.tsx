import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "./AuthStore";

type OAuthUser = {
  provider: string;
  providerUserId: string;
  name: string;
  email: string;
  avatarUrl: string | null;
};

export default function OAuthCallbackPage() {
  const { setOAuthUser } = useAuthStore();

  const [message, setMessage] = useState("Completing sign-in...");
  const [debug, setDebug] = useState("");

  const search = window.location.search;

  const params = useMemo(() => new URLSearchParams(search), [search]);

  const provider = params.get("provider") || "";
  const providerUserId = params.get("providerUserId") || "";
  const name = params.get("name") || "";
  const email = params.get("email") || "";
  const avatarUrl = params.get("avatarUrl") || "";
  const error = params.get("error") || "";
  const description = params.get("description") || "";

  useEffect(() => {
    console.log("OAuth callback params:", {
      provider,
      providerUserId,
      name,
      email,
      avatarUrl,
      error,
      description,
      search,
    });

    if (error) {
      setMessage(description || `Login failed for ${provider || "provider"}.`);
      setDebug(`provider=${provider} error=${error}`);
      return;
    }

    if (!provider || !providerUserId) {
      setMessage("Missing OAuth user payload.");
      setDebug(`provider=${provider} search=${search}`);
      return;
    }

    try {
      setMessage("Saving authenticated user...");

      const oauthUser: OAuthUser = {
        provider,
        providerUserId,
        name,
        email,
        avatarUrl: avatarUrl || null,
      };

      setOAuthUser(oauthUser);

      setMessage("Redirecting to account...");

      window.setTimeout(() => {
        window.location.replace("/app/account");
      }, 200);
    } catch (err) {
      console.error("OAuth callback failed:", err);
      setMessage("Unable to store authenticated user.");
      setDebug(err instanceof Error ? err.message : "Unknown callback error");
    }
  }, [
    provider,
    providerUserId,
    name,
    email,
    avatarUrl,
    error,
    description,
    search,
    setOAuthUser,
  ]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "#05070d",
        color: "#eef2ff",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          padding: 24,
          borderRadius: 20,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: 12 }}>OAuth Callback</h1>
        <p style={{ margin: 0, opacity: 0.9 }}>{message}</p>

        {(error || debug) && (
          <div style={{ marginTop: 16, opacity: 0.85, fontSize: 14 }}>
            {provider ? (
              <div>
                <strong>Provider:</strong> {provider}
              </div>
            ) : null}

            {error ? (
              <div>
                <strong>Error:</strong> {error}
              </div>
            ) : null}

            {description ? (
              <div style={{ marginTop: 8 }}>
                <strong>Description:</strong> {description}
              </div>
            ) : null}

            {debug ? (
              <div style={{ marginTop: 8, wordBreak: "break-word" }}>
                <strong>Debug:</strong> {debug}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}


