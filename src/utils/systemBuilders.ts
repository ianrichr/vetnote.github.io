import { TemplateContext, TemplateItem, DiagnosticItem, AssessmentItem, PlanItem } from '../types/template.types';

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
  
  // Handle object with puppyKitten variant
  const normalText = context.visitType === 'Puppy' || context.visitType === 'Kitten'
    ? config.normal.puppyKitten || config.normal.default
    : config.normal.default || config.normal;
    
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
