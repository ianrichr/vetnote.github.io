import { TemplateContext, TemplateItem, DiagnosticItem, AssessmentItem, PlanItem } from '../../types/template.types';
import { lymphaticsConfig } from '../../config/systemTexts';
import { 
  buildGenericObjective,
  buildGenericDiagnostics,
  buildGenericAssessment,
  buildGenericPlan
} from '../../utils/systemBuilders';

export const buildLymphaticsObjective = (context: TemplateContext): TemplateItem => {
  return buildGenericObjective(context, 'Lymphatics', lymphaticsConfig);
};

export const buildLymphaticsDiagnostics = (context: TemplateContext): DiagnosticItem[] => {
  return buildGenericDiagnostics(context, 'Lymphatics', lymphaticsConfig);
};

export const buildLymphaticsAssessment = (context: TemplateContext): AssessmentItem[] => {
  return buildGenericAssessment(context, 'Lymphatics', lymphaticsConfig);
};

export const buildLymphaticsPlan = (context: TemplateContext): PlanItem[] => {
  return buildGenericPlan(context, 'Lymphatics', lymphaticsConfig);
};