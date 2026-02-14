import { TemplateContext, TemplateItem, DiagnosticItem, AssessmentItem, PlanItem } from '../../types/template.types';
import { respiratoryConfig } from '../../config/systemTexts';
import { 
  buildGenericObjective,
  buildGenericDiagnostics,
  buildGenericAssessment,
  buildGenericPlan
} from '../../utils/systemBuilders';

export const buildRespiratoryObjective = (context: TemplateContext): TemplateItem => {
  return buildGenericObjective(context, 'Respiratory', respiratoryConfig);
};

export const buildRespiratoryDiagnostics = (context: TemplateContext): DiagnosticItem[] => {
  return buildGenericDiagnostics(context, 'Respiratory', respiratoryConfig);
};

export const buildRespiratoryAssessment = (context: TemplateContext): AssessmentItem[] => {
  return buildGenericAssessment(context, 'Respiratory', respiratoryConfig);
};

export const buildRespiratoryPlan = (context: TemplateContext): PlanItem[] => {
  return buildGenericPlan(context, 'Respiratory', respiratoryConfig);
};