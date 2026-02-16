import { TemplateContext, DiagnosticsSection, DiagnosticItem } from '../../types/template.types';
import { buildEarsDiagnostics } from '../systems/Ears';
import { buildEyesDiagnostics } from '../systems/Eyes';
import { getPuppyKittenDiagnostics } from '../../config/systemTexts';
import { diagnosticsConfig } from '../../config/sectionTexts';

export const buildDiagnosticsSection = (context: TemplateContext): DiagnosticsSection => {
  const items: DiagnosticItem[] = [];

  // Check if there are any abnormalities
  const hasAbnormalities = context.abnormalities.length > 0;
  
  // Add healthy diagnositic text if no abnormalities
  if (!hasAbnormalities && context.visitType != "Sick") {
    let defaultDiagosticText = diagnosticsConfig.wellness.default;
    let dogDiagnosticText = diagnosticsConfig.wellness.dog;
    let catDiagnosticText = diagnosticsConfig.wellness.cat
    items.push({ label: defaultDiagosticText });

    if (context.animal === 'Dog' && dogDiagnosticText) {
      items.push({ label: dogDiagnosticText });
    } else if (context.animal === 'Cat' && catDiagnosticText) {
      items.push({ label: catDiagnosticText });
    }
    
    return { items };
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
  
  // Puppy/Kitten diagnostics
  if (context.visitType === 'Puppy' || context.visitType === 'Kitten') {
    const puppyKittenDiag = getPuppyKittenDiagnostics();
    items.push(puppyKittenDiag.fecal);
  }
  
  return { items };
};