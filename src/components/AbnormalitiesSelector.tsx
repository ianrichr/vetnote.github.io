import React from "react";
import MurmurGradeSelector from "./MurmurGradeSelector";
import MurmurSideSelector from "./MurmurSideSelector";
import { eyesConfig, cardiovascularConfig } from "../config/systemTexts";

interface AbnormalitiesSelectorProps {
  abnormalities: string[];
  toggle: (system: string) => void;
  subOptions: Record<string, string[]>;
  toggleSubOption: (parentPath: string, option: string) => void;
  murmurGrade: number;
  setMurmurGrade: (grade: number) => void;
  murmurSide: string;
  setMurmurSide: (side: string) => void;
}

// Map of system names to their configs
const systemConfigs: Record<string, any> = {
  'Eyes': eyesConfig,
  'Cardiovascular': cardiovascularConfig,
};

const AbnormalitiesSelector: React.FC<AbnormalitiesSelectorProps> = ({
  abnormalities,
  toggle,
  subOptions,
  toggleSubOption,
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

  // Recursive sub-option renderer - supports infinite nesting
  const renderSubOptions = (
    parentPath: string,
    config: any,
    depth: number = 0
  ): React.ReactNode => {
    if (!config?.subOptions) {
      return null;
    }

    const selectedSubOptions = subOptions[parentPath] || [];
    const subOptionKeys = Object.keys(config.subOptions);

    if (subOptionKeys.length === 0) {
      return null;
    }

    return (
      <div style={{ marginLeft: "1.5em" }}>
        {subOptionKeys.map((option: string) => {
          const optionConfig = config.subOptions[option];
          const isSelected = selectedSubOptions.includes(option);
          const currentPath = `${parentPath}>${option}`;
          
          return (
            <div key={option}>
              <label style={{ display: "block" }}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSubOption(parentPath, option)}
                />
                {option}
              </label>

              {/* Special handling for Murmur - requires grade and side */}
              {parentPath === "Cardiovascular" && 
               option === "Murmur" && 
               isSelected && (
                <div style={{ marginLeft: "1.5em" }}>
                  <MurmurGradeSelector value={murmurGrade} onChange={setMurmurGrade} />
                  <MurmurSideSelector value={murmurSide} onChange={setMurmurSide} />
                </div>
              )}

              {/* Recursively render nested sub-options if this option is selected */}
              {isSelected && optionConfig?.subOptions && 
                renderSubOptions(currentPath, optionConfig, depth + 1)
              }
            </div>
          );
        })}
      </div>
    );
  };

  // Top-level system renderer
  const renderSystemSubOptions = (system: string) => {
    const config = systemConfigs[system];
    if (!config?.subOptions || !abnormalities.includes(system)) {
      return null;
    }

    return renderSubOptions(system, config, 0);
  };

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

          {/* Recursive sub-options rendering */}
          {renderSystemSubOptions(system)}
        </div>
      ))}
    </div>
  );
};

export default AbnormalitiesSelector;