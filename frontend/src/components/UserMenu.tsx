import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { useAuthStore } from "../auth/AuthStore";
import UserAvatar from "./UserAvatar";

type MenuPosition = {
  top: number;
  right: number;
};

export default function UserMenu() {
  const { user, logout, isAuthenticated, providers } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<MenuPosition>({ top: 0, right: 0 });

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      const target = event.target as Node | null;
      if (!target) return;

      const overlayRoot = document.getElementById("overlay-root");

      const clickedInsideTrigger =
        !!wrapRef.current && wrapRef.current.contains(target);

      const clickedInsideOverlay =
        !!overlayRoot && overlayRoot.contains(target);

      if (!clickedInsideTrigger && !clickedInsideOverlay) {
        setOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
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
    if (!open || !buttonRef.current) return;

    function updatePosition() {
      if (!buttonRef.current) return;

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
    return (
      <Link
        to="/app/account"
        className="account-btn"
        style={{
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        Account
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
    providerNames.length > 0 ? providerNames.join(" · ") : "No providers linked";

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
            <div
              style={{
                padding: "2px 4px 10px",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div style={{ fontSize: 14, opacity: 0.82 }}>Signed in as</div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>
                {user.name || user.email || "Noxel User"}
              </div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                {user.email || "No email available"}
              </div>
              <div style={{ fontSize: 12, opacity: 0.58, marginTop: 2 }}>
                Providers: {providerLabel}
              </div>
            </div>

            <Link
              className="nx-btn"
              to="/app/account"
              onClick={() => setOpen(false)}
            >
              Workspace
            </Link>

            <Link
              className="nx-btn"
              to="/app/account?tab=accounts"
              onClick={() => setOpen(false)}
            >
              Connected Accounts
            </Link>

            <button
              className="nx-btn"
              type="button"
              onClick={() => setOpen(false)}
            >
              Security
            </button>

            <button
              className="nx-btn"
              type="button"
              onClick={() => setOpen(false)}
            >
              Billing
            </button>

            <button className="nx-btn" type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>,
          overlayRoot
        )
      : null;

  return (
    <>
      <div
        ref={wrapRef}
        className="account-menu-wrap"
        style={{
          position: "relative",
          zIndex: 1000,
        }}
      >
        <button
          ref={buttonRef}
          className="account-btn"
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-haspopup="menu"
          aria-expanded={open}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          <UserAvatar name={user.name || user.email || "User"} size={30} />
          <span>{user.name || user.email || "Account"}</span>
        </button>
      </div>

      {menu}
    </>
  );
}
