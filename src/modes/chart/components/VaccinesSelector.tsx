import React from "react";

interface VaccinesSelectorProps {
  selectedOptions: string[];
  onChange: (options: string[]) => void;
}

const VaccinesSelector: React.FC<VaccinesSelectorProps> = ({ selectedOptions, onChange }) => {
  const vaccineOptions = ['FeLV'];

  const toggleOption = (option: string) => {
    const isSelected = selectedOptions.includes(option);
    if (isSelected) {
      onChange(selectedOptions.filter(item => item !== option));
    } else {
      onChange([...selectedOptions, option]);
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>Vaccines</h3>
      {vaccineOptions.map((option) => (
        <label key={option} style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={selectedOptions.includes(option)}
            onChange={() => toggleOption(option)}
          />
          <span style={{ marginLeft: "8px" }}>{option}</span>
        </label>
      ))}
    </div>
  );
};

export default VaccinesSelector;