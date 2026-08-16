import React, { useState } from 'react';
import { MODES, DEFAULT_MODE_ID } from './modes/registry';

function App() {
  const [activeModeId, setActiveModeId] = useState(DEFAULT_MODE_ID);

  return (
    <div className="App">
      <div className="app-container">
        <h1>VetNote Generator</h1>

        <div role="tablist" aria-label="Generator mode" className="mode-tabs">
          {MODES.map((mode) => {
            const isActive = mode.id === activeModeId;
            return (
              <button
                key={mode.id}
                role="tab"
                id={`tab-${mode.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${mode.id}`}
                onClick={() => setActiveModeId(mode.id)}
                className={isActive ? 'mode-tab mode-tab-active' : 'mode-tab'}
              >
                {mode.label}
              </button>
            );
          })}
        </div>

        {/*
          Every panel stays mounted and inactive ones are hidden, so a partly
          filled email survives a trip to the chart tab and back. Unmounting
          would discard that state, and lifting it into App would put every
          mode's inputs in one component for no benefit.
        */}
        {MODES.map((mode) => (
          <div
            key={mode.id}
            role="tabpanel"
            id={`panel-${mode.id}`}
            aria-labelledby={`tab-${mode.id}`}
            hidden={mode.id !== activeModeId}
          >
            <mode.Panel />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
