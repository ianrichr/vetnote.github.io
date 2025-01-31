import React from 'react';

interface AnimalSelectorProps {
  animalType: string;
  setAnimalType: (type: string) => void;
  age: string;
  setAge: (age: string) => void;
}

const AnimalSelector: React.FC<AnimalSelectorProps> = ({ animalType, setAnimalType, age, setAge }) => {
  return (
    <div className="mb-4">
      <h3 className="font-semibold">Animal Type</h3>
      <div className="flex space-x-4">
        {['Dog', 'Cat'].map((type) => (
          <button
            key={type}
            onClick={() => setAnimalType(type)}
            className={`px-4 py-2 rounded ${
              animalType === type ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <h3 className="font-semibold mt-4">Age</h3>
      <div className="flex space-x-4">
        {['Puppy/Kitten', 'Adult', 'Senior'].map((ageOption) => (
          <button
            key={ageOption}
            onClick={() => setAge(ageOption)}
            className={`px-4 py-2 rounded ${
              age === ageOption ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {ageOption}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AnimalSelector;
