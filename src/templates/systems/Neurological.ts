import { TemplateContext, TemplateItem, DiagnosticItem, AssessmentItem, PlanItem } from '../../types/template.types';
import { neurologicalConfig } from '../../config/systemTexts';
import { 
  buildGenericObjective,
  buildGenericDiagnostics,
  buildGenericAssessment,
  buildGenericPlan
} from '../../utils/systemBuilders';

export const buildNeurologicalObjective = (context: TemplateContext): TemplateItem => {
  return buildGenericObjective(context, 'Neurological', neurologicalConfig);
};

export const buildNeurologicalDiagnostics = (context: TemplateContext): DiagnosticItem[] => {
  return buildGenericDiagnostics(context, 'Neurological', neurologicalConfig);
};

export const buildNeurologicalAssessment = (context: TemplateContext): AssessmentItem[] => {
  return buildGenericAssessment(context, 'Neurological', neurologicalConfig);
};

export const buildNeurologicalPlan = (context: TemplateContext): PlanItem[] => {
  return buildGenericPlan(context, 'Neurological', neurologicalConfig);
};