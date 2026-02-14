import { TemplateContext, TemplateItem, DiagnosticItem, AssessmentItem, PlanItem } from '../../types/template.types';
import { musculoskeletalConfig } from '../../config/systemTexts';
import { 
  buildGenericObjective,
  buildGenericDiagnostics,
  buildGenericAssessment,
  buildGenericPlan
} from '../../utils/systemBuilders';

export const buildMusculoskeletalObjective = (context: TemplateContext): TemplateItem => {
  return buildGenericObjective(context, 'Musculoskeletal', musculoskeletalConfig);
};

export const buildMusculoskeletalDiagnostics = (context: TemplateContext): DiagnosticItem[] => {
  return buildGenericDiagnostics(context, 'Musculoskeletal', musculoskeletalConfig);
};

export const buildMusculoskeletalAssessment = (context: TemplateContext): AssessmentItem[] => {
  return buildGenericAssessment(context, 'Musculoskeletal', musculoskeletalConfig);
};

export const buildMusculoskeletalPlan = (context: TemplateContext): PlanItem[] => {
  return buildGenericPlan(context, 'Musculoskeletal', musculoskeletalConfig);
};