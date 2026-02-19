import { TemplateContext, PlanSection, PlanItem } from '../../types/template.types';
import { buildOralNasalThroatPlan } from '../systems/OralNasalThroat';
import { buildEarsPlan } from '../systems/Ears';
import { buildEyesPlan } from '../systems/Eyes';
import { buildCardiovascularPlan } from '../systems/Cardiovascular';
import { buildRespiratoryPlan } from '../systems/Respiratory';
import { buildAbdominalPlan } from '../systems/Abdominal';
import { buildGenitourinaryPlan } from '../systems/Genitourinary';
import { buildMusculoskeletalPlan } from '../systems/Musculoskeletal';
import { buildIntegumentPlan } from '../systems/Integument';
import { buildLymphaticsPlan } from '../systems/Lymphatics';
import { buildNeurologicalPlan } from '../systems/Neurological';
import { buildRectalPlan } from '../systems/Rectal';
import { planConfig, dietConfig, vaccineConfig } from '../../config/sectionTexts';
import { allSystemConfigsList } from '../../config/systemTexts';
import { collectPlanForTodayItems } from '../../utils/systemBuilders';

export const buildPlanSection = (context: TemplateContext): PlanSection => {
  const items: PlanItem[] = [];
  
  // Add PE findings discussion
  items.push({ text: getPEFindingsText(context) });
  
  // Add system-specific plan items (all return arrays now)
  const oralPlan = buildOralNasalThroatPlan(context);
  if (oralPlan.length > 0) {
    items.push(...oralPlan);
  }
  
  const earsPlan = buildEarsPlan(context);
  if (earsPlan.length > 0) {
    items.push(...earsPlan);
  }
  
  const eyesPlan = buildEyesPlan(context);
  if (eyesPlan.length > 0) {
    items.push(...eyesPlan);
  }
  
  const cardiovascularPlan = buildCardiovascularPlan(context);
  if (cardiovascularPlan.length > 0) {
    items.push(...cardiovascularPlan);
  }
  
  const respiratoryPlan = buildRespiratoryPlan(context);
  if (respiratoryPlan.length > 0) {
    items.push(...respiratoryPlan);
  }
  
  const abdominalPlan = buildAbdominalPlan(context);
  if (abdominalPlan.length > 0) {
    items.push(...abdominalPlan);
  }
  
  const genitourinaryPlan = buildGenitourinaryPlan(context);
  if (genitourinaryPlan.length > 0) {
    items.push(...genitourinaryPlan);
  }
  
  const musculoskeletalPlan = buildMusculoskeletalPlan(context);
  if (musculoskeletalPlan.length > 0) {
    items.push(...musculoskeletalPlan);
  }
  
  const integumentPlan = buildIntegumentPlan(context);
  if (integumentPlan.length > 0) {
    items.push(...integumentPlan);
  }
  
  const lymphaticsPlan = buildLymphaticsPlan(context);
  if (lymphaticsPlan.length > 0) {
    items.push(...lymphaticsPlan);
  }
  
  const neurologicalPlan = buildNeurologicalPlan(context);
  if (neurologicalPlan.length > 0) {
    items.push(...neurologicalPlan);
  }
  
  const rectalPlan = buildRectalPlan(context);
  if (rectalPlan.length > 0) {
    items.push(...rectalPlan);
  }
  
  // Add visit-type specific plan items
  items.push(...getVisitSpecificPlanItems(context));
  
  // Add diet plan items
  context.dietOptions.forEach(diet => {
    const config = dietConfig[diet as keyof typeof dietConfig];
    if (config?.plan) {
      items.push({ text: config.plan });
    }
  });
  
  // Add vaccine plan items
  context.vaccineOptions.forEach(vaccine => {
    const config = vaccineConfig[vaccine as keyof typeof vaccineConfig];
    if (config?.plan) {
      if (Array.isArray(config.plan)) {
        config.plan.forEach(text => items.push({ text }));
      } else {
        items.push({ text: config.plan });
      }
    }
  });
  
  // Add plan for today and owner agreement
  const etiologiesText = getEtiologiesText(context);
  if (etiologiesText) {
    items.push({ text: etiologiesText });
  }

  // Collect planForToday items from system configs
  const planForTodayItems = collectPlanForTodayItems(context, allSystemConfigsList);
  
  // Build nestedItems array: system items first, then VOHC for wellness
  const nestedItems: string[] = [...planForTodayItems];
  if (context.visitType === 'Wellness') {
    nestedItems.push('VOHC handout provided to owner');
  }
  
  // If no items collected, add empty placeholder
  if (nestedItems.length === 0) {
    nestedItems.push(' ');
  }
  
  items.push({ text: getPlanForTodayText(context), nestedItems });
  items.push({ text: getOwnerAgreesText(context) });
  
  return { items };
};

const getPEFindingsText = (context: TemplateContext): string => {
  switch (context.visitType) {
    case 'Wellness':
      return context.animal === 'Dog' 
        ? planConfig.wellness.dog.peFindings
        : planConfig.wellness.cat.peFindings;
    case 'Sick':
      return planConfig.sick.common.peFindings;
    case 'Puppy':
      return planConfig.puppy.peFindings;
    case 'Kitten':
      return planConfig.kitten.peFindings;
  }
};

const getVisitSpecificPlanItems = (context: TemplateContext): PlanItem[] => {
  const items: PlanItem[] = [];
  
  if (context.visitType === 'Wellness' && context.animal === 'Dog') {
    items.push({text: planConfig.wellness.dog.dentalHealth});
    items.push({ text: planConfig.wellness.dog.parasite });
    items.push({ text: planConfig.wellness.dog.activity });
    items.push({ text: planConfig.wellness.dog.vaccines });
  } else if (context.visitType === 'Wellness' && context.animal === 'Cat') {
    items.push({text: planConfig.wellness.cat.dentalHealth});
    items.push({ text: planConfig.wellness.cat.indoorOutdoor });
    items.push({ text: planConfig.wellness.cat.parasite });
    items.push({ text: planConfig.wellness.cat.activity });
    items.push({ text: planConfig.wellness.cat.vaccines });
  } else if (context.visitType === 'Puppy') {
    items.push({ text: planConfig.puppy.diet });
    items.push({ text: planConfig.puppy.parasite });
    items.push({ text: planConfig.puppy.training });
    items.push({ text: planConfig.puppy.toxins });
    items.push({ text: planConfig.puppy.vaccines });
    items.push({ text: planConfig.puppy.neutering });
  } else if (context.visitType === 'Kitten') {
    items.push({ text: planConfig.kitten.diet });
    items.push({ text: planConfig.kitten.parasite });
    items.push({ text: planConfig.kitten.enrichment });
    items.push({ text: planConfig.kitten.toxins });
    items.push({ text: planConfig.kitten.vaccines });
    items.push({ text: planConfig.kitten.neutering });
  }
  
  return items;
};

const getEtiologiesText = (context: TemplateContext): string => {
  if (context.visitType === 'Sick') {
    return planConfig.sick.common.etiologies;
  }
  return '';
};

const getPlanForTodayText = (context: TemplateContext): string => {
  switch (context.visitType) {
    case 'Wellness':
      return context.animal === 'Dog' 
        ? planConfig.wellness.dog.planForToday
        : planConfig.wellness.cat.planForToday;
    case 'Sick':
      return planConfig.sick.common.planForToday;
    case 'Puppy':
      return planConfig.puppy.planForToday;
    case 'Kitten':
      return planConfig.kitten.planForToday;
  }
};

const getOwnerAgreesText = (context: TemplateContext): string => {
  switch (context.visitType) {
    case 'Wellness':
      return context.animal === 'Dog' 
        ? planConfig.wellness.dog.ownerAgrees
        : planConfig.wellness.cat.ownerAgrees;
    case 'Sick':
      return planConfig.sick.common.ownerAgrees;
    case 'Puppy':
      return planConfig.puppy.ownerAgrees;
    case 'Kitten':
      return planConfig.kitten.ownerAgrees;
  }
};
