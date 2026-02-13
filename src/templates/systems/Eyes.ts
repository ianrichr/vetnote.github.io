import { TemplateContext, TemplateItem, DiagnosticItem, AssessmentItem, PlanItem } from '../../types/template.types';
import { eyesConfig } from '../../config/systemTexts';

export const buildEyesObjective = (context: TemplateContext): TemplateItem => {
  const { abnormalities } = context;
  
  if (abnormalities.includes('Eyes')) {
    return {
      type: 'abnormal',
      label: eyesConfig.abnormal.label,
      details: eyesConfig.abnormal.details,
    };
  }
  
  return {
    type: 'normal',
    text: eyesConfig.normal,
  };
};

export const buildEyesDiagnostics = (context: TemplateContext): DiagnosticItem[] => {
  const { abnormalities } = context;
  const items: DiagnosticItem[] = [];
  
  if (abnormalities.includes('Eyes')) {
    items.push({
      label: eyesConfig.diagnostics.fluorescein.label,
      details: eyesConfig.diagnostics.fluorescein.details,
    });
    items.push({
      label: eyesConfig.diagnostics.schirmer.label,
      details: eyesConfig.diagnostics.schirmer.details,
    });
  }
  
  return items;
};

export const buildEyesAssessment = (context: TemplateContext): AssessmentItem[] => {
  const { abnormalities } = context;
  const items: AssessmentItem[] = [];
  
  if (abnormalities.includes('Eyes')) {
    eyesConfig.assessment.conditions.forEach(condition => {
      items.push({ condition });
    });
  }
  
  return items;
};

export const buildEyesPlan = (context: TemplateContext): PlanItem[] => {
  const { abnormalities } = context;
  const items: PlanItem[] = [];
  
  if (abnormalities.includes('Eyes')) {
    items.push({ text: eyesConfig.plan.discussion });
    items.push({ text: eyesConfig.plan.schirmer });
  }
  
  return items;
};