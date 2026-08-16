import { EmailTemplate } from '../../types';
import { greeting, dietTransition, closing } from '../snippets';

/**
 * Chronic kidney disease follow-up. Transcribed from the veterinarian's own
 * email, so the wording is hers rather than a rewrite.
 */
export const ckdTemplate: EmailTemplate = {
  id: 'ckd',
  label: 'CKD',

  // Optional blocks are not needed yet, so no options are declared and the
  // Options UI in EmailPanel is commented out. The mechanism is still in the
  // types and the renderer. To bring it back, declare options here, add an
  // optionId to the blocks they gate, and restore the UI.
  //
  // options: [
  //   {
  //     id: 'recheck',
  //     label: 'Include recheck recommendation',
  //     defaultSelected: true,
  //   },
  // ],

  body: [
    greeting,
    {
      kind: 'paragraph',
      text:
        'As discussed over the phone, I wanted to send a follow-up email with ' +
        'additional information about chronic kidney disease and links to ' +
        'prescription kidney care diets. A kidney diet can help slow the ' +
        'progression of kidney disease in cats. Wet food is better for kidney ' +
        'health, but either wet or dry is okay. You can order the kidney diet ' +
        'from chewy.com - see the links below.',
    },
    { kind: 'link', urlId: 'chewyKidneyDietDry', label: 'Dry food' },
    { kind: 'link', urlId: 'chewyKidneyDietWet', label: 'Wet food' },
    ...dietTransition,
    {
      kind: 'paragraph',
      text: 'Below are links to more information on chronic kidney disease.',
    },
    { kind: 'link', urlId: 'vinChronicKidneyDisease' },
    { kind: 'link', urlId: 'cornellChronicKidneyDisease' },
    {
      kind: 'paragraph',
      text: 'I recommend rechecking *** kidney values in *** months.',
    },
    closing,
  ],
};
