import { useAuthStore } from "./AuthStore";

export default function MicrosoftLoginButton() {
  const { loginWithProvider } = useAuthStore();

  return (
    <button
      type="button"
      className="account-btn"
      onClick={() => loginWithProvider("microsoft", "signin")}
    >
      Continue with Microsoft
    </button>
  );
}