import React from "react";

interface MurmurGradeSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const MurmurGradeSelector: React.FC<MurmurGradeSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div>
      <label id="murmur-grade-label">Murmur Grade: </label>
      <input
        type="range"
        min={1}
        max={6}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-labelledby="murmur-grade-label"
      />
      <span>{value}/6</span>
    </div>
  );
};

export default MurmurGradeSelector;
