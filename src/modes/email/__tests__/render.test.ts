import { renderEmailBody, defaultSelectedOptionIds } from '../render';
import { ckdTemplate } from '../config/templates/ckd';
import { EMAIL_LINKS } from '../config/links';
import { EmailTemplate } from '../types';

describe('renderEmailBody', () => {
  describe('CKD template', () => {
    it('should match the veterinarian\'s email exactly', () => {
      // Transcribed from her sample, minus the one-off "thank you for your
      // patience" line. If this fails, the generated email has drifted from
      // what she sends by hand.
      const expected = [
        'Hello,',
        '',
        'As discussed over the phone, I wanted to send a follow-up email with ' +
          'additional information about chronic kidney disease and links to ' +
          'prescription kidney care diets. A kidney diet can help slow the ' +
          'progression of kidney disease in cats. Wet food is better for ' +
          'kidney health, but either wet or dry is okay. You can order the ' +
          'kidney diet from chewy.com - see the links below.',
        '',
        `${EMAIL_LINKS.chewyKidneyDietDry} Dry food`,
        '',
        `${EMAIL_LINKS.chewyKidneyDietWet} Wet food`,
        '',
        'I recommend slowly transitioning to the new diet - see below:',
        'Days 1&2 - feed 1/4 new food mixed with 3/4 old food',
        'Days 3&4 - feed 1/2 new food mixed with 1/2 old food',
        'Days 5&6 - feed 3/4 new food mixed with 1/4 old food',
        'Days 7+ - feed 100% new diet',
        '',
        'Below are links to more information on chronic kidney disease.',
        '',
        EMAIL_LINKS.vinChronicKidneyDisease,
        '',
        EMAIL_LINKS.cornellChronicKidneyDisease,
        '',
        'I recommend rechecking *** kidney values in *** months.',
        '',
        'Please let me know if you have any questions.',
        '',
      ].join('\n');

      expect(renderEmailBody(ckdTemplate, [])).toBe(expected);
    });

    it('should match snapshot', () => {
      expect(renderEmailBody(ckdTemplate, [])).toMatchSnapshot();
    });

    it('should include every hyperlink', () => {
      const output = renderEmailBody(ckdTemplate, []);

      Object.values(EMAIL_LINKS).forEach((url) => {
        expect(output).toContain(url);
      });
    });

    it('should include the recheck line as part of the base email', () => {
      expect(renderEmailBody(ckdTemplate, [])).toContain(
        'I recommend rechecking *** kidney values in *** months.'
      );
    });

    it('should not contain the one-off patience line', () => {
      expect(renderEmailBody(ckdTemplate, [])).not.toContain('patience');
    });

    it('should preserve the *** placeholders verbatim', () => {
      expect(renderEmailBody(ckdTemplate, []).match(/\*\*\*/g)).toHaveLength(2);
    });

    it('should declare no options while the Options UI is disabled', () => {
      expect(ckdTemplate.options).toBeUndefined();
      expect(defaultSelectedOptionIds(ckdTemplate)).toEqual([]);
    });
  });

  describe('formatting rules', () => {
    const template = (body: EmailTemplate['body']): EmailTemplate => ({
      id: 'test',
      label: 'Test',
      body,
    });

    it('should separate paragraphs with a blank line', () => {
      const output = renderEmailBody(
        template([
          { kind: 'paragraph', text: 'First.' },
          { kind: 'paragraph', text: 'Second.' },
        ]),
        []
      );
      expect(output).toBe('First.\n\nSecond.\n');
    });

    it('should attach a lines block to the paragraph above it', () => {
      const output = renderEmailBody(
        template([
          { kind: 'paragraph', text: 'See below:' },
          { kind: 'lines', items: ['One', 'Two'] },
        ]),
        []
      );
      expect(output).toBe('See below:\nOne\nTwo\n');
    });

    it('should render a link with no label as a bare URL', () => {
      const output = renderEmailBody(
        template([{ kind: 'link', urlId: 'vinChronicKidneyDisease' }]),
        []
      );
      expect(output).toBe(`${EMAIL_LINKS.vinChronicKidneyDisease}\n`);
    });

    it('should strip trailing whitespace from every line', () => {
      const output = renderEmailBody(
        template([
          { kind: 'paragraph', text: 'Trailing spaces here.   ' },
          { kind: 'lines', items: ['Also here.\t'] },
        ]),
        []
      );
      expect(output).toBe('Trailing spaces here.\nAlso here.\n');
    });

    it('should end with exactly one newline', () => {
      const output = renderEmailBody(
        template([{ kind: 'paragraph', text: 'Only line.' }]),
        []
      );
      expect(output).toBe('Only line.\n');
      expect(output.endsWith('\n\n')).toBe(false);
    });

    it('should never emit HTML tags', () => {
      expect(renderEmailBody(ckdTemplate, [])).not.toMatch(
        /<\/?(div|ul|li|p|strong|br)\b/i
      );
    });

    it('should render bullets with a leading dash', () => {
      const output = renderEmailBody(
        template([{ kind: 'bullets', items: ['One', 'Two'] }]),
        []
      );
      expect(output).toBe('- One\n- Two\n');
    });
  });

  // The option mechanism is unused by any current template but still supported
  // by the types and the renderer, so it is covered here against synthetic
  // templates rather than through CKD. This is what keeps it working for
  // whenever the Options UI is switched back on.
  describe('optional blocks', () => {
    const gated: EmailTemplate = {
      id: 'gated',
      label: 'Gated',
      options: [
        { id: 'extra', label: 'Extra', defaultSelected: true },
        { id: 'rare', label: 'Rare' },
      ],
      body: [
        { kind: 'paragraph', text: 'Always first.' },
        { kind: 'paragraph', optionId: 'extra', text: 'Sometimes middle.' },
        { kind: 'paragraph', text: 'Always last.' },
      ],
    };

    it('should omit a gated block when its option is not selected', () => {
      expect(renderEmailBody(gated, [])).toBe('Always first.\n\nAlways last.\n');
    });

    it('should keep a gated block in position when selected', () => {
      expect(renderEmailBody(gated, ['extra'])).toBe(
        'Always first.\n\nSometimes middle.\n\nAlways last.\n'
      );
    });

    it('should report only default-selected options as defaults', () => {
      expect(defaultSelectedOptionIds(gated)).toEqual(['extra']);
    });
  });
});
