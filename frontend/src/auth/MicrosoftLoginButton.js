import { jsx as _jsx } from "react/jsx-runtime";
import { useAuthStore } from "./AuthStore";
export default function MicrosoftLoginButton() {
    const { loginWithProvider } = useAuthStore();
    return (_jsx("button", { type: "button", className: "account-btn", onClick: () => loginWithProvider("microsoft", "signin"), children: "Continue with Microsoft" }));
}
