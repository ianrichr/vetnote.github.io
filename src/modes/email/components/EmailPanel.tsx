import React, { useMemo, useState } from 'react';
import {
  EMAIL_TEMPLATES,
  DEFAULT_EMAIL_TEMPLATE_ID,
} from '../config/templates';
import { renderEmailBody, defaultSelectedOptionIds } from '../render';
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard';

const EmailPanel: React.FC = () => {
  const [templateId, setTemplateId] = useState(DEFAULT_EMAIL_TEMPLATE_ID);

  // Optional blocks are not in use yet, so selections come straight from each
  // template's declared defaults. The per-template state below is kept in
  // commented form because it is the piece to restore alongside the Options UI
  // further down, and it is what makes selections survive switching templates.
  //
  // const [optionsByTemplate, setOptionsByTemplate] = useState<Record<string, string[]>>(
  //   () =>
  //     Object.fromEntries(
  //       EMAIL_TEMPLATES.map((template) => [
  //         template.id,
  //         defaultSelectedOptionIds(template),
  //       ])
  //     )
  // );

  // Non-null once the user types in the preview, at which point regeneration
  // stops so their edits are not destroyed. Same rule as the chart panel.
  const [editedBody, setEditedBody] = useState<string | null>(null);

  const { copySuccess, copyPlainText } = useCopyToClipboard();

  const template = EMAIL_TEMPLATES.find((item) => item.id === templateId)!;

  const selectedOptions = useMemo(
    () => defaultSelectedOptionIds(template),
    [template]
  );

  const generatedBody = useMemo(
    () => renderEmailBody(template, selectedOptions),
    [template, selectedOptions]
  );

  const body = editedBody ?? generatedBody;

  // const toggleOption = (optionId: string) => {
  //   setOptionsByTemplate((previous) => {
  //     const current = previous[templateId] ?? [];
  //     return {
  //       ...previous,
  //       [templateId]: current.includes(optionId)
  //         ? current.filter((id) => id !== optionId)
  //         : [...current, optionId],
  //     };
  //   });
  // };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
      <div style={{ width: '40%' }}>
        <h2>Email Type:</h2>
        <div>
          {EMAIL_TEMPLATES.map((item) => (
            <button
              key={item.id}
              onClick={() => setTemplateId(item.id)}
              aria-pressed={item.id === templateId}
              style={{
                padding: '10px 20px',
                margin: '5px',
                backgroundColor: item.id === templateId ? '#007bff' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/*
          Options UI, disabled until a template needs a toggle. Restore this
          together with the optionsByTemplate state and toggleOption above.

          {template.options && template.options.length > 0 && (
            <>
              <h2>Options</h2>
              {template.options.map((option) => (
                <label key={option.id} style={{ display: 'block' }}>
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(option.id)}
                    onChange={() => toggleOption(option.id)}
                  />
                  {option.label}
                </label>
              ))}
            </>
          )}
        */}
      </div>

      <div style={{ width: '55%', textAlign: 'left' }}>
        <h2>Generated Email</h2>
        <textarea
          data-testid="email-preview"
          aria-label="Generated email"
          value={body}
          onChange={(event) => setEditedBody(event.target.value)}
          spellCheck
          style={{
            width: '100%',
            minHeight: '400px',
            fontFamily: 'Arial',
            fontSize: '10pt',
            border: '1px solid #ccc',
            padding: '10px',
            borderRadius: '5px',
          }}
        />
        {editedBody !== null && (
          <div
            data-testid="email-manual-edits-notice"
            style={{
              marginTop: '10px',
              padding: '10px',
              border: '1px solid #ffa500',
              borderRadius: '5px',
              backgroundColor: '#fff8e6',
            }}
          >
            <span>
              You have edited this email by hand, so it is no longer updating
              automatically. New selections will not appear until you discard
              your edits.
            </span>
            <button
              onClick={() => setEditedBody(null)}
              style={{ marginLeft: '10px', padding: '5px 10px', cursor: 'pointer' }}
            >
              Discard edits and regenerate
            </button>
          </div>
        )}
        <div style={{ marginTop: '10px' }}>
          <button
            onClick={() => copyPlainText(body)}
            style={{ padding: '10px 20px', fontSize: '16px' }}
          >
            Copy Email
          </button>
          {copySuccess && (
            <span style={{ marginLeft: '10px', color: 'green', fontWeight: 'bold' }}>
              Copied!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailPanel;
