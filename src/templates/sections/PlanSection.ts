import { TemplateContext, PlanSection, PlanItem } from '../../types/template.types';
import { planConfig, dietConfig, vaccineConfig } from '../../config/sectionTexts';
import { allSystemConfigsList } from '../../config/systemTexts';
import { buildAllPlans, collectPlanForTodayItems } from '../../utils/systemBuilders';

export const buildPlanSection = (context: TemplateContext): PlanSection => {
  const items: PlanItem[] = [];

  items.push({ text: getPEFindingsText(context) });

  // Every body system, in allSystemConfigsList order
  items.push(...buildAllPlans(context));

  items.push(...getVisitSpecificPlanItems(context));

  context.dietOptions.forEach((diet) => {
    const config = dietConfig[diet as keyof typeof dietConfig];
    if (config?.plan) {
      items.push({ text: config.plan });
    }
  });

  context.vaccineOptions.forEach((vaccine) => {
    const config = vaccineConfig[vaccine as keyof typeof vaccineConfig];
    if (!config?.plan) {
      return;
    }
    if (Array.isArray(config.plan)) {
      config.plan.forEach((text) => items.push({ text }));
    } else {
      items.push({ text: config.plan });
    }
  });

  const etiologiesText = getEtiologiesText(context);
  if (etiologiesText) {
    items.push({ text: etiologiesText });
  }

  // "Plan for today" gathers sub-bullets contributed by system configs
  const nestedItems: string[] = [...collectPlanForTodayItems(context, allSystemConfigsList)];
  if (context.visitType === 'Wellness') {
    nestedItems.push('VOHC handout provided to owner');
  }
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
    items.push({ text: planConfig.wellness.dog.dentalHealth });
    items.push({ text: planConfig.wellness.dog.parasite });
    items.push({ text: planConfig.wellness.dog.activity });
    items.push({ text: planConfig.wellness.dog.vaccines });
  } else if (context.visitType === 'Wellness' && context.animal === 'Cat') {
    items.push({ text: planConfig.wellness.cat.dentalHealth });
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
  return context.visitType === 'Sick' ? planConfig.sick.common.etiologies : '';
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
