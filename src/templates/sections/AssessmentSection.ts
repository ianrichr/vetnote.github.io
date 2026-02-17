import { TemplateContext, AssessmentSection, AssessmentItem } from '../../types/template.types';
import { buildOralNasalThroatAssessment } from '../systems/OralNasalThroat';
import { buildEarsAssessment } from '../systems/Ears';
import { buildEyesAssessment } from '../systems/Eyes';
import { buildCardiovascularAssessment } from '../systems/Cardiovascular';
import { assessmentConfig } from '../../config/sectionTexts';

export const buildAssessmentSection = (context: TemplateContext): AssessmentSection => {
  const items: AssessmentItem[] = [];
  
  // Check if there are any abnormalities
  const hasAbnormalities = context.abnormalities.length > 0;
  
  // Add healthy assessment if no abnormalities
  if (!hasAbnormalities) {
    let healthyText = assessmentConfig.healthy.default;
    
    if (context.visitType === 'Puppy') {
      healthyText = assessmentConfig.healthy.puppy;
    } else if (context.visitType === 'Kitten') {
      healthyText = assessmentConfig.healthy.kitten;
    }
    
    items.push({ condition: healthyText });
    return { items };
  }
  
  // Add system-specific assessments (all return arrays now)
  const oralAssessment = buildOralNasalThroatAssessment(context);
  if (oralAssessment.length > 0) {
    items.push(...oralAssessment);
  }
  
  const earsAssessment = buildEarsAssessment(context);
  if (earsAssessment.length > 0) {
    items.push(...earsAssessment);
  }
  
  const eyesAssessments = buildEyesAssessment(context);
  if (eyesAssessments.length > 0) {
    items.push(...eyesAssessments);
  }
  
  const cardiovascularAssessment = buildCardiovascularAssessment(context);
  if (cardiovascularAssessment.length > 0) {
    items.push(...cardiovascularAssessment);
  }
  
  if (items.length == 0) {
    items.push({ condition: '' });
  }

  return { items };
};