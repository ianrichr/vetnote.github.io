import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { MODES, DEFAULT_MODE_ID } from '../modes/registry';

describe('App tab shell', () => {
  it('should render one tab per registered mode', () => {
    render(<App />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(MODES.length);
  });

  it('should mark the default mode as the selected tab', () => {
    render(<App />);
    const defaultMode = MODES.find((mode) => mode.id === DEFAULT_MODE_ID)!;
    expect(screen.getByRole('tab', { name: defaultMode.label })).toHaveAttribute(
      'aria-selected',
      'true'
    );
  });

  it('should mount a panel for every mode and hide the inactive ones', () => {
    const { container } = render(<App />);

    MODES.forEach((mode) => {
      const panel = container.querySelector(`#panel-${mode.id}`);
      expect(panel).not.toBeNull();
      // Inactive panels stay in the DOM so their state survives tab switches.
      if (mode.id === DEFAULT_MODE_ID) {
        expect(panel).not.toHaveAttribute('hidden');
      } else {
        expect(panel).toHaveAttribute('hidden');
      }
    });
  });

  it('should associate each tab with its panel for assistive technology', () => {
    render(<App />);

    MODES.forEach((mode) => {
      const tab = screen.getByRole('tab', { name: mode.label });
      expect(tab).toHaveAttribute('aria-controls', `panel-${mode.id}`);
      expect(tab).toHaveAttribute('id', `tab-${mode.id}`);
    });
  });

  it('should render the chart generator inside the chart panel', () => {
    const { container } = render(<App />);
    const chartPanel = container.querySelector('#panel-chart') as HTMLElement;
    expect(
      chartPanel.querySelector('[data-testid="template-preview"]')
    ).not.toBeNull();
  });
});
