import { TemplateContext, TemplateItem, DiagnosticItem, AssessmentItem, PlanItem } from '../../types/template.types';
import { integumentConfig } from '../../config/systemTexts';
import { 
  buildGenericObjective,
  buildGenericDiagnostics,
  buildGenericAssessment,
  buildGenericPlan
} from '../../utils/systemBuilders';

export const buildIntegumentObjective = (context: TemplateContext): TemplateItem => {
  return buildGenericObjective(context, 'Integument', integumentConfig);
};

export const buildIntegumentDiagnostics = (context: TemplateContext): DiagnosticItem[] => {
  return buildGenericDiagnostics(context, 'Integument', integumentConfig);
};

export const buildIntegumentAssessment = (context: TemplateContext): AssessmentItem[] => {
  return buildGenericAssessment(context, 'Integument', integumentConfig);
};

export const buildIntegumentPlan = (context: TemplateContext): PlanItem[] => {
  return buildGenericPlan(context, 'Integument', integumentConfig);
};