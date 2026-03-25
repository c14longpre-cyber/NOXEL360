import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { useAuthStore } from "../auth/AuthStore";
import UserAvatar from "./UserAvatar";
export default function UserMenu() {
    const { user, logout, isAuthenticated, providers } = useAuthStore();
    const [open, setOpen] = useState(false);
    const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
    const buttonRef = useRef(null);
    const wrapRef = useRef(null);
    useEffect(() => {
        function closeOnOutsideClick(event) {
            const target = event.target;
            if (!target)
                return;
            const overlayRoot = document.getElementById("overlay-root");
            const clickedInsideTrigger = !!wrapRef.current && wrapRef.current.contains(target);
            const clickedInsideOverlay = !!overlayRoot && overlayRoot.contains(target);
            if (!clickedInsideTrigger && !clickedInsideOverlay) {
                setOpen(false);
            }
        }
        function closeOnEscape(event) {
            if (event.key === "Escape") {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", closeOnOutsideClick);
        document.addEventListener("keydown", closeOnEscape);
        return () => {
            document.removeEventListener("mousedown", closeOnOutsideClick);
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, []);
    useEffect(() => {
        if (!open || !buttonRef.current)
            return;
        function updatePosition() {
            if (!buttonRef.current)
                return;
            const rect = buttonRef.current.getBoundingClientRect();
            const gap = 12;
            setMenuPos({
                top: rect.bottom + gap,
                right: Math.max(window.innerWidth - rect.right, 12),
            });
        }
        updatePosition();
        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition, true);
        return () => {
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition, true);
        };
    }, [open]);
    if (!isAuthenticated || !user) {
        return (_jsx(Link, { to: "/app/account", className: "account-btn", style: {
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
            }, children: "Account" }));
    }
    async function handleLogout() {
        setOpen(false);
        await logout();
    }
    const overlayRoot = document.getElementById("overlay-root");
    const providerNames = providers.map((p) => p.provider);
    const providerLabel = providerNames.length > 0 ? providerNames.join(" · ") : "No providers linked";
    const menu = open && overlayRoot
        ? createPortal(_jsxs("div", { className: "nx-card account-menu-popover", style: {
                position: "fixed",
                top: menuPos.top,
                right: menuPos.right,
                width: 280,
                padding: 14,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                zIndex: 2147483647,
                borderRadius: 24,
            }, children: [_jsxs("div", { style: {
                        padding: "2px 4px 10px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                    }, children: [_jsx("div", { style: { fontSize: 14, opacity: 0.82 }, children: "Signed in as" }), _jsx("div", { style: { fontSize: 15, fontWeight: 700 }, children: user.name || user.email || "Noxel User" }), _jsx("div", { style: { fontSize: 12, opacity: 0.7 }, children: user.email || "No email available" }), _jsxs("div", { style: { fontSize: 12, opacity: 0.58, marginTop: 2 }, children: ["Providers: ", providerLabel] })] }), _jsx(Link, { className: "nx-btn", to: "/app/account", onClick: () => setOpen(false), children: "Workspace" }), _jsx(Link, { className: "nx-btn", to: "/app/account?tab=accounts", onClick: () => setOpen(false), children: "Connected Accounts" }), _jsx("button", { className: "nx-btn", type: "button", onClick: () => setOpen(false), children: "Security" }), _jsx("button", { className: "nx-btn", type: "button", onClick: () => setOpen(false), children: "Billing" }), _jsx("button", { className: "nx-btn", type: "button", onClick: handleLogout, children: "Logout" })] }), overlayRoot)
        : null;
    return (_jsxs(_Fragment, { children: [_jsx("div", { ref: wrapRef, className: "account-menu-wrap", style: {
                    position: "relative",
                    zIndex: 1000,
                }, children: _jsxs("button", { ref: buttonRef, className: "account-btn", type: "button", onClick: () => setOpen((prev) => !prev), "aria-haspopup": "menu", "aria-expanded": open, style: {
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        textDecoration: "none",
                    }, children: [_jsx(UserAvatar, { name: user.name || user.email || "User", size: 30 }), _jsx("span", { children: user.name || user.email || "Account" })] }) }), menu] }));
}
