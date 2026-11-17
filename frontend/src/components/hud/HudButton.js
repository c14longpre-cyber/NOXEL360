import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HUD_MARKUP, HUD_ACTIONS } from './hud-data';
import './hud-buttons.css';
function Graphic({ action, busy = false, progress, done = false }) {
    const shown = done && !busy ? 100 : progress;
    const percentage = typeof shown === 'number' && Number.isFinite(shown) ? Math.min(100, Math.max(0, Math.round(shown))) : undefined;
    return _jsxs("span", { className: "noxel-hud__graphic", "aria-hidden": "true", children: [_jsx("svg", { className: "noxel-hud__svg", viewBox: "0 0 128 128", focusable: "false", dangerouslySetInnerHTML: { __html: HUD_MARKUP[action] } }), (busy || done) && _jsxs("svg", { className: "noxel-hud__gauge", viewBox: "0 0 128 128", focusable: "false", children: [_jsx("path", { d: "M 18 92 A 46 46 0 0 1 110 92", fill: "none", stroke: "#A855F7", strokeWidth: "11", strokeLinecap: "round" }), _jsx("path", { d: "M 18 92 A 46 46 0 0 1 110 92", fill: "none", stroke: "#3DDC84", strokeWidth: "11", strokeLinecap: "round", pathLength: "100", className: percentage === undefined ? 'noxel-hud__gauge-sweep' : 'noxel-hud__gauge-fill', strokeDasharray: percentage === undefined ? '28 100' : `${percentage} 100` }), _jsx("text", { x: "64", y: "88", textAnchor: "middle", className: "noxel-hud__gauge-text", children: percentage === undefined ? '···' : `${percentage}%` })] })] });
}
function classes(compact, iconOnly, className) {
    return ['noxel-hud', compact && 'noxel-hud--compact', iconOnly && 'noxel-hud--icon-only', className].filter(Boolean).join(' ');
}
export function HudButton({ action, label, compact, iconOnly, busy = false, busyLabel, progress, done, selected, className, disabled, type = 'button', ...rest }) {
    const text = label ?? HUD_ACTIONS[action].label;
    const pending = busyLabel ?? (HUD_ACTIONS[action].busyLabel || 'En cours…');
    const finiteProgress = typeof progress === 'number' && Number.isFinite(progress) ? Math.min(100, Math.max(0, Math.round(progress))) : undefined;
    return _jsxs("button", { ...rest, type: type, className: classes(compact, iconOnly, className), disabled: disabled || busy, "aria-busy": busy || undefined, "aria-pressed": selected, "aria-label": busy ? `${pending}${finiteProgress === undefined ? '' : ` ${finiteProgress}%`}` : text, title: iconOnly ? text : rest.title, children: [_jsx(Graphic, { action: action, busy: busy, progress: progress, done: done }), _jsx("span", { className: "noxel-hud__label", children: busy ? pending : text })] });
}
/** Les téléchargements gardent leur sémantique de lien et leur attribut download. */
export function HudLink({ action, label, compact, iconOnly, className, ...rest }) {
    const text = label ?? HUD_ACTIONS[action].label;
    return _jsxs("a", { ...rest, className: classes(compact, iconOnly, className), "aria-label": text, title: iconOnly ? text : rest.title, children: [_jsx(Graphic, { action: action }), _jsx("span", { className: "noxel-hud__label", children: text })] });
}
