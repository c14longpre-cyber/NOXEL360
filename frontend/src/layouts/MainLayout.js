import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from "react-router-dom";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
export default function MainLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const isDashboard = location.pathname === "/dashboard" || location.pathname === "/";
    return (_jsxs("div", { className: "min-h-screen w-full bg-[#0b0f14] text-white", children: [_jsxs("div", { className: "pointer-events-none fixed inset-0", children: [_jsx("div", { className: "absolute -top-24 left-10 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl" }), _jsx("div", { className: "absolute top-40 right-10 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl" }), _jsx("div", { className: "absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" })] }), _jsxs("div", { className: "relative flex min-h-screen", children: [_jsx(Sidebar, {}), _jsxs("div", { className: "flex min-h-screen flex-1 flex-col", children: [_jsx("div", { className: "sticky top-0 z-20 border-b border-white/10 bg-[#0b0f14]/80 backdrop-blur", children: _jsx(Topbar, {}) }), _jsx("main", { className: "flex-1", children: _jsx("div", { className: "mx-auto w-full max-w-6xl px-6 py-6", children: _jsx(Outlet, {}) }) })] })] })] }));
}
