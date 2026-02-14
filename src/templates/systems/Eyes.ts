import { TemplateContext, TemplateItem, DiagnosticItem, AssessmentItem, PlanItem } from '../../types/template.types';
import { eyesConfig } from '../../config/systemTexts';
import { 
  buildGenericObjective,
  buildGenericDiagnostics,
  buildGenericAssessment,
  buildGenericPlan
} from '../../utils/systemBuilders';

export const buildEyesObjective = (context: TemplateContext): TemplateItem => {
  return buildGenericObjective(context, 'Eyes', eyesConfig);
};

export const buildEyesDiagnostics = (context: TemplateContext): DiagnosticItem[] => {
  return buildGenericDiagnostics(context, 'Eyes', eyesConfig);
};

export const buildEyesAssessment = (context: TemplateContext): AssessmentItem[] => {
  return buildGenericAssessment(context, 'Eyes', eyesConfig);
};

export const buildEyesPlan = (context: TemplateContext): PlanItem[] => {
  return buildGenericPlan(context, 'Eyes', eyesConfig);
};