import { useAuthStore } from "../auth/AuthStore";

export default function GoogleLoginButton() {
  const { loginWithProvider } = useAuthStore();

  return (
    <button
      type="button"
      className="account-btn"
      onClick={() => loginWithProvider("google", "signin")}
    >
      Continue with Google
    </button>
  );
}
