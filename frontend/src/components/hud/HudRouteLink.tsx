import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { HudLink } from "./HudButton";
import type { HudAction } from "./hud-data";

// Kit HUD copié tel quel depuis NOXEL Spectra (HudButton.tsx, hud-buttons.css, hud-data.ts) :
// ne pas le modifier ici, le resynchroniser depuis Spectra. Ce fichier ajoute seulement
// une variante pour les routes internes (navigation SPA sans rechargement).
type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "href"> & {
  action: HudAction;
  to: string;
  label?: string;
  compact?: boolean;
  iconOnly?: boolean;
};

export function HudRouteLink({ to, onClick, ...rest }: Props) {
  const navigate = useNavigate();
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(to);
  };
  return <HudLink {...rest} href={to} onClick={handleClick} />;
}
