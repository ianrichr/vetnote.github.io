import { TemplateContext, PlanSection, PlanItem } from '../../types/template.types';
import { buildOralNasalThroatPlan } from '../systems/OralNasalThroat';
import { buildEarsPlan } from '../systems/Ears';
import { buildEyesPlan } from '../systems/Eyes';
import { buildCardiovascularPlan } from '../systems/Cardiovascular';
import { planConfig } from '../../config/sectionTexts';

export const buildPlanSection = (context: TemplateContext): PlanSection => {
  const items: PlanItem[] = [];
  
  // Add PE findings discussion
  items.push({ text: getPEFindingsText(context) });
  
  // Add system-specific plan items
  const oralPlan = buildOralNasalThroatPlan(context);
  if (oralPlan) {
    items.push(oralPlan);
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
  
  // Add visit-type specific plan items
  items.push(...getVisitSpecificPlanItems(context));
  
  // Add plan for today and owner agreement
  items.push({ text: getPlanForTodayText(context), nestedItems: [' '] });
  items.push({ text: getOwnerAgreesText(context) });
  
  return { items };
};

const getPEFindingsText = (context: TemplateContext): string => {
  if (context.visitType === 'Wellness' && context.animal === 'Dog') {
    return planConfig.wellness.dog.peFindings;
  }
  if (context.visitType === 'Wellness' && context.animal === 'Cat') {
    return planConfig.wellness.cat.peFindings;
  }
  if (context.visitType === 'Sick') {
    return planConfig.sick.common.peFindings;
  }
  if (context.visitType === 'Puppy') {
    return planConfig.puppy.peFindings;
  }
  if (context.visitType === 'Kitten') {
    return planConfig.kitten.peFindings;
  }
  return planConfig.wellness.dog.peFindings;
};

const getVisitSpecificPlanItems = (context: TemplateContext): PlanItem[] => {
  const items: PlanItem[] = [];
  
  if (context.visitType === 'Wellness' && context.animal === 'Dog') {
    items.push({ text: planConfig.wellness.dog.diet });
    items.push({ text: planConfig.wellness.dog.parasite });
    items.push({ text: planConfig.wellness.dog.activity });
    items.push({ text: planConfig.wellness.dog.vaccines });
  } else if (context.visitType === 'Wellness' && context.animal === 'Cat') {
    items.push({ text: planConfig.wellness.cat.diet });
    items.push({ text: planConfig.wellness.cat.indoorOutdoor });
    items.push({ text: planConfig.wellness.cat.parasite });
    items.push({ text: planConfig.wellness.cat.activity });
    items.push({ text: planConfig.wellness.cat.vaccines });
    items.push({ text: planConfig.wellness.cat.felvVaccine });
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

const getPlanForTodayText = (context: TemplateContext): string => {
  if (context.visitType === 'Wellness' && context.animal === 'Dog') {
    return planConfig.wellness.dog.planForToday;
  }
  if (context.visitType === 'Wellness' && context.animal === 'Cat') {
    return planConfig.wellness.cat.planForToday;
  }
  if (context.visitType === 'Sick') {
    return planConfig.sick.common.planForToday;
  }
  if (context.visitType === 'Puppy') {
    return planConfig.puppy.planForToday;
  }
  if (context.visitType === 'Kitten') {
    return planConfig.kitten.planForToday;
  }
  return planConfig.wellness.dog.planForToday;
};

const getOwnerAgreesText = (context: TemplateContext): string => {
  if (context.visitType === 'Wellness' && context.animal === 'Dog') {
    return planConfig.wellness.dog.ownerAgrees;
  }
  if (context.visitType === 'Wellness' && context.animal === 'Cat') {
    return planConfig.wellness.cat.ownerAgrees;
  }
  if (context.visitType === 'Sick') {
    return planConfig.sick.common.ownerAgrees;
  }
  if (context.visitType === 'Puppy') {
    return planConfig.puppy.ownerAgrees;
  }
  if (context.visitType === 'Kitten') {
    return planConfig.kitten.ownerAgrees;
  }
  return planConfig.wellness.dog.ownerAgrees;
};