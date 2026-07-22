import { jsx as _jsx } from "react/jsx-runtime";
import { googleLogout } from "@react-oauth/google";
import { useAuthStore } from "../auth/AuthStore";
export default function LogoutButton() {
    const { logout } = useAuthStore();
    async function handleLogout() {
        googleLogout();
        await logout();
    }
    return (_jsx("button", { className: "nx-btn", type: "button", onClick: handleLogout, children: "Logout" }));
}
