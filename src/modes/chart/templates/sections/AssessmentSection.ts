import { TemplateContext, AssessmentSection, AssessmentItem } from '../../types/template.types';
import { assessmentConfig } from '../../config/sectionTexts';
import { buildAllAssessments } from '../../utils/systemBuilders';

export const buildAssessmentSection = (context: TemplateContext): AssessmentSection => {
  const items: AssessmentItem[] = [];

  const hasAbnormalities = context.abnormalities.length > 0;

  // Add healthy assessment if no abnormalities
  if (!hasAbnormalities && context.visitType !== 'Sick') {
    let healthyText = assessmentConfig.healthy.default;

    if (context.visitType === 'Puppy') {
      healthyText = assessmentConfig.healthy.puppy;
    } else if (context.visitType === 'Kitten') {
      healthyText = assessmentConfig.healthy.kitten;
    }

    items.push({ condition: healthyText });
    return { items };
  }

  items.push(...buildAllAssessments(context));

  // Keep a single empty bullet so the section is never blank, which matters for
  // a Sick visit with no abnormalities selected yet.
  if (items.length === 0) {
    items.push({ condition: '' });
  }

  return { items };
};
