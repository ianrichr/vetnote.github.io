import { TemplateContext, DiagnosticsSection, DiagnosticItem } from '../../types/template.types';
import { getPuppyKittenDiagnostics } from '../../config/systemTexts';
import { diagnosticsConfig, vaccineConfig } from '../../config/sectionTexts';
import { buildAllDiagnostics } from '../../utils/systemBuilders';

const buildVaccineDiagnostics = (context: TemplateContext): DiagnosticItem[] => {
  const items: DiagnosticItem[] = [];

  context.vaccineOptions.forEach((vaccine) => {
    const config = vaccineConfig[vaccine as keyof typeof vaccineConfig];
    if (config?.diagnostics) {
      items.push({ label: config.diagnostics });
    }
  });

  return items;
};

export const buildDiagnosticsSection = (context: TemplateContext): DiagnosticsSection => {
  const items: DiagnosticItem[] = [];

  // Routine wellness screening, independent of any abnormality
  if (context.visitType === 'Wellness') {
    items.push({ label: diagnosticsConfig.wellness.default });

    const speciesText =
      context.animal === 'Dog'
        ? diagnosticsConfig.wellness.dog
        : diagnosticsConfig.wellness.cat;

    if (speciesText) {
      items.push({ label: speciesText });
    }

    // NOTE: vaccine diagnostics are appended again at the end of this function,
    // so a Wellness visit with a vaccine selected currently lists the same test
    // twice. Preserved here to keep this refactor output identical; fixed in the
    // following commit.
    items.push(...buildVaccineDiagnostics(context));
  }

  items.push(...buildAllDiagnostics(context));

  if (context.visitType === 'Puppy' || context.visitType === 'Kitten') {
    items.push(getPuppyKittenDiagnostics().fecal);
  }

  items.push(...buildVaccineDiagnostics(context));

  return { items };
};
