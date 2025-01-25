import React from "react";
import TemplateGenerator from "./src/components/TemplateGenerator";

const App: React.FC = () => {
  return (
    <div className="app-container">
      <h1>VetNote Generator</h1>
      <TemplateGenerator />
    </div>
  );
};

export default App;
