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
      <input
        type="range"
        min={1}
        max={6}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span>{value}/6</span>
    </div>
  );
};

export default MurmurGradeSelector;
