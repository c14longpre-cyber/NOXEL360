import { jsx as _jsx } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { HudLink } from "./HudButton";
export function HudRouteLink({ to, onClick, ...rest }) {
    const navigate = useNavigate();
    const handleClick = (e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
            return;
        e.preventDefault();
        navigate(to);
    };
    return _jsx(HudLink, { ...rest, href: to, onClick: handleClick });
}
