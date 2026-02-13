import { TemplateContext, TemplateItem, DiagnosticItem, AssessmentItem, PlanItem } from '../../types/template.types';
import { rectalConfig } from '../../config/systemTexts';

export const buildRectalObjective = (context: TemplateContext): TemplateItem => {
  const { abnormalities } = context;
  
  if (abnormalities.includes('Rectal')) {
    return {
      type: 'abnormal',
      text: rectalConfig.abnormal,
    };
  }
  
  return {
    type: 'normal',
    text: rectalConfig.normal,
  };
};

export const buildRectalDiagnostics = (context: TemplateContext): DiagnosticItem | null => {
  // No specific diagnostics for rectal in current implementation
  return null;
};

export const buildRectalAssessment = (context: TemplateContext): AssessmentItem | null => {
  // No specific assessment for rectal in current implementation
  return null;
};

export const buildRectalPlan = (context: TemplateContext): PlanItem | null => {
  // No specific plan items for rectal in current implementation
  return null;
};