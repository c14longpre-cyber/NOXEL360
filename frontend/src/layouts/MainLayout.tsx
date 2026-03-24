import { Outlet } from "react-router-dom";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
export default function MainLayout() {
  const location = useLocation();
const navigate = useNavigate();

const isDashboard =
  location.pathname === "/dashboard" || location.pathname === "/";
  return (
    <div className="min-h-screen w-full bg-[#0b0f14] text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-24 left-10 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute top-40 right-10 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen">
        <Sidebar />

        <div className="flex min-h-screen flex-1 flex-col">
          <div className="sticky top-0 z-20 border-b border-white/10 bg-[#0b0f14]/80 backdrop-blur">
            <Topbar />
          </div>

          <main className="flex-1">
            <div className="mx-auto w-full max-w-6xl px-6 py-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
