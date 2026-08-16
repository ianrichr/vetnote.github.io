import { EmailTemplate } from '../../types';
import { ckdTemplate } from './ckd';

/**
 * Every email template, in the order they appear in the picker.
 *
 * To add one, create a file in this directory and append it here. No UI or
 * renderer change is needed.
 */
export const EMAIL_TEMPLATES: EmailTemplate[] = [ckdTemplate];

export const DEFAULT_EMAIL_TEMPLATE_ID = EMAIL_TEMPLATES[0].id;
