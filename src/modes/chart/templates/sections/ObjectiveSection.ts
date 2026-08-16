import { TemplateContext, ObjectiveSection } from '../../types/template.types';
import { buildAllObjectives } from '../../utils/systemBuilders';

export const buildObjectiveSection = (context: TemplateContext): ObjectiveSection => {
  return {
    subjectiveAssessment: context.subjectiveAssessment,
    easeOfExamination: `${context.easeOfExamination}/5`,
    temperament: context.temperament,
    systems: buildAllObjectives(context),
  };
};
