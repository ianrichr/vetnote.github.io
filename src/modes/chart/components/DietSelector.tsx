import React from "react";

interface DietSelectorProps {
  selectedOptions: string[];
  onChange: (options: string[]) => void;
}

const DietSelector: React.FC<DietSelectorProps> = ({ selectedOptions, onChange }) => {
  const dietOptions = ['Grain free diet', 'Raw diet'];

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
      <h3>Diet</h3>
      {dietOptions.map((option) => (
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

export default DietSelector;