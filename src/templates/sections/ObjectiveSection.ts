import { TemplateContext, ObjectiveSection, TemplateItem } from '../../types/template.types';
import { buildOralNasalThroatObjective } from '../systems/OralNasalThroat';
import { buildEarsObjective } from '../systems/Ears';
import { buildEyesObjective } from '../systems/Eyes';
import { buildCardiovascularObjective } from '../systems/Cardiovascular';
import { buildRespiratoryObjective } from '../systems/Respiratory';
import { buildAbdominalObjective } from '../systems/Abdominal';
import { buildGenitourinaryObjective } from '../systems/Genitourinary';
import { buildMusculoskeletalObjective } from '../systems/Musculoskeletal';
import { buildIntegumentObjective } from '../systems/Integument';
import { buildLymphaticsObjective } from '../systems/Lymphatics';
import { buildNeurologicalObjective } from '../systems/Neurological';
import { buildRectalObjective } from '../systems/Rectal';

export const buildObjectiveSection = (context: TemplateContext): ObjectiveSection => {
  const systems: TemplateItem[] = [
    buildOralNasalThroatObjective(context),
    buildEarsObjective(context),
    buildEyesObjective(context),
    buildCardiovascularObjective(context),
    buildRespiratoryObjective(context),
    buildAbdominalObjective(context),
    buildGenitourinaryObjective(context),
    buildMusculoskeletalObjective(context),
    buildIntegumentObjective(context),
    buildLymphaticsObjective(context),
    buildNeurologicalObjective(context),
    buildRectalObjective(context),
  ];

  return {
    subjectiveAssessment: context.subjectiveAssessment,
    easeOfExamination: `${context.easeOfExamination}/5`,
    temperament: context.temperament,
    systems,
  };
};