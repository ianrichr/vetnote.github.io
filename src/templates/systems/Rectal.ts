import { TemplateContext, TemplateItem, DiagnosticItem, AssessmentItem, PlanItem } from '../../types/template.types';
import { rectalConfig } from '../../config/systemTexts';
import { 
  buildGenericObjective,
  buildGenericDiagnostics,
  buildGenericAssessment,
  buildGenericPlan
} from '../../utils/systemBuilders';

export const buildRectalObjective = (context: TemplateContext): TemplateItem => {
  return buildGenericObjective(context, 'Rectal', rectalConfig);
};

export const buildRectalDiagnostics = (context: TemplateContext): DiagnosticItem[] => {
  return buildGenericDiagnostics(context, 'Rectal', rectalConfig);
};

export const buildRectalAssessment = (context: TemplateContext): AssessmentItem[] => {
  return buildGenericAssessment(context, 'Rectal', rectalConfig);
};

export const buildRectalPlan = (context: TemplateContext): PlanItem[] => {
  return buildGenericPlan(context, 'Rectal', rectalConfig);
};