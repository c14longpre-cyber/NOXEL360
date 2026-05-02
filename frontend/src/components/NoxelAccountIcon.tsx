import "./noxel-account-icon.css";

export type NoxelTier =
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "diamond";

type NoxelAccountIconProps = {
  connected?: boolean;
  tier?: NoxelTier;
  size?: number;
  className?: string;
};

const TIER_CLASS: Record<NoxelTier, string> = {
  bronze: "tier-bronze",
  silver: "tier-silver",
  gold: "tier-gold",
  platinum: "tier-platinum",
  diamond: "tier-diamond",
};

export default function NoxelAccountIcon({
  connected = false,
  tier = "diamond",
  size = 78,
  className = "",
}: NoxelAccountIconProps) {
  const stateClass = connected ? "is-connected" : "is-disconnected";
  const tierClass = connected ? TIER_CLASS[tier] : "tier-off";

  return (
    <div
      className={`noxel-account-icon ${stateClass} ${tierClass} ${className}`.trim()}
      style={{ width: size, height: size }}
      aria-label={connected ? `Connected account (${tier})` : "Disconnected account"}
      title={connected ? `Connected • ${tier}` : "Disconnected"}
    >
      <svg
        viewBox="0 0 100 100"
        className="noxel-account-icon__svg"
        role="img"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="noxelRefreshGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#702AA5" />
            <stop offset="100%" stopColor="#3CDE6A" />
          </linearGradient>
        </defs>

        <path
          className="noxel-account-icon__ring"
          d="M50 11
             A39 39 0 1 1 22 22"
          fill="none"
          strokeWidth="7"
          strokeLinecap="round"
        />

        <path
          className="noxel-account-icon__arrow"
          d="M22 22 L22 10 L34 10"
          fill="none"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle className="noxel-account-icon__head" cx="50" cy="37" r="11" />
        <path
          className="noxel-account-icon__body"
          d="M28 74
             C28 60, 37 52, 50 52
             C63 52, 72 60, 72 74
             L72 80
             L28 80 Z"
        />
      </svg>
    </div>
  );
}


