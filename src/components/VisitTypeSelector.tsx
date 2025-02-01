import React from "react";

interface VisitTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const VisitTypeSelector: React.FC<VisitTypeSelectorProps> = ({ value, onChange }) => {
  return (
    <div>
      <h2>Visit Type:</h2>
      <div>
        <button
          onClick={() => onChange("Wellness")}
          style={{
            padding: "10px 20px",
            margin: "5px",
            backgroundColor: value === "Wellness" ? "#28a745" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Wellness
        </button>
        <button
          onClick={() => onChange("Sick")}
          style={{
            padding: "10px 20px",
            margin: "5px",
            backgroundColor: value === "Sick" ? "#dc3545" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Sick
        </button>
      </div>
    </div>
  );
};

export default VisitTypeSelector;
