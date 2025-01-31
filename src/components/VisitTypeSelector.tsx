import React from 'react';

interface VisitTypeSelectorProps {
  visitType: string;
  setVisitType: (type: string) => void;
}

const VisitTypeSelector: React.FC<VisitTypeSelectorProps> = ({ visitType, setVisitType }) => {
  return (
    <div className="mb-4">
      <h3 className="font-semibold">Visit Type</h3>
      <div className="flex space-x-4">
        {['Wellness', 'Sick'].map((type) => (
          <button
            key={type}
            onClick={() => setVisitType(type)}
            className={`px-4 py-2 rounded ${
              visitType === type ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VisitTypeSelector;
