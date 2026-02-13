import { TemplateContext, TemplateItem, DiagnosticItem, AssessmentItem, PlanItem } from '../../types/template.types';
import { musculoskeletalConfig } from '../../config/systemTexts';

export const buildMusculoskeletalObjective = (context: TemplateContext): TemplateItem => {
  const { abnormalities } = context;
  
  if (abnormalities.includes('Musculoskeletal')) {
    return {
      type: 'abnormal',
      text: musculoskeletalConfig.abnormal,
    };
  }
  
  return {
    type: 'normal',
    text: musculoskeletalConfig.normal,
  };
};

export const buildMusculoskeletalDiagnostics = (context: TemplateContext): DiagnosticItem | null => {
  // No specific diagnostics for musculoskeletal in current implementation
  return null;
};

export const buildMusculoskeletalAssessment = (context: TemplateContext): AssessmentItem | null => {
  // No specific assessment for musculoskeletal in current implementation
  return null;
};

export const buildMusculoskeletalPlan = (context: TemplateContext): PlanItem | null => {
  // No specific plan items for musculoskeletal in current implementation
  return null;
};