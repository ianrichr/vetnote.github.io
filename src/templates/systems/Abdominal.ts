import { TemplateContext, TemplateItem, DiagnosticItem, AssessmentItem, PlanItem } from '../../types/template.types';
import { abdominalConfig } from '../../config/systemTexts';
import { 
  buildGenericObjective,
  buildGenericDiagnostics,
  buildGenericAssessment,
  buildGenericPlan
} from '../../utils/systemBuilders';

export const buildAbdominalObjective = (context: TemplateContext): TemplateItem => {
  return buildGenericObjective(context, 'Abdominal', abdominalConfig);
};

export const buildAbdominalDiagnostics = (context: TemplateContext): DiagnosticItem[] => {
  return buildGenericDiagnostics(context, 'Abdominal', abdominalConfig);
};

export const buildAbdominalAssessment = (context: TemplateContext): AssessmentItem[] => {
  return buildGenericAssessment(context, 'Abdominal', abdominalConfig);
};

export const buildAbdominalPlan = (context: TemplateContext): PlanItem[] => {
  return buildGenericPlan(context, 'Abdominal', abdominalConfig);
};