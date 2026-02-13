import React from "react";

interface EaseOfExaminationSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const EaseOfExaminationSelector: React.FC<EaseOfExaminationSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div>
      <h2 id="ease-of-examination-label">Ease of Examination</h2>
      <input
        type="range"
        min={1}
        max={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-labelledby="ease-of-examination-label"
      />
      <span>{value}/5</span>
    </div>
  );
};

export default EaseOfExaminationSelector;
