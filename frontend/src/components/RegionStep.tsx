import React, { useState } from "react";
import RegionMap, { RegionId } from "./RegionMap";

type RegionStepProps = {
  onNext: (regionId: RegionId | null) => void;
  onCancel: () => void;
};

export default function RegionStep({ onNext, onCancel }: RegionStepProps) {
  const [selectedRegion, setSelectedRegion] = useState<RegionId | null>(null);

  const handleNext = () => {
    onNext(selectedRegion);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        paddingRight: 24,
      }}
    >
      {/* Titre + sous-titre */}
      <div>
        <h2 style={{ fontSize: "1.6rem", marginBottom: 4 }}>
          Choisissez votre région
        </h2>
        <p style={{ opacity: 0.8 }}>
          Sélectionnez une région du monde pour continuer.
        </p>
      </div>

      {/* MAP — centrée horizontalement */}
      <div
        style={{
          marginTop: 32,
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <RegionMap
          selectedRegion={selectedRegion}
          onSelectRegion={(region) => setSelectedRegion(region)}
        />
      </div>

      {/* Footer boutons */}
      <div
        style={{
          marginTop: 32,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
        }}
      >
        <button type="button" onClick={onCancel}>
          Annuler
        </button>
        <button
          type="button"
          disabled={!selectedRegion}
          onClick={handleNext}
        >
          Continuer →
        </button>
      </div>
    </div>
  );
}
