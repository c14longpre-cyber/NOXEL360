import GlobeLogo from "@/assets/logos/webp/globe-selector.webp";
import noxel360Logo from "@/assets/logos/webp/noxel-360.webp";

export default function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between px-6">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <img
          src={noxel360Logo}
          alt="Noxel360"
          className="h-11 w-auto"
          style={{ objectFit: "contain" }}
          loading="eager"
        />

        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-wide">NOXEL360</div>
          <div className="text-[11px] text-white/60">
            Unified Intelligence Dashboard
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <div className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
          DIAMOND
        </div>

        <button
          type="button"
          onClick={() => console.log("Open language / region selector")}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition"
          aria-label="Language selector"
        >
          <img
            src={GlobeLogo}
            alt=""
            className="h-5 w-5"
            loading="lazy"
          />
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-fuchsia-500 text-xs font-bold">
          CL
        </div>
      </div>
    </header>
  );
}


