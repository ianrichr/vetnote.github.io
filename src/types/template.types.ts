// Core types for the template system

export type AnimalType = 'Dog' | 'Cat';

export type VisitType = 'Wellness' | 'Sick' | 'Puppy' | 'Kitten';

export type SubjectiveAssessment = 'BAR' | 'QAR';

export type SystemName =
  | 'Oral-Nasal-Throat'
  | 'Ears'
  | 'Eyes'
  | 'Cardiovascular'
  | 'Respiratory'
  | 'Abdominal'
  | 'Genitourinary'
  | 'Musculoskeletal'
  | 'Integument'
  | 'Lymphatics'
  | 'Neurological'
  | 'Rectal';

export type MurmurSide = 'left' | 'right' | 'bilateral' | '';

// Context passed to template builders
export interface TemplateContext {
  animal: AnimalType;
  visitType: VisitType;
  subjectiveAssessment: SubjectiveAssessment;
  easeOfExamination: number;
  temperament: string;
  abnormalities: string[];
  // Path-based sub-options supporting infinite nesting
  // Examples: { 'Eyes': ['IOP'], 'Eyes>IOP': ['Glaucoma'], 'Eyes>Fluorescein>Ulcer': ['Deep'] }
  subOptions: Record<string, string[]>;
  // Special parameters for specific sub-options
  murmurGrade: number;
  murmurSide: MurmurSide;
}

// Structured template item types
export interface TemplateItem {
  type: 'normal' | 'abnormal' | 'detail';
  text?: string;
  label?: string;
  details?: string[];
  nestedItems?: TemplateItem[];
}

export interface DiagnosticItem {
  label: string;
  details?: string[];
}

export interface AssessmentItem {
  condition: string;
}

export interface PlanItem {
  text: string;
  nestedItems?: string[];
}

// Section builder return types
export interface ObjectiveSection {
  subjectiveAssessment: string;
  easeOfExamination: string;
  temperament: string;
  systems: TemplateItem[];
}

export interface DiagnosticsSection {
  items: DiagnosticItem[];
}

export interface AssessmentSection {
  items: AssessmentItem[];
}

export interface PlanSection {
  items: PlanItem[];
}

export interface TemplateData {
  objective: ObjectiveSection;
  diagnostics: DiagnosticsSection;
  assessment: AssessmentSection;
  plan: PlanSection;
}