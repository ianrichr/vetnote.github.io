import { TemplateContext, TemplateItem, DiagnosticItem, AssessmentItem, PlanItem } from '../../types/template.types';
import { earsConfig } from '../../config/systemTexts';

export const buildEarsObjective = (context: TemplateContext): TemplateItem => {
  const { abnormalities } = context;
  
  if (abnormalities.includes('Ears')) {
    return {
      type: 'abnormal',
      label: earsConfig.abnormal.label,
      details: earsConfig.abnormal.details,
    };
  }
  
  return {
    type: 'normal',
    text: earsConfig.normal,
  };
};

export const buildEarsDiagnostics = (context: TemplateContext): DiagnosticItem | null => {
  const { abnormalities } = context;
  
  if (abnormalities.includes('Ears')) {
    return {
      label: earsConfig.diagnostics.cytology.label,
      details: earsConfig.diagnostics.cytology.details,
    };
  }
  
  return null;
};

export const buildEarsAssessment = (context: TemplateContext): AssessmentItem | null => {
  const { abnormalities } = context;
  
  if (abnormalities.includes('Ears')) {
    return {
      condition: earsConfig.assessment.condition,
    };
  }
  
  return null;
};

export const buildEarsPlan = (context: TemplateContext): PlanItem[] => {
  const { abnormalities } = context;
  const items: PlanItem[] = [];
  
  if (abnormalities.includes('Ears')) {
    items.push({ text: earsConfig.plan.discussion });
    items.push({ text: earsConfig.plan.allergies });
  }
  
  return items;
};