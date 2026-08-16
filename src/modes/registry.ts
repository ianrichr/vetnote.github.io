import { TemplateMode } from './types';
import TemplateGenerator from './chart/components/TemplateGenerator';

/**
 * Every available generator, in tab order.
 */
export const MODES: TemplateMode[] = [
  {
    id: 'chart',
    label: 'Chart Note',
    Panel: TemplateGenerator,
  },
];

export const DEFAULT_MODE_ID = MODES[0].id;
