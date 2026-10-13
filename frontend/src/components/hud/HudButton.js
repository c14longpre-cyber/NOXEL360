import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HUD_MARKUP, HUD_ACTIONS } from './hud-data';
import './hud-buttons.css';
function Graphic({ action, busy = false, progress }) {
    const percentage = typeof progress === 'number' && Number.isFinite(progress) ? Math.min(100, Math.max(0, Math.round(progress))) : undefined;
    return _jsxs("span", { className: "noxel-hud__graphic", "aria-hidden": "true", children: [_jsx("svg", { className: "noxel-hud__svg", viewBox: "0 0 128 128", focusable: "false", dangerouslySetInnerHTML: { __html: HUD_MARKUP[action] } }), busy && _jsx("span", { className: "noxel-hud__loading", children: percentage === undefined ? _jsx("span", { children: "\u00B7\u00B7\u00B7" }) : `${percentage}%` }), busy && percentage !== undefined && _jsx("svg", { className: "noxel-hud__progress", viewBox: "0 0 128 128", children: _jsx("circle", { cx: "64", cy: "64", r: "31", fill: "none", stroke: "#3DDC84", strokeWidth: "2.5", pathLength: "100", strokeDasharray: `${percentage} 100`, transform: "rotate(-90 64 64)" }) })] });
}
function classes(compact, iconOnly, className) {
    return ['noxel-hud', compact && 'noxel-hud--compact', iconOnly && 'noxel-hud--icon-only', className].filter(Boolean).join(' ');
}
export function HudButton({ action, label, compact, iconOnly, busy = false, busyLabel, progress, selected, className, disabled, type = 'button', ...rest }) {
    const text = label ?? HUD_ACTIONS[action].label;
    const pending = busyLabel ?? (HUD_ACTIONS[action].busyLabel || 'En cours…');
    const finiteProgress = typeof progress === 'number' && Number.isFinite(progress) ? Math.min(100, Math.max(0, Math.round(progress))) : undefined;
    return _jsxs("button", { ...rest, type: type, className: classes(compact, iconOnly, className), disabled: disabled || busy, "aria-busy": busy || undefined, "aria-pressed": selected, "aria-label": busy ? `${pending}${finiteProgress === undefined ? '' : ` ${finiteProgress}%`}` : text, title: iconOnly ? text : rest.title, children: [_jsx(Graphic, { action: action, busy: busy, progress: progress }), _jsx("span", { className: "noxel-hud__label", children: busy ? pending : text })] });
}
/** Les téléchargements gardent leur sémantique de lien et leur attribut download. */
export function HudLink({ action, label, compact, iconOnly, className, ...rest }) {
    const text = label ?? HUD_ACTIONS[action].label;
    return _jsxs("a", { ...rest, className: classes(compact, iconOnly, className), "aria-label": text, title: iconOnly ? text : rest.title, children: [_jsx(Graphic, { action: action }), _jsx("span", { className: "noxel-hud__label", children: text })] });
}
