import React from "react";

interface AnimalSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const AnimalSelector: React.FC<AnimalSelectorProps> = ({ value, onChange }) => {
  return (
    <div>
      <h2>Animal:</h2>
      <div>
        <button
          onClick={() => onChange("Dog")}
          style={{
            padding: "10px 20px",
            margin: "5px",
            backgroundColor: value === "Dog" ? "#007bff" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Dog
        </button>
        <button
          onClick={() => onChange("Cat")}
          style={{
            padding: "10px 20px",
            margin: "5px",
            backgroundColor: value === "Cat" ? "#007bff" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Cat
        </button>
      </div>
    </div>
  );
};

export default AnimalSelector;
