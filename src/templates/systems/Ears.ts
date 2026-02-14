import { TemplateContext, TemplateItem, DiagnosticItem, AssessmentItem, PlanItem } from '../../types/template.types';
import { earsConfig } from '../../config/systemTexts';
import { 
  buildGenericObjective,
  buildGenericDiagnostics,
  buildGenericAssessment,
  buildGenericPlan
} from '../../utils/systemBuilders';

export const buildEarsObjective = (context: TemplateContext): TemplateItem => {
  return buildGenericObjective(context, 'Ears', earsConfig);
};

export const buildEarsDiagnostics = (context: TemplateContext): DiagnosticItem[] => {
  return buildGenericDiagnostics(context, 'Ears', earsConfig);
};

export const buildEarsAssessment = (context: TemplateContext): AssessmentItem[] => {
  return buildGenericAssessment(context, 'Ears', earsConfig);
};

export const buildEarsPlan = (context: TemplateContext): PlanItem[] => {
  return buildGenericPlan(context, 'Ears', earsConfig);
};