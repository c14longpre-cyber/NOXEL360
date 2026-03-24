type UserAvatarProps = {
  name: string;
  size?: number;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function hashString(value: string): number {
  let hash = 0;

  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }

  return Math.abs(hash);
}

function getGradient(name: string): string {
  const variants = [
    "linear-gradient(135deg,#3CDE6A,#702AA5)",
    "linear-gradient(135deg,#702AA5,#3CDE6A)",
    "linear-gradient(135deg,#3CDE6A,#1f9d57)",
    "linear-gradient(135deg,#702AA5,#9b5de5)"
  ];

  return variants[hashString(name) % variants.length];
}

export default function UserAvatar({ name, size = 36 }: UserAvatarProps) {
  const initials = getInitials(name);
  const background = getGradient(name);

  return (
    <div
      title={name}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        color: "#fff",
        fontSize: size * 0.4
      }}
    >
      {initials}
    </div>
  );
}