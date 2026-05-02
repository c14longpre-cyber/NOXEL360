import { googleLogout } from "@react-oauth/google";
import { useAuthStore } from "../auth/AuthStore";

export default function LogoutButton() {
  const { logout } = useAuthStore();

  async function handleLogout() {
    googleLogout();
    await logout();
  }

  return (
    <button className="nx-btn" type="button" onClick={handleLogout}>
      Logout
    </button>
  );
}


