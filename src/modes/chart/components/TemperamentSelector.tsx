import React from "react";

interface TemperamentSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const TemperamentSelector: React.FC<TemperamentSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div>
      <h2 id="temperament-label">Temperament</h2>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        aria-labelledby="temperament-label"
      >
        <option value="Well-behaved">Well-behaved</option>
        <option value="Nervous">Nervous</option>
        <option value="Caution!">Caution!</option>
      </select>
    </div>
  );
};

export default TemperamentSelector;
