import { TemplateContext, TemplateItem, DiagnosticItem, AssessmentItem, PlanItem } from '../../types/template.types';
import { eyesConfig } from '../../config/systemTexts';

export const buildEyesObjective = (context: TemplateContext): TemplateItem => {
  const { abnormalities } = context;
  
  if (abnormalities.includes('Eyes')) {
    return {
      type: 'abnormal',
      label: eyesConfig.abnormal.label,
      details: eyesConfig.abnormal.details,
    };
  }
  
  return {
    type: 'normal',
    text: eyesConfig.normal,
  };
};

// Helper function to walk a path and get config at that point
const getConfigAtPath = (config: any, path: string): any => {
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

// Helper to get all paths for a system (including nested)
const getAllPathsForSystem = (subOptions: Record<string, string[]>, system: string): string[] => {
  const paths: string[] = [];
  
  Object.keys(subOptions).forEach(key => {
    if (key === system || key.startsWith(`${system}>`)) {
      const selected = subOptions[key] || [];
      selected.forEach(option => {
        paths.push(`${key}>${option}`);
      });
    }
  });
  
  return paths;
};

export const buildEyesDiagnostics = (context: TemplateContext): DiagnosticItem[] => {
  const { abnormalities, subOptions } = context;
  const items: DiagnosticItem[] = [];
  
  if (abnormalities.includes('Eyes')) {
    // Get all selected paths for Eyes (including nested)
    const allPaths = getAllPathsForSystem(subOptions, 'Eyes');
    
    // For each path, check if it has diagnostics
    allPaths.forEach(path => {
      const config = getConfigAtPath(eyesConfig, path);
      if (config?.diagnostics) {
        items.push({
          label: config.diagnostics.label,
          details: config.diagnostics.details,
        });
      }
    });
  }
  
  return items;
};

export const buildEyesAssessment = (context: TemplateContext): AssessmentItem[] => {
  const { abnormalities, subOptions } = context;
  const items: AssessmentItem[] = [];
  
  if (abnormalities.includes('Eyes')) {
    // Get all selected paths for Eyes (including nested)
    const allPaths = getAllPathsForSystem(subOptions, 'Eyes');
    
    // For each path, check if it has an assessment
    allPaths.forEach(path => {
      const config = getConfigAtPath(eyesConfig, path);
      if (config?.assessment) {
        items.push({ condition: config.assessment });
      }
    });
  }
  
  return items;
};

export const buildEyesPlan = (context: TemplateContext): PlanItem[] => {
  const { abnormalities, subOptions } = context;
  const items: PlanItem[] = [];
  
  if (abnormalities.includes('Eyes')) {
    // First, add base plan items that always show when Eyes is abnormal
    if (eyesConfig.plan) {
      Object.values(eyesConfig.plan).forEach((planText: any) => {
        if (typeof planText === 'string') {
          items.push({ text: planText });
        }
      });
    }
    
    // Then add plan items from nested sub-options
    const allPaths = getAllPathsForSystem(subOptions, 'Eyes');
    
    allPaths.forEach(path => {
      const config = getConfigAtPath(eyesConfig, path);
      if (config?.plan) {
        const planItems = Array.isArray(config.plan) ? config.plan : [config.plan];
        planItems.forEach((text: string) => {
          items.push({ text });
        });
      }
    });
  }
  
  return items;
};