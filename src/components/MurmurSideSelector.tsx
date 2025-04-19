import React from "react";

interface MurmurSideSelectorProps {
  value: string | ""; // "Left-sided", "Right-sided", or null
  onChange: (value: string | "") => void;
}

const MurmurSideSelector: React.FC<MurmurSideSelectorProps> = ({ value, onChange }) => {
  const handleChange = (side: string) => {
    if (value === side) {
      onChange(""); // unselect if clicked again
    } else {
      onChange(side);
    }
  };

  return (
    <div>
      <label style={{ display: "block" }}>
        <input
          type="radio"
          name="murmur-side"
          checked={value === "Left-sided"}
          onChange={() => handleChange("Left-sided")}
        />
        Left-sided
      </label>
      <label style={{ display: "block" }}>
        <input
          type="radio"
          name="murmur-side"
          checked={value === "Right-sided"}
          onChange={() => handleChange("Right-sided")}
        />
        Right-sided
      </label>
    </div>
  );
};

export default MurmurSideSelector;
