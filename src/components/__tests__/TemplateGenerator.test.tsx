import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import TemplateGenerator from '../TemplateGenerator';

describe('TemplateGenerator - Comprehensive Tests', () => {
  // Helper function to extract HTML content from the generated template
  const getGeneratedTemplate = (container: HTMLElement): string => {
    const templateDiv = container.querySelector('[contenteditable="true"]');
    return templateDiv?.innerHTML || '';
  };

  // Helper to get specific section content
  const getSection = (container: HTMLElement, testId: string): HTMLElement | null => {
    const templateDiv = container.querySelector('[contenteditable="true"]');
    return templateDiv?.querySelector(`[data-testid="${testId}"]`) || null;
  };

  // Helper to set up a template with specific selections
  const setupTemplate = (container: HTMLElement, options: {
    animal?: string;
    visitType?: string;
    subjectiveAssessment?: string;
    easeOfExamination?: number;
    temperament?: string;
    abnormalities?: string[];
    murmurGrade?: number;
    murmurSide?: string;
    dietOptions?: string[];
    vaccineOptions?: string[];
  }) => {
    if (options.animal) {
      // Find all buttons with this name and click the first one (Animal selector)
      const buttons = screen.getAllByRole('button', { name: options.animal });
      fireEvent.click(buttons[0]);
    }

    if (options.visitType) {
      // Find all buttons with this name and click the first one (Visit Type selector)
      const buttons = screen.getAllByRole('button', { name: options.visitType });
      fireEvent.click(buttons[0]);
    }

    if (options.subjectiveAssessment) {
      const assessmentSelect = screen.getByRole('combobox', { name: /Subjective Assessment/i });
      fireEvent.change(assessmentSelect, { target: { value: options.subjectiveAssessment } });
    }

    if (options.easeOfExamination !== undefined) {
      const easeSlider = screen.getByRole('slider', { name: /Ease of Examination/i });
      fireEvent.change(easeSlider, { target: { value: options.easeOfExamination.toString() } });
    }

    if (options.temperament) {
      const temperamentSelect = screen.getByRole('combobox', { name: /Temperament/i });
      fireEvent.change(temperamentSelect, { target: { value: options.temperament } });
    }

    if (options.abnormalities) {
      options.abnormalities.forEach(abnormality => {
        const checkbox = screen.getByLabelText(abnormality);
        fireEvent.click(checkbox);
      });
    }

    if (options.murmurGrade !== undefined && options.abnormalities?.includes('Cardiovascular')) {
      const murmurCheckbox = screen.getByLabelText('Murmur');
      fireEvent.click(murmurCheckbox);
      
      const murmurGradeSlider = screen.getByRole('slider', { name: /Murmur Grade/i });
      fireEvent.change(murmurGradeSlider, { target: { value: options.murmurGrade.toString() } });
    }

    if (options.dietOptions) {
      options.dietOptions.forEach(diet => {
        // Use getAllByLabelText and click the first one to handle multiple renders
        const checkboxes = screen.getAllByLabelText(diet);
        fireEvent.click(checkboxes[0]);
      });
    }

    if (options.vaccineOptions) {
      options.vaccineOptions.forEach(vaccine => {
        // Use getAllByLabelText and click the first one to handle multiple renders
        const checkboxes = screen.getAllByLabelText(vaccine);
        fireEvent.click(checkboxes[0]);
      });
    }
  };

  describe('Snapshot Tests - Golden Paths', () => {
    it('should match snapshot for healthy dog wellness visit', () => {
      const { container } = render(<TemplateGenerator />);
      const template = getGeneratedTemplate(container);
      expect(template).toMatchSnapshot();
    });

    it('should match snapshot for healthy cat wellness visit', () => {
      const { container } = render(<TemplateGenerator />);
      setupTemplate(container, { animal: 'Cat', visitType: 'Wellness' });
      const template = getGeneratedTemplate(container);
      expect(template).toMatchSnapshot();
    });

    it('should match snapshot for puppy visit', () => {
      const { container } = render(<TemplateGenerator />);
      setupTemplate(container, { animal: 'Dog', visitType: 'Puppy' });
      const template = getGeneratedTemplate(container);
      expect(template).toMatchSnapshot();
    });

    it('should match snapshot for kitten visit', () => {
      const { container } = render(<TemplateGenerator />);
      setupTemplate(container, { animal: 'Cat', visitType: 'Kitten' });
      const template = getGeneratedTemplate(container);
      expect(template).toMatchSnapshot();
    });

    it('should match snapshot for sick visit', () => {
      const { container } = render(<TemplateGenerator />);
      setupTemplate(container, { animal: 'Dog', visitType: 'Sick' });
      const template = getGeneratedTemplate(container);
      expect(template).toMatchSnapshot();
    });
  });

  describe('Section-Based Verification', () => {
    it('should place ear abnormality content in correct sections', () => {
      const { container } = render(<TemplateGenerator />);
      setupTemplate(container, { abnormalities: ['Ears'] });

      const objectiveSection = getSection(container, 'objective-section');
      const diagnosticsSection = getSection(container, 'diagnostics-section');
      const assessmentSection = getSection(container, 'assessment-section');
      const planSection = getSection(container, 'plan-section');

      expect(objectiveSection?.innerHTML).toContain('Ears: Abnormal');
      expect(diagnosticsSection?.innerHTML).toContain('Ear cytology');
      expect(assessmentSection?.innerHTML).toContain('Otitis externa');
      expect(planSection?.innerHTML).toContain('Discussed with owner otitis externa');
    });

    it('should place murmur content in correct sections', () => {
      const { container } = render(<TemplateGenerator />);
      setupTemplate(container, {
        abnormalities: ['Cardiovascular'],
        murmurGrade: 4
      });

      const objectiveSection = getSection(container, 'objective-section');
      const assessmentSection = getSection(container, 'assessment-section');
      const planSection = getSection(container, 'plan-section');

      expect(objectiveSection?.innerHTML).toContain('grade 4/6');
      expect(assessmentSection?.innerHTML).toContain('Heart murmur');
      expect(planSection?.innerHTML).toContain('echocardiogram');
    });
  });

  describe('Diet Options - Behavior Tests', () => {
    it('should add grain free diet text to plan when checked', () => {
      const { container } = render(<TemplateGenerator />);
      
      let planSection = getSection(container, 'plan-section');
      expect(planSection?.innerHTML).not.toContain('grain free diets and heart disease');

      setupTemplate(container, { dietOptions: ['Grain free diet'] });
      
      planSection = getSection(container, 'plan-section');
      expect(planSection?.innerHTML).toContain('Discussed risks with grain free diets and heart disease. Do not recommend.');
    });

    it('should add raw diet text to plan when checked', () => {
      const { container } = render(<TemplateGenerator />);
      
      let planSection = getSection(container, 'plan-section');
      expect(planSection?.innerHTML).not.toContain('salmonella and e. Coli');

      setupTemplate(container, { dietOptions: ['Raw diet'] });
      
      planSection = getSection(container, 'plan-section');
      expect(planSection?.innerHTML).toContain('Discussed raw diets and risks with salmonella and e. Coli, including risks to owner.');
    });

    it('should handle multiple diet options together', () => {
      const { container } = render(<TemplateGenerator />);
      setupTemplate(container, { dietOptions: ['Grain free diet', 'Raw diet'] });
      
      const planSection = getSection(container, 'plan-section');
      expect(planSection?.innerHTML).toContain('grain free diets and heart disease');
      expect(planSection?.innerHTML).toContain('salmonella and e. Coli');
    });

    it('should remove diet text when unchecked', () => {
      const { container } = render(<TemplateGenerator />);
      setupTemplate(container, { dietOptions: ['Grain free diet'] });
      
      let planSection = getSection(container, 'plan-section');
      expect(planSection?.innerHTML).toContain('grain free diets');

      // Uncheck it
      const checkbox = screen.getByLabelText('Grain free diet');
      fireEvent.click(checkbox);
      
      planSection = getSection(container, 'plan-section');
      expect(planSection?.innerHTML).not.toContain('grain free diets');
    });
  });

  describe('FeLV Vaccine - Behavior Tests', () => {
    it('should add FeLV to diagnostics when checked', () => {
      const { container } = render(<TemplateGenerator />);
      
      let diagnosticsSection = getSection(container, 'diagnostics-section');
      expect(diagnosticsSection?.innerHTML).not.toContain('FIV/FeLV test');

      setupTemplate(container, { vaccineOptions: ['FeLV'] });
      
      diagnosticsSection = getSection(container, 'diagnostics-section');
      expect(diagnosticsSection?.innerHTML).toContain('FIV/FeLV test - ');
    });

    it('should add two FeLV items to plan when checked', () => {
      const { container } = render(<TemplateGenerator />);
      setupTemplate(container, { vaccineOptions: ['FeLV'] });
      
      const planSection = getSection(container, 'plan-section');
      expect(planSection?.innerHTML).toContain('Discussed risks associated with FIV/FeLV and avian influenza with the owner.');
      expect(planSection?.innerHTML).toContain('Discussed FeLV vaccine - recommended for cats with outdoor exposure. Recommend FIV/FeLV test today + FeLV series.');
    });

    it('should work in wellness visit with no abnormalities', () => {
      const { container } = render(<TemplateGenerator />);
      setupTemplate(container, {
        animal: 'Dog',
        visitType: 'Wellness',
        vaccineOptions: ['FeLV']
      });
      
      const diagnosticsSection = getSection(container, 'diagnostics-section');
      expect(diagnosticsSection?.innerHTML).toContain('FIV/FeLV test');
    });

    it('should work in sick visit', () => {
      const { container } = render(<TemplateGenerator />);
      setupTemplate(container, {
        animal: 'Dog',
        visitType: 'Sick',
        vaccineOptions: ['FeLV']
      });
      
      const diagnosticsSection = getSection(container, 'diagnostics-section');
      expect(diagnosticsSection?.innerHTML).toContain('FIV/FeLV test');
    });

    it('should remove FeLV content when unchecked', () => {
      const { container } = render(<TemplateGenerator />);
      setupTemplate(container, { vaccineOptions: ['FeLV'] });
      
      let diagnosticsSection = getSection(container, 'diagnostics-section');
      expect(diagnosticsSection?.innerHTML).toContain('FIV/FeLV test');

      // Uncheck it
      const checkbox = screen.getByLabelText('FeLV');
      fireEvent.click(checkbox);
      
      diagnosticsSection = getSection(container, 'diagnostics-section');
      expect(diagnosticsSection?.innerHTML).not.toContain('FIV/FeLV test');
    });
  });

  describe('Edge Cases - Combined Features', () => {
    it('should handle diet + vaccines + abnormalities all together', () => {
      const { container } = render(<TemplateGenerator />);
      setupTemplate(container, {
        abnormalities: ['Ears', 'Eyes'],
        dietOptions: ['Grain free diet', 'Raw diet'],
        vaccineOptions: ['FeLV']
      });

      const objectiveSection = getSection(container, 'objective-section');
      const diagnosticsSection = getSection(container, 'diagnostics-section');
      const planSection = getSection(container, 'plan-section');

      // Abnormalities
      expect(objectiveSection?.innerHTML).toContain('Ears: Abnormal');
      expect(objectiveSection?.innerHTML).toContain('Eyes: Abnormal');
      
      // Diagnostics
      expect(diagnosticsSection?.innerHTML).toContain('Ear cytology');
      expect(diagnosticsSection?.innerHTML).toContain('FIV/FeLV test');
      
      // Plan
      expect(planSection?.innerHTML).toContain('grain free diets');
      expect(planSection?.innerHTML).toContain('salmonella');
      expect(planSection?.innerHTML).toContain('FeLV vaccine');
    });

    it('should maintain correct section order with all features', () => {
      const { container } = render(<TemplateGenerator />);
      setupTemplate(container, {
        abnormalities: ['Ears'],
        dietOptions: ['Grain free diet'],
        vaccineOptions: ['FeLV']
      });

      const template = getGeneratedTemplate(container);
      const objectiveIndex = template.indexOf('data-testid="objective-section"');
      const diagnosticsIndex = template.indexOf('data-testid="diagnostics-section"');
      const assessmentIndex = template.indexOf('data-testid="assessment-section"');
      const planIndex = template.indexOf('data-testid="plan-section"');

      expect(objectiveIndex).toBeLessThan(diagnosticsIndex);
      expect(diagnosticsIndex).toBeLessThan(assessmentIndex);
      expect(assessmentIndex).toBeLessThan(planIndex);
    });
  });

  describe('Legacy Tests - Backward Compatibility', () => {
    it('should have all major sections', () => {
      const { container } = render(<TemplateGenerator />);
      const template = getGeneratedTemplate(container);

      expect(template).toContain('<strong>OBJECTIVE</strong>');
      expect(template).toContain('<strong>DIAGNOSTICS</strong>');
      expect(template).toContain('<strong>ASSESSMENT</strong>');
      expect(template).toContain('<strong>PLAN</strong>');
      expect(template).toContain('KSW');
    });

    it('should list all body systems in the objective section', () => {
      const { container } = render(<TemplateGenerator />);
      const objectiveSection = getSection(container, 'objective-section');

      const systems = [
        'Oral-Nasal-Throat',
        'Ears',
        'Eyes',
        'Cardiovascular',
        'Respiratory',
        'Abdominal',
        'Genitourinary',
        'Musculoskeletal',
        'Integument',
        'Lymphatics',
        'Neurological',
        'Rectal'
      ];

      systems.forEach(system => {
        expect(objectiveSection?.innerHTML).toContain(system);
      });
    });

    it('should update template when changing subjective assessment', () => {
      const { container } = render(<TemplateGenerator />);
      let objectiveSection = getSection(container, 'objective-section');
      expect(objectiveSection?.innerHTML).toContain('Subjective Assessment: BAR');

      setupTemplate(container, { subjectiveAssessment: 'QAR' });
      objectiveSection = getSection(container, 'objective-section');
      expect(objectiveSection?.innerHTML).toContain('Subjective Assessment: QAR');
    });

    it('should show copy success message when copy button is clicked', () => {
      document.execCommand = jest.fn(() => true);

      render(<TemplateGenerator />);
      const copyButton = screen.getByText(/Copy to Clipboard/i);
      fireEvent.click(copyButton);

      expect(screen.getByText(/Copied!/i)).toBeInTheDocument();
    });
  });
});