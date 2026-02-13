import { TemplateContext, TemplateItem, DiagnosticItem, AssessmentItem, PlanItem } from '../../types/template.types';
import { oralNasalThroatConfig } from '../../config/systemTexts';

export const buildOralNasalThroatObjective = (context: TemplateContext): TemplateItem => {
  const { abnormalities, visitType } = context;
  
  if (abnormalities.includes('Oral-Nasal-Throat')) {
    return {
      type: 'abnormal',
      text: oralNasalThroatConfig.abnormal.label,
    };
  }
  
  if (visitType === 'Puppy' || visitType === 'Kitten') {
    return {
      type: 'normal',
      text: oralNasalThroatConfig.normal.puppyKitten,
    };
  }
  
  return {
    type: 'normal',
    text: oralNasalThroatConfig.normal.default,
  };
};

export const buildOralNasalThroatDiagnostics = (context: TemplateContext): DiagnosticItem | null => {
  // No specific diagnostics for oral-nasal-throat in current implementation
  return null;
};

export const buildOralNasalThroatAssessment = (context: TemplateContext): AssessmentItem | null => {
  const { abnormalities } = context;
  
  if (abnormalities.includes('Oral-Nasal-Throat')) {
    return {
      condition: oralNasalThroatConfig.assessment.condition,
    };
  }
  
  return null;
};

export const buildOralNasalThroatPlan = (context: TemplateContext): PlanItem | null => {
  const { abnormalities, visitType } = context;
  
  if (abnormalities.includes('Oral-Nasal-Throat')) {
    return {
      text: oralNasalThroatConfig.plan.abnormal,
    };
  }
  
  if (visitType === 'Wellness') {
    return {
      text: oralNasalThroatConfig.plan.wellness,
    };
  }
  
  return null;
};