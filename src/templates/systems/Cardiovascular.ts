import { TemplateContext, TemplateItem, DiagnosticItem, AssessmentItem, PlanItem } from '../../types/template.types';
import { cardiovascularConfig } from '../../config/systemTexts';
import { 
  buildGenericObjective,
  buildGenericDiagnostics,
  buildGenericAssessment,
  buildGenericPlan
} from '../../utils/systemBuilders';

export const buildCardiovascularObjective = (context: TemplateContext): TemplateItem => {
  const { abnormalities, subOptions } = context;
  
  // Special handling for Murmur sub-option (requires grade and side)
  if (abnormalities.includes('Cardiovascular') && subOptions['Cardiovascular']?.includes('Murmur')) {
    const murmurConfig = cardiovascularConfig.subOptions?.['Murmur'];
    if (murmurConfig && typeof murmurConfig.objectiveLabel === 'function') {
      return {
        type: 'abnormal',
        text: murmurConfig.objectiveLabel(context.murmurGrade, context.murmurSide),
      };
    }
  }
  
  // Default generic handling
  return buildGenericObjective(context, 'Cardiovascular', cardiovascularConfig);
};

export const buildCardiovascularDiagnostics = (context: TemplateContext): DiagnosticItem[] => {
  return buildGenericDiagnostics(context, 'Cardiovascular', cardiovascularConfig);
};

export const buildCardiovascularAssessment = (context: TemplateContext): AssessmentItem[] => {
  return buildGenericAssessment(context, 'Cardiovascular', cardiovascularConfig);
};

export const buildCardiovascularPlan = (context: TemplateContext): PlanItem[] => {
  return buildGenericPlan(context, 'Cardiovascular', cardiovascularConfig);
};