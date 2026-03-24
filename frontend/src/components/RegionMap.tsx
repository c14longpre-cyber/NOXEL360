import React from 'react';

type RegionMapProps = {
  selectedRegion?: string | null;
  onSelect?: (region: string) => void;
};

const regions = ['North', 'South', 'East', 'West', 'Central']; // Remplace par tes régions

export default function RegionMap({ selectedRegion, onSelect }: RegionMapProps) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {regions.map((region) => (
        <button
          key={region}
          onClick={() => onSelect?.(region)}
          style={{
            padding: '8px 12px',
            borderRadius: '4px',
            border: region === selectedRegion ? '2px solid #3CDE6A' : '1px solid #ccc',
            background: region === selectedRegion ? '#E6F9F0' : '#f9f9f9',
            cursor: 'pointer',
          }}
        >
          {region}
        </button>
      ))}
    </div>
  );
}