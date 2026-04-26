export type NexusSubdivision = {
  code: string;
  name: string;
};

type Props = {
  countryIso2?: string | null;
  subdivisions?: NexusSubdivision[];
  value?: NexusSubdivision | null;
  onAccept?: (item: NexusSubdivision | null) => void;
  onDecline?: () => void;
};

export default function NexusSubdivisionSelect({
  subdivisions = [],
  onAccept,
  onDecline,
}: Props) {
  if (!subdivisions.length) return null;

  return (
    <div style={{ marginTop: 16 }}>
      <select
        onChange={(e) => {
          const item = subdivisions.find((s) => s.code === e.target.value) ?? null;
          onAccept?.(item);
        }}
      >
        <option value="">Select subdivision</option>
        {subdivisions.map((s) => (
          <option key={s.code} value={s.code}>
            {s.name}
          </option>
        ))}
      </select>

      <button type="button" onClick={onDecline}>
        Clear
      </button>
    </div>
  );
}
