import { TemplateContext, DiagnosticsSection, DiagnosticItem } from '../../types/template.types';
import { buildEarsDiagnostics } from '../systems/Ears';
import { buildEyesDiagnostics } from '../systems/Eyes';
import { getPuppyKittenDiagnostics } from '../../config/systemTexts';

export const buildDiagnosticsSection = (context: TemplateContext): DiagnosticsSection => {
  const items: DiagnosticItem[] = [];
  
  // Ears diagnostics
  const earsDiagnostics = buildEarsDiagnostics(context);
  if (earsDiagnostics) {
    items.push(earsDiagnostics);
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