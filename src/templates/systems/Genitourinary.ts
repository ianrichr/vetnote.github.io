import { TemplateContext, TemplateItem, DiagnosticItem, AssessmentItem, PlanItem } from '../../types/template.types';
import { genitourinaryConfig } from '../../config/systemTexts';
import { 
  buildGenericObjective,
  buildGenericDiagnostics,
  buildGenericAssessment,
  buildGenericPlan
} from '../../utils/systemBuilders';

export const buildGenitourinaryObjective = (context: TemplateContext): TemplateItem => {
  return buildGenericObjective(context, 'Genitourinary', genitourinaryConfig);
};

export const buildGenitourinaryDiagnostics = (context: TemplateContext): DiagnosticItem[] => {
  return buildGenericDiagnostics(context, 'Genitourinary', genitourinaryConfig);
};

export const buildGenitourinaryAssessment = (context: TemplateContext): AssessmentItem[] => {
  return buildGenericAssessment(context, 'Genitourinary', genitourinaryConfig);
};

export const buildGenitourinaryPlan = (context: TemplateContext): PlanItem[] => {
  return buildGenericPlan(context, 'Genitourinary', genitourinaryConfig);
};