import { TemplateContext, TemplateData } from '../types/template.types';
import { buildObjectiveSection } from './sections/ObjectiveSection';
import { buildDiagnosticsSection } from './sections/DiagnosticsSection';
import { buildAssessmentSection } from './sections/AssessmentSection';
import { buildPlanSection } from './sections/PlanSection';
import { renderTemplate } from '../utils/templateRenderers';

/**
 * Main template generator that orchestrates all sections
 * @param context The template context containing all user selections
 * @returns HTML string of the complete template
 */
export const generateTemplate = (context: TemplateContext): string => {
  // Build structured data for each section
  const templateData: TemplateData = {
    objective: buildObjectiveSection(context),
    diagnostics: buildDiagnosticsSection(context),
    assessment: buildAssessmentSection(context),
    plan: buildPlanSection(context),
  };
  
  // Render the structured data to HTML
  return renderTemplate(templateData);
};