import React from "react";

interface VisitTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  animal: string;
}

const VisitTypeSelector: React.FC<VisitTypeSelectorProps> = ({ value, onChange, animal }) => {
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

        {animal === "Dog" && (
          <button
            onClick={() => onChange("Puppy")}
            style={{
              padding: "10px 20px",
              margin: "5px",
              backgroundColor: value === "Puppy" ? "#ffa500" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Puppy
          </button>
        )}

        {animal === "Cat" && (
          <button
            onClick={() => onChange("Kitten")}
            style={{
              padding: "10px 20px",
              margin: "5px",
              backgroundColor: value === "Kitten" ? "#ffa500" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Kitten
          </button>
        )}
      </div>
    </div>
  );
};

export default VisitTypeSelector;
