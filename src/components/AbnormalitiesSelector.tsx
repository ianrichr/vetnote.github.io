import React from "react";

interface AbnormalitiesSelectorProps {
  abnormalities: string[];
  toggle: (system: string) => void;
}

const AbnormalitiesSelector: React.FC<AbnormalitiesSelectorProps> = ({
  abnormalities,
  toggle,
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
        <label key={system} style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={abnormalities.includes(system)}
            onChange={() => toggle(system)}
          />
          {system}
        </label>
      ))}
    </div>
  );
};

export default AbnormalitiesSelector;
