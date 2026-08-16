import { EmailLinkId } from './config/links';

/**
 * A block is one unit of email content. Blocks are rendered in the order they
 * appear in a template's body.
 *
 * A block carries an optional optionId. When present, the block is only
 * rendered if the user has selected the matching option, which lets an optional
 * paragraph sit in the middle of an email rather than only at the end.
 */
export interface EmailBlockBase {
  optionId?: string;
}

export type EmailBlock = EmailBlockBase &
  (
    | // Prose. Separated from its neighbours by a blank line.
    { kind: 'paragraph'; text: string }
    | // A tight run of literal lines with no blank lines between them, which
    // attaches directly to the block above. Used for the diet transition
    // schedule, where a blank line after "see below:" would look wrong.
    { kind: 'lines'; items: string[] }
    | // A bare URL on its own line, with an optional label after it. Email
    // clients linkify plain URLs, so no markup is needed. The URL is
    // referenced by id and resolved from config/links.ts, so a link that dies
    // is fixed in one place.
    { kind: 'link'; urlId: EmailLinkId; label?: string }
    | { kind: 'bullets'; items: string[] }
  );

/**
 * A toggleable piece of an email. Declaring it here is what makes its checkbox
 * appear; blocks reference it by id.
 */
export interface EmailOption {
  id: string;
  label: string;
  /** Checked on first load. Use for content that is usually wanted. */
  defaultSelected?: boolean;
}

export interface EmailTemplate {
  /** Stable id, used for state keys. */
  id: string;
  /** Text shown in the template picker, for example "CKD". */
  label: string;
  /**
   * Optional subject line. No sample email has one yet, so this is unused; it
   * exists so adding one later does not require a type change.
   */
  subject?: string;
  options?: EmailOption[];
  body: EmailBlock[];
}
