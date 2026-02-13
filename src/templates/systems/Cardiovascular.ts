import { TemplateContext, TemplateItem, DiagnosticItem, AssessmentItem, PlanItem } from '../../types/template.types';
import { cardiovascularConfig } from '../../config/systemTexts';

export const buildCardiovascularObjective = (context: TemplateContext): TemplateItem => {
  const { abnormalities, murmurGrade, murmurSide } = context;
  
  if (abnormalities.includes('Cardiovascular')) {
    if (abnormalities.includes('Murmur')) {
      return {
        type: 'abnormal',
        text: cardiovascularConfig.abnormal.withMurmur(murmurGrade, murmurSide),
      };
    }
    return {
      type: 'abnormal',
      text: cardiovascularConfig.abnormal.label,
    };
  }
  
  return {
    type: 'normal',
    text: cardiovascularConfig.normal,
  };
};

export const buildCardiovascularDiagnostics = (context: TemplateContext): DiagnosticItem | null => {
  // No specific diagnostics for cardiovascular in current implementation
  return null;
};

export const buildCardiovascularAssessment = (context: TemplateContext): AssessmentItem | null => {
  const { abnormalities } = context;
  
  if (abnormalities.includes('Murmur')) {
    return {
      condition: cardiovascularConfig.assessment.murmur,
    };
  }
  
  return null;
};

export const buildCardiovascularPlan = (context: TemplateContext): PlanItem[] => {
  const { abnormalities } = context;
  const items: PlanItem[] = [];
  
  if (abnormalities.includes('Murmur')) {
    items.push({ text: cardiovascularConfig.plan.murmur.discussion });
    items.push({ text: cardiovascularConfig.plan.murmur.echo });
  }
  
  return items;
};