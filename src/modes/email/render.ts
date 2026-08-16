import { EmailBlock, EmailTemplate } from './types';
import { resolveLink } from './config/links';

/**
 * Turns a template plus the user's option selections into plain text.
 *
 * This pipeline is string-native and never produces HTML. That is deliberate:
 * the *** placeholders and any future angle-bracket markers would be silently
 * swallowed if this output were ever assigned to innerHTML.
 */

const renderBlockLines = (block: EmailBlock): string[] => {
  switch (block.kind) {
    case 'paragraph':
      return [block.text];
    case 'lines':
      return [...block.items];
    case 'link': {
      const url = resolveLink(block.urlId);
      return [block.label ? `${url} ${block.label}` : url];
    }
    case 'bullets':
      return block.items.map((item) => `- ${item}`);
  }
};

/** Blocks with no optionId always render; the rest need their option selected. */
export const selectVisibleBlocks = (
  template: EmailTemplate,
  selectedOptionIds: string[]
): EmailBlock[] =>
  template.body.filter(
    (block) => !block.optionId || selectedOptionIds.includes(block.optionId)
  );

export const renderEmailBody = (
  template: EmailTemplate,
  selectedOptionIds: string[]
): string => {
  const lines: string[] = [];

  selectVisibleBlocks(template, selectedOptionIds).forEach((block) => {
    // A blank line separates blocks, except a 'lines' block, which belongs to
    // the block above it.
    if (lines.length > 0 && block.kind !== 'lines') {
      lines.push('');
    }
    lines.push(...renderBlockLines(block));
  });

  return (
    lines
      // Trailing spaces are invisible noise that survives copy and paste
      .map((line) => line.replace(/[ \t]+$/, ''))
      .join('\n') + '\n'
  );
};

/** Option ids that start out selected for a given template. */
export const defaultSelectedOptionIds = (template: EmailTemplate): string[] =>
  (template.options ?? [])
    .filter((option) => option.defaultSelected)
    .map((option) => option.id);
