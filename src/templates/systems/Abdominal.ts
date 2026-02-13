import { TemplateContext, TemplateItem, DiagnosticItem, AssessmentItem, PlanItem } from '../../types/template.types';
import { abdominalConfig } from '../../config/systemTexts';

export const buildAbdominalObjective = (context: TemplateContext): TemplateItem => {
  const { abnormalities, visitType } = context;
  
  if (abnormalities.includes('Abdominal')) {
    return {
      type: 'abnormal',
      text: abdominalConfig.abnormal,
    };
  }
  
  if (visitType === 'Puppy' || visitType === 'Kitten') {
    return {
      type: 'normal',
      text: abdominalConfig.normal.puppyKitten,
    };
  }
  
  return {
    type: 'normal',
    text: abdominalConfig.normal.default,
  };
};

export const buildAbdominalDiagnostics = (context: TemplateContext): DiagnosticItem | null => {
  // No specific diagnostics for abdominal in current implementation
  return null;
};

export const buildAbdominalAssessment = (context: TemplateContext): AssessmentItem | null => {
  // No specific assessment for abdominal in current implementation
  return null;
};

export const buildAbdominalPlan = (context: TemplateContext): PlanItem | null => {
  // No specific plan items for abdominal in current implementation
  return null;
};