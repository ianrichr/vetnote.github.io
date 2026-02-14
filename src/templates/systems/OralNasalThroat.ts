import { TemplateContext, TemplateItem, DiagnosticItem, AssessmentItem, PlanItem } from '../../types/template.types';
import { oralNasalThroatConfig } from '../../config/systemTexts';
import { 
  buildGenericObjective,
  buildGenericDiagnostics,
  buildGenericAssessment,
  buildGenericPlan
} from '../../utils/systemBuilders';

export const buildOralNasalThroatObjective = (context: TemplateContext): TemplateItem => {
  return buildGenericObjective(context, 'Oral-Nasal-Throat', oralNasalThroatConfig);
};

export const buildOralNasalThroatDiagnostics = (context: TemplateContext): DiagnosticItem[] => {
  return buildGenericDiagnostics(context, 'Oral-Nasal-Throat', oralNasalThroatConfig);
};

export const buildOralNasalThroatAssessment = (context: TemplateContext): AssessmentItem[] => {
  return buildGenericAssessment(context, 'Oral-Nasal-Throat', oralNasalThroatConfig);
};

export const buildOralNasalThroatPlan = (context: TemplateContext): PlanItem[] => {
  return buildGenericPlan(context, 'Oral-Nasal-Throat', oralNasalThroatConfig);
};