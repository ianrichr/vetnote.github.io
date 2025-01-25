import React from "react";

interface SubjectiveAssessmentSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const SubjectiveAssessmentSelector: React.FC<SubjectiveAssessmentSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div>
      <h2>Subjective Assessment</h2>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="BAR">BAR</option>
        <option value="ADR">ADR</option>
      </select>
    </div>
  );
};

export default SubjectiveAssessmentSelector;
