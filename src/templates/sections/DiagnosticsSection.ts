import { TemplateContext, DiagnosticsSection, DiagnosticItem } from '../../types/template.types';
import { buildEarsDiagnostics } from '../systems/Ears';
import { buildEyesDiagnostics } from '../systems/Eyes';
import { buildIntegumentDiagnostics } from '../systems/Integument';
import { getPuppyKittenDiagnostics } from '../../config/systemTexts';
import { diagnosticsConfig, vaccineConfig } from '../../config/sectionTexts';

export const buildDiagnosticsSection = (context: TemplateContext): DiagnosticsSection => {
  const items: DiagnosticItem[] = [];
  
  // Add healthy diagnositic text if no abnormalities
  if (context.visitType === 'Wellness') {
    let defaultDiagosticText = diagnosticsConfig.wellness.default;
    let dogDiagnosticText = diagnosticsConfig.wellness.dog;
    let catDiagnosticText = diagnosticsConfig.wellness.cat;
    
    items.push({ label: defaultDiagosticText });

    if (context.animal === 'Dog' && dogDiagnosticText) {
      items.push({ label: dogDiagnosticText });
    } else if (context.animal === 'Cat' && catDiagnosticText) {
      items.push({ label: catDiagnosticText });
    }
    
    // Add vaccine diagnostics even for wellness with no abnormalities
    context.vaccineOptions.forEach(vaccine => {
      const config = vaccineConfig[vaccine as keyof typeof vaccineConfig];
      if (config?.diagnostics) {
        items.push({ label: config.diagnostics });
      }
    });
  }
  
  // Ears diagnostics (returns array now)
  const earsDiagnostics = buildEarsDiagnostics(context);
  if (earsDiagnostics.length > 0) {
    items.push(...earsDiagnostics);
  }
  
  // Eyes diagnostics
  const eyesDiagnostics = buildEyesDiagnostics(context);
  if (eyesDiagnostics.length > 0) {
    items.push(...eyesDiagnostics);
  }
  
  // Integument diagnostics
  const integumentDiagnostics = buildIntegumentDiagnostics(context);
  if (integumentDiagnostics.length > 0) {
    items.push(...integumentDiagnostics);
  }
  
  // Puppy/Kitten diagnostics
  if (context.visitType === 'Puppy' || context.visitType === 'Kitten') {
    const puppyKittenDiag = getPuppyKittenDiagnostics();
    items.push(puppyKittenDiag.fecal);
  }
  
  // Vaccine diagnostics
  context.vaccineOptions.forEach(vaccine => {
    const config = vaccineConfig[vaccine as keyof typeof vaccineConfig];
    if (config?.diagnostics) {
      items.push({ label: config.diagnostics });
    }
  });
  
  return { items };
};
