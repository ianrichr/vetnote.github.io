import { TemplateContext, TemplateItem, DiagnosticItem, AssessmentItem, PlanItem } from '../../types/template.types';
import { cardiovascularConfig } from '../../config/systemTexts';

export const buildCardiovascularObjective = (context: TemplateContext): TemplateItem => {
  const { abnormalities, subOptions, murmurGrade, murmurSide } = context;
  
  if (abnormalities.includes('Cardiovascular')) {
    const selectedOptions = subOptions['Cardiovascular'] || [];
    
    // Check if Murmur sub-option is selected
    if (selectedOptions.includes('Murmur')) {
      const murmurConfig = (cardiovascularConfig.subOptions as Record<string, any>)?.['Murmur'];
      if (murmurConfig?.objectiveLabel) {
        return {
          type: 'abnormal',
          text: murmurConfig.objectiveLabel(murmurGrade, murmurSide),
        };
      }
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
  const { abnormalities, subOptions } = context;
  
  if (abnormalities.includes('Cardiovascular') && cardiovascularConfig.subOptions) {
    const selectedOptions = subOptions['Cardiovascular'] || [];
    
    // Check for sub-option assessments
    for (const option of selectedOptions) {
      const config = (cardiovascularConfig.subOptions as Record<string, any>)?.[option];
      if (config?.assessment) {
        return { condition: config.assessment };
      }
    }
  }
  
  return null;
};

export const buildCardiovascularPlan = (context: TemplateContext): PlanItem[] => {
  const { abnormalities, subOptions } = context;
  const items: PlanItem[] = [];
  
  if (abnormalities.includes('Cardiovascular') && cardiovascularConfig.subOptions) {
    const selectedOptions = subOptions['Cardiovascular'] || [];
    
    // Iterate through selected sub-options and add plan items
    selectedOptions.forEach(option => {
      const config = (cardiovascularConfig.subOptions as Record<string, any>)?.[option];
      if (config?.plan) {
        // Plan can be an array of strings or a single string
        const planItems = Array.isArray(config.plan) ? config.plan : [config.plan];
        planItems.forEach((text: string) => {
          items.push({ text });
        });
      }
    });
  }
  
  return items;
};