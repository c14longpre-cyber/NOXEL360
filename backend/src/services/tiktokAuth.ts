import crypto from "crypto";

export function buildTikTokAuthorizeUrl() {
  const clientKey = process.env.TIKTOK_CLIENT_KEY!;
  const redirectUri = process.env.TIKTOK_REDIRECT_URI!;
  const scope = process.env.TIKTOK_SCOPE || "user.info.basic";
  const state = crypto.randomBytes(16).toString("hex");

  const params = new URLSearchParams({
    client_key: clientKey,
    scope,
    response_type: "code",
    redirect_uri: redirectUri,
    state,
  });

  return {
    url: `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`,
    state,
  };
}
