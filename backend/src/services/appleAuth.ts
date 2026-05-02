import crypto from "crypto";

export function buildAppleAuthorizeUrl() {
  const clientId = process.env.APPLE_CLIENT_ID!;
  const redirectUri = process.env.APPLE_REDIRECT_URI!;
  const scope = process.env.APPLE_SCOPE || "name email";

  const state = crypto.randomBytes(16).toString("hex");
  const nonce = crypto.randomBytes(16).toString("hex");

  const params = new URLSearchParams({
    response_type: "code",
    response_mode: "form_post",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope,
    state,
    nonce,
  });

  return {
    url: `https://appleid.apple.com/auth/authorize?${params.toString()}`,
    state,
    nonce,
  };
}
