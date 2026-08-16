import React from 'react';

/**
 * A generator mode is a self-contained panel with its own inputs, preview and
 * copy behavior. Modes share nothing but the tab shell that hosts them, which
 * is deliberate: the chart note and the client email have no inputs and no text
 * in common, so a shared context or renderer would only couple them.
 *
 * To add a mode, implement a panel component and append an entry to MODES in
 * registry.ts. Nothing else needs to change.
 */
export interface TemplateMode {
  /** Stable identifier, used for element ids and the active-tab state. */
  id: string;
  /** Text shown on the tab. */
  label: string;
  /** Panel component. Owns all of its own state. */
  Panel: React.ComponentType;
}
