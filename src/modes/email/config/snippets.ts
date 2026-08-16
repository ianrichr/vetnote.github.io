import { EmailBlock } from '../types';

/**
 * Blocks shared across email templates. Editing one here changes every email
 * that uses it, which is the point: the greeting, the closing and the diet
 * transition schedule are identical wherever they appear.
 */

/** No client name, by request. */
export const greeting: EmailBlock = {
  kind: 'paragraph',
  text: 'Hello,',
};

/**
 * Generic food transition advice, with nothing diet-specific in it, so any
 * email that recommends a new diet can use it as-is.
 *
 * Two blocks: the introduction, then the schedule as a tight run of lines so it
 * renders directly beneath "see below:" with no blank line between.
 */
export const dietTransition: EmailBlock[] = [
  {
    kind: 'paragraph',
    text: 'I recommend slowly transitioning to the new diet - see below:',
  },
  {
    kind: 'lines',
    items: [
      'Days 1&2 - feed 1/4 new food mixed with 3/4 old food',
      'Days 3&4 - feed 1/2 new food mixed with 1/2 old food',
      'Days 5&6 - feed 3/4 new food mixed with 1/4 old food',
      'Days 7+ - feed 100% new diet',
    ],
  },
];

export const closing: EmailBlock = {
  kind: 'paragraph',
  text: 'Please let me know if you have any questions.',
};
