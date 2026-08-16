import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EmailPanel from '../components/EmailPanel';
import App from '../../../App';

describe('EmailPanel', () => {
  const preview = (container: HTMLElement): HTMLTextAreaElement =>
    container.querySelector('[data-testid="email-preview"]') as HTMLTextAreaElement;

  it('should render the default template into the preview', () => {
    const { container } = render(<EmailPanel />);
    expect(preview(container).value).toContain('chronic kidney disease');
  });

  it('should render a button per email template', () => {
    render(<EmailPanel />);
    expect(screen.getByRole('button', { name: 'CKD' })).toBeInTheDocument();
  });

  it('should include the recheck line without needing a selection', () => {
    const { container } = render(<EmailPanel />);
    expect(preview(container).value).toContain(
      'I recommend rechecking *** kidney values in *** months.'
    );
  });

  it('should not render an Options section while it is disabled', () => {
    render(<EmailPanel />);
    expect(screen.queryByText('Options')).toBeNull();
    expect(screen.queryByRole('checkbox')).toBeNull();
  });

  it('should keep manual edits rather than regenerating over them', () => {
    const { container } = render(<EmailPanel />);
    const textarea = preview(container);

    fireEvent.change(textarea, { target: { value: 'HAND WRITTEN EMAIL' } });

    expect(textarea.value).toBe('HAND WRITTEN EMAIL');
  });

  it('should show the notice only after an edit and clear it on discard', () => {
    const { container } = render(<EmailPanel />);
    expect(
      container.querySelector('[data-testid="email-manual-edits-notice"]')
    ).toBeNull();

    fireEvent.change(preview(container), { target: { value: 'HAND WRITTEN EMAIL' } });
    expect(
      container.querySelector('[data-testid="email-manual-edits-notice"]')
    ).not.toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /Discard edits and regenerate/i }));

    expect(
      container.querySelector('[data-testid="email-manual-edits-notice"]')
    ).toBeNull();
    expect(preview(container).value).toContain('chronic kidney disease');
  });

  it('should copy the email as plain text', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    const { container } = render(<EmailPanel />);
    fireEvent.click(screen.getByRole('button', { name: /Copy Email/i }));

    expect(writeText).toHaveBeenCalledWith(preview(container).value);
  });
});

describe('Mode switching', () => {
  it('should show both generators as tabs', () => {
    render(<App />);
    expect(screen.getByRole('tab', { name: 'Chart Note' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Client Email' })).toBeInTheDocument();
  });

  it('should switch the visible panel when a tab is clicked', () => {
    const { container } = render(<App />);

    expect(container.querySelector('#panel-email')).toHaveAttribute('hidden');

    fireEvent.click(screen.getByRole('tab', { name: 'Client Email' }));

    expect(container.querySelector('#panel-email')).not.toHaveAttribute('hidden');
    expect(container.querySelector('#panel-chart')).toHaveAttribute('hidden');
  });

  it('should preserve each panel state across a tab switch', () => {
    const { container } = render(<App />);

    fireEvent.click(screen.getByRole('tab', { name: 'Client Email' }));
    const textarea = container.querySelector(
      '[data-testid="email-preview"]'
    ) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'DRAFT IN PROGRESS' } });

    fireEvent.click(screen.getByRole('tab', { name: 'Chart Note' }));
    fireEvent.click(screen.getByRole('tab', { name: 'Client Email' }));

    expect(
      (container.querySelector('[data-testid="email-preview"]') as HTMLTextAreaElement)
        .value
    ).toBe('DRAFT IN PROGRESS');
  });
});
