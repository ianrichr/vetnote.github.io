import { TemplateMode } from './types';
import TemplateGenerator from './chart/components/TemplateGenerator';
import EmailPanel from './email/components/EmailPanel';

/**
 * Every available generator, in tab order.
 */
export const MODES: TemplateMode[] = [
  {
    id: 'chart',
    label: 'Chart Note',
    Panel: TemplateGenerator,
  },
  {
    id: 'email',
    label: 'Client Email',
    Panel: EmailPanel,
  },
];

export const DEFAULT_MODE_ID = MODES[0].id;
