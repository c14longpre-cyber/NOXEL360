import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AuthCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const provider = params.get("provider");
    const raw = params.get("data");

    if (!provider || !raw) {
      navigate("/app/account");
      return;
    }

    try {
      const user = JSON.parse(raw);

      localStorage.setItem("auth_provider", provider);
      localStorage.setItem("auth_user", JSON.stringify(user));

      navigate("/app/account");
    } catch (error) {
      console.error("Auth callback parse error:", error);
      navigate("/app/account");
    }
  }, [params, navigate]);

  return <div style={{ padding: 24 }}>Signing you in...</div>;
}
