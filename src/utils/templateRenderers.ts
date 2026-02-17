import { TemplateItem, DiagnosticItem, AssessmentItem, PlanItem, TemplateData } from '../types/template.types';
import { templateFooter } from '../config/sectionTexts';

// Render a single template item (system)
export const renderTemplateItem = (item: TemplateItem): string => {
  if (item.type === 'normal' || item.type === 'abnormal') {
    if (item.text) {
      return `<li>${item.text}</li>`;
    }
    
    if (item.label && item.details) {
      const detailsHtml = item.details.map(detail => `<li>${detail}</li>`).join('\n      ');
      return `
          <li>${item.label}</li>
            <ul>
              ${detailsHtml}
            </ul>
          `;
    }
    
    return `<li>${item.label || ''}</li>`;
  }
  
  return '';
};

// Render diagnostic item
export const renderDiagnosticItem = (item: DiagnosticItem): string => {
  if (item.details) {
    const detailsHtml = item.details.map(detail => `<ul><li>${detail}</li></ul>`).join('\n        ');
    return `
        <li>${item.label}</li>
          ${detailsHtml}
      `;
  }
  return `<li>${item.label}</li>`;
};

// Render assessment item
export const renderAssessmentItem = (item: AssessmentItem): string => {
  return `<li>${item.condition}</li>`;
};

// Render plan item
export const renderPlanItem = (item: PlanItem): string => {
  if (item.nestedItems) {
    const nestedHtml = item.nestedItems.map(nested => `<li>${nested}</li>`).join('\n          ');
    return `
        <li>${item.text}</li>
          <ul>
            ${nestedHtml}
          </ul>
        `;
  }
  return `<li>${item.text}</li>`;
};

// Render complete template
export const renderTemplate = (data: TemplateData): string => {
  // Render objective section
  const objectiveSystemsHtml = data.objective.systems
    .map(system => renderTemplateItem(system))
    .join('\n      ');
  
  // Render diagnostics section
  const diagnosticsHtml = data.diagnostics.items.length > 0
    ? data.diagnostics.items.map(item => renderDiagnosticItem(item)).join('\n      ')
    : '<li> </li>';
  
  // Render assessment section
  const assessmentHtml = data.assessment.items
    .map(item => renderAssessmentItem(item))
    .join('\n      ');
  
  // Render plan section
  const planHtml = data.plan.items
    .map(item => renderPlanItem(item))
    .join('\n      ');
  
  return `
    <div data-testid="objective-section">
      <p><strong>OBJECTIVE</strong></p>
      <ul>
        <li>Subjective Assessment: ${data.objective.subjectiveAssessment}</li>
        <li>Ease of Examination (5/5 is the easiest): ${data.objective.easeOfExamination}</li>
        <li>Temperament: ${data.objective.temperament}</li>
        ${objectiveSystemsHtml}
      </ul>
    </div>
    <br />
    <div data-testid="diagnostics-section">
      <p><strong>DIAGNOSTICS</strong></p>
      <ul>${diagnosticsHtml}</ul>
    </div>
    <br />
    <div data-testid="assessment-section">
      <p><strong>ASSESSMENT</strong></p>
      <ul>${assessmentHtml}</ul>
    </div>
    <br />
    <div data-testid="plan-section">
      <p><strong>PLAN</strong></p>
      <ul>${planHtml}</ul>
    </div>
    <br />
    <p>${templateFooter}</p>
  `;
};
