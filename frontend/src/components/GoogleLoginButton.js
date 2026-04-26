import { jsx as _jsx } from "react/jsx-runtime";
import { useAuthStore } from "../auth/AuthStore";
export default function GoogleLoginButton() {
    const { loginWithProvider } = useAuthStore();
    return (_jsx("button", { type: "button", className: "account-btn", onClick: () => loginWithProvider("google", "signin"), children: "Continue with Google" }));
}
