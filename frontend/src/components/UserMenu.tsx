import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { useAuthStore } from "../auth/AuthStore";
import UserAvatar from "./UserAvatar";
import { useI18n } from "@/useI18n";

type MenuPosition = {
  top: number;
  right: number;
};

export default function UserMenu() {
  const { user, logout, isAuthenticated, providers } = useAuthStore();
  const { t } = useI18n();

  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<MenuPosition>({ top: 0, right: 0 });

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      const target = event.target as Node | null;
      if (!target) return;

      const overlayRoot = document.getElementById("overlay-root");

      const insideTrigger =
        !!wrapRef.current && wrapRef.current.contains(target);

      const insideOverlay =
        !!overlayRoot && overlayRoot.contains(target);

      if (!insideTrigger && !insideOverlay) {
        setOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  useEffect(() => {
    if (!open || !buttonRef.current) return;

    function updatePosition() {
      if (!buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();

      setMenuPos({
        top: rect.bottom + 12,
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

  // 🔒 NOT AUTHENTICATED
  if (!isAuthenticated || !user) {
    return (
      <Link to="/app/account" className="account-btn">
        {t("userMenu.account")}
      </Link>
    );
  }

  async function handleLogout() {
    setOpen(false);
    await logout();
  }

  const overlayRoot = document.getElementById("overlay-root");

  const providerNames = providers.map((p) => p.provider);
  const providerLabel =
    providerNames.length > 0
      ? providerNames.join(" · ")
      : t("userMenu.noProviders");

  const menu =
    open && overlayRoot
      ? createPortal(
          <div
            className="nx-card account-menu-popover"
            style={{
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
            }}
          >
            <div style={{ padding: "2px 4px 10px" }}>
              <div style={{ fontSize: 14, opacity: 0.82 }}>
                {t("userMenu.signedInAs")}
              </div>

              <div style={{ fontSize: 15, fontWeight: 700 }}>
                {user.name || user.email || t("userMenu.defaultUser")}
              </div>

              <div style={{ fontSize: 12, opacity: 0.7 }}>
                {user.email || t("userMenu.noEmail")}
              </div>

              <div style={{ fontSize: 12, opacity: 0.58, marginTop: 2 }}>
                {t("userMenu.providers")}: {providerLabel}
              </div>
            </div>

            <Link className="nx-btn" to="/app/account" onClick={() => setOpen(false)}>
              {t("userMenu.workspace")}
            </Link>

            <Link
              className="nx-btn"
              to="/app/account?tab=accounts"
              onClick={() => setOpen(false)}
            >
              {t("userMenu.connectedAccounts")}
            </Link>

            <button className="nx-btn" onClick={() => setOpen(false)}>
              {t("userMenu.security")}
            </button>

            <button className="nx-btn" onClick={() => setOpen(false)}>
              {t("userMenu.billing")}
            </button>

            <button className="nx-btn" onClick={handleLogout}>
              {t("userMenu.logout")}
            </button>
          </div>,
          overlayRoot
        )
      : null;

  return (
    <>
      <div ref={wrapRef} className="account-menu-wrap">
        <button
          ref={buttonRef}
          className="account-btn"
          onClick={() => setOpen((prev) => !prev)}
        >
          <UserAvatar name={user.name || user.email || "User"} size={30} />
          <span>{user.name || user.email || t("userMenu.account")}</span>
        </button>
      </div>

      {menu}
    </>
  );
}

