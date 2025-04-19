import React, { useState } from "react";
import MurmurGradeSelector from "./MurmurGradeSelector";
import MurmurSideSelector from "./MurmurSideSelector";


interface AbnormalitiesSelectorProps {
  abnormalities: string[];
  toggle: (system: string) => void;
  murmurGrade: number;
  setMurmurGrade: (grade: number) => void;
  murmurSide: string;
  setMurmurSide: (side: string) => void;
}

const AbnormalitiesSelector: React.FC<AbnormalitiesSelectorProps> = ({
  abnormalities,
  toggle,
  murmurGrade,
  setMurmurGrade,
  murmurSide,
  setMurmurSide,
}) => {
  const systems = [
    "Oral-Nasal-Throat",
    "Ears",
    "Eyes",
    "Cardiovascular",
    "Respiratory",
    "Abdominal",
    "Genitourinary",
    "Musculoskeletal",
    "Integument",
    "Lymphatics",
    "Neurological",
    "Rectal",
  ];

  return (
    <div>
      <h2>Abnormalities</h2>
      {systems.map((system) => (
        <div key={system}>
          <label style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={abnormalities.includes(system)}
              onChange={() => toggle(system)}
            />
            {system}
          </label>

          {system === "Cardiovascular" && abnormalities.includes("Cardiovascular") && (
            <div style={{ marginLeft: "1.5em" }}>
              <label style={{ display: "block" }}>
                <input
                  type="checkbox"
                  checked={abnormalities.includes("Murmur")}
                  onChange={() => toggle("Murmur")}
                />
                Murmur
              </label>

              {abnormalities.includes("Murmur") && (
                <div style={{ marginLeft: "1.5em" }}>
                  <MurmurGradeSelector value={murmurGrade} onChange={setMurmurGrade} />
                  <MurmurSideSelector value={murmurSide} onChange={setMurmurSide} />
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AbnormalitiesSelector;
