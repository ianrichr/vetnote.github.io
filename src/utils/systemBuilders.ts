import { TemplateContext, TemplateItem, DiagnosticItem, AssessmentItem, PlanItem } from '../types/template.types';
import { allSystemConfigsList } from '../config/systemTexts';

// Helper to walk a config path and get the config at that point
export const getConfigAtPath = (config: any, path: string): any => {
  const parts = path.split('>').slice(1); // Remove system name
  let current = config;
  
  for (const part of parts) {
    if (!current?.subOptions?.[part]) {
      return null;
    }
    current = current.subOptions[part];
  }
  
  return current;
};

// Helper to get all selected paths for a system (including nested)
export const getAllPathsForSystem = (
  subOptions: Record<string, string[]>, 
  systemName: string
): string[] => {
  const paths: string[] = [];
  
  Object.keys(subOptions).forEach(key => {
    if (key === systemName || key.startsWith(`${systemName}>`)) {
      const selected = subOptions[key] || [];
      selected.forEach(option => {
        paths.push(`${key}>${option}`);
      });
    }
  });
  
  return paths;
};

// Generic Objective Builder
export const buildGenericObjective = (
  context: TemplateContext,
  systemName: string,
  config: any
): TemplateItem => {
  if (context.abnormalities.includes(systemName)) {
    // A selected sub-option may replace the objective line entirely by
    // declaring an objectiveLabel function, which receives the full context.
    // Cardiovascular uses this to put the murmur grade and side in the text.
    const selectedTopLevel = context.subOptions[systemName] || [];
    for (const option of selectedTopLevel) {
      const optionConfig = config.subOptions?.[option];
      if (typeof optionConfig?.objectiveLabel === 'function') {
        return { type: 'abnormal', text: optionConfig.objectiveLabel(context) };
      }
    }

    // Handle abnormal cases
    if (typeof config.abnormal === 'string') {
      return { type: 'abnormal', text: config.abnormal };
    }
    return {
      type: 'abnormal',
      label: config.abnormal.label,
      details: config.abnormal.details,
    };
  }
  
  // Handle normal cases
  if (typeof config.normal === 'string') {
    return { type: 'normal', text: config.normal };
  }
  
  // Handle object with visit-type variants
  let normalText: string;
  
  // Check for wellness/sick variants first
  if (context.visitType === 'Wellness' && config.normal.wellness) {
    normalText = config.normal.wellness;
  } else if (context.visitType === 'Sick' && config.normal.sick) {
    normalText = config.normal.sick;
  }
  // Then check for puppyKitten variant
  else if ((context.visitType === 'Puppy' || context.visitType === 'Kitten') && config.normal.puppyKitten) {
    normalText = config.normal.puppyKitten;
  }
  // Fall back to default
  else {
    normalText = config.normal.default || config.normal;
  }
    
  return { type: 'normal', text: normalText };
};

// Generic Diagnostics Builder
export const buildGenericDiagnostics = (
  context: TemplateContext,
  systemName: string,
  config: any
): DiagnosticItem[] => {
  const items: DiagnosticItem[] = [];
  
  if (!context.abnormalities.includes(systemName)) {
    return items;
  }
  
  // Check for base diagnostics (standardized: single object with label/details)
  if (config.diagnostics?.label) {
    items.push({ 
      label: config.diagnostics.label, 
      details: config.diagnostics.details 
    });
  }
  
  // Check sub-options for diagnostics
  if (config.subOptions) {
    const allPaths = getAllPathsForSystem(context.subOptions, systemName);
    
    allPaths.forEach(path => {
      const subConfig = getConfigAtPath(config, path);
      if (subConfig?.diagnostics) {
        items.push({
          label: subConfig.diagnostics.label,
          details: subConfig.diagnostics.details,
        });
      }
    });
  }
  
  return items;
};

// Generic Assessment Builder
export const buildGenericAssessment = (
  context: TemplateContext,
  systemName: string,
  config: any
): AssessmentItem[] => {
  const items: AssessmentItem[] = [];
  
  if (!context.abnormalities.includes(systemName)) {
    return items;
  }
  
  // Base assessment (standardized: direct string)
  if (config.assessment) {
    items.push({ condition: config.assessment });
  }
  
  // Sub-option assessments
  if (config.subOptions) {
    const allPaths = getAllPathsForSystem(context.subOptions, systemName);
    
    allPaths.forEach(path => {
      const subConfig = getConfigAtPath(config, path);
      if (subConfig?.assessment) {
        items.push({ condition: subConfig.assessment });
      }
    });
  }
  
  return items;
};

// Helper to collect planForToday items from all active abnormalities
export const collectPlanForTodayItems = (
  context: TemplateContext,
  allSystemConfigs: any[]
): string[] => {
  const items: string[] = [];
  
  allSystemConfigs.forEach(config => {
    const systemName = config.name;
    
    if (!systemName || !context.abnormalities.includes(systemName)) {
      return;
    }
    
    // Check for base-level planForToday
    if (config.planForToday) {
      items.push(config.planForToday);
    }
    
    // Check sub-options for planForToday
    if (config.subOptions) {
      const allPaths = getAllPathsForSystem(context.subOptions, systemName);
      
      allPaths.forEach(path => {
        const subConfig = getConfigAtPath(config, path);
        if (subConfig?.planForToday) {
          items.push(subConfig.planForToday);
        }
      });
    }
  });
  
  return items;
};

// Generic Plan Builder
export const buildGenericPlan = (
  context: TemplateContext,
  systemName: string,
  config: any
): PlanItem[] => {
  const items: PlanItem[] = [];
  
  if (!context.abnormalities.includes(systemName)) {
    return items;
  }
  
  // Base plan items (standardized: array of strings OR object with text/nestedItems)
  if (config.plan) {
    if (Array.isArray(config.plan)) {
      config.plan.forEach((text: string) => {
        items.push({ text });
      });
    } else if (typeof config.plan === 'object' && config.plan.text) {
      // Handle object format with nested items at base level
      items.push({
        text: config.plan.text,
        nestedItems: config.plan.nestedItems || []
      });
    } else if (typeof config.plan === 'string') {
      // Handle simple string format
      items.push({ text: config.plan });
    }
  }
  
  // Sub-option plan items
  if (config.subOptions) {
    const allPaths = getAllPathsForSystem(context.subOptions, systemName);
    
    allPaths.forEach(path => {
      const subConfig = getConfigAtPath(config, path);
      if (subConfig?.plan) {
        // Handle string format
        if (typeof subConfig.plan === 'string') {
          items.push({ text: subConfig.plan });
        } 
        // Handle object format with nested items
        else if (typeof subConfig.plan === 'object' && subConfig.plan.text) {
          items.push({
            text: subConfig.plan.text,
            nestedItems: subConfig.plan.nestedItems || []
          });
        } 
        // Handle array format
        else if (Array.isArray(subConfig.plan)) {
          subConfig.plan.forEach((text: string) => {
            items.push({ text });
          });
        }
      }
    });
  }
  
  return items;
};

// Aggregators over every registered system config.
//
// These replace the previous approach of importing one wrapper function per
// body system into each section file. That was error prone: ObjectiveSection
// and PlanSection listed all twelve systems, but AssessmentSection listed only
// four and DiagnosticsSection only three, so an assessment or diagnostic added
// to any of the remaining configs would never have appeared in the output and
// nothing would have reported an error. Iterating allSystemConfigsList makes
// the automatic discovery promised in CONFIGURATION_GUIDE.md real: registering
// a config in that list is the only wiring step.
//
// Output order follows allSystemConfigsList order, which matches the order the
// section files previously hard coded.

export const buildAllObjectives = (context: TemplateContext): TemplateItem[] =>
  allSystemConfigsList.map((config) =>
    buildGenericObjective(context, config.name, config)
  );

export const buildAllDiagnostics = (context: TemplateContext): DiagnosticItem[] =>
  allSystemConfigsList.flatMap((config) =>
    buildGenericDiagnostics(context, config.name, config)
  );

export const buildAllAssessments = (context: TemplateContext): AssessmentItem[] =>
  allSystemConfigsList.flatMap((config) =>
    buildGenericAssessment(context, config.name, config)
  );

export const buildAllPlans = (context: TemplateContext): PlanItem[] =>
  allSystemConfigsList.flatMap((config) =>
    buildGenericPlan(context, config.name, config)
  );
