export function buildLinkedInAuthorizeUrl(state: string) {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI;
  const scope = process.env.LINKEDIN_SCOPE || "openid profile email";

  if (!clientId) {
    throw new Error("Missing LINKEDIN_CLIENT_ID");
  }

  if (!redirectUri) {
    throw new Error("Missing LINKEDIN_REDIRECT_URI");
  }

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    scope,
  });

  return {
    url: `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`,
  };
}