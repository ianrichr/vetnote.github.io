import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TemplateGenerator from '../TemplateGenerator';

describe('TemplateGenerator - Baseline Tests', () => {
  // Helper function to extract HTML content from the generated template
  const getGeneratedTemplate = (container: HTMLElement): string => {
    const templateDiv = container.querySelector('[contenteditable="true"]');
    return templateDiv?.innerHTML || '';
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
  }) => {
    if (options.animal) {
      const animalButton = screen.getByRole('button', { name: options.animal });
      fireEvent.click(animalButton);
    }

    if (options.visitType) {
      const visitTypeButton = screen.getByRole('button', { name: options.visitType });
      fireEvent.click(visitTypeButton);
    }

    if (options.subjectiveAssessment) {
      const assessmentSelect = screen.getByRole('combobox', { name: /Subjective Assessment/i });
      fireEvent.change(assessmentSelect, { target: { value: options.subjectiveAssessment } });
    }

    if (options.easeOfExamination !== undefined) {
      const easeSlider = screen.getByRole('slider');
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
  };

  describe('Default State', () => {
    it('should render with default Dog Wellness template', () => {
      const { container } = render(<TemplateGenerator />);
      const template = getGeneratedTemplate(container);

      expect(template).toContain('<strong>OBJECTIVE</strong>');
      expect(template).toContain('Subjective Assessment: BAR');
      expect(template).toContain('Ease of Examination (5/5 is the easiest): 5/5');
      expect(template).toContain('Temperament: Well-behaved');
      expect(template).toContain('Oral-Nasal-Throat: Normal');
      expect(template).toContain('Eyes: Normal');
      expect(template).toContain('Ears: Normal');
      expect(template).toContain('Cardiovascular: Normal rate and rhythm; no murmur auscultated');
      expect(template).toContain('<strong>DIAGNOSTICS</strong>');
      expect(template).toContain('<strong>ASSESSMENT</strong>');
      expect(template).toContain('Apparently healthy!');
      expect(template).toContain('<strong>PLAN</strong>');
    });
  });

  describe('Dog - Wellness Visit', () => {
    it('should generate correct template for healthy dog wellness visit', () => {
      const { container } = render(<TemplateGenerator />);
      const template = getGeneratedTemplate(container);

      expect(template).toContain('Apparently healthy!');
      expect(template).toContain('Discussed diet – discussed risks with grain free');
      expect(template).toContain('Discussed parasite prevention – recommend monthly flea/tick prevention');
      expect(template).toContain('Discussed vaccines');
    });

    it('should generate correct template for dog with ear abnormality', () => {
      const { container } = render(<TemplateGenerator />);
      setupTemplate(container, {
        animal: 'Dog',
        visitType: 'Wellness',
        abnormalities: ['Ears']
      });
      const template = getGeneratedTemplate(container);

      expect(template).toContain('Ears: Abnormal');
      expect(template).toContain('<li>AD</li>');
      expect(template).toContain('<li>AS</li>');
      expect(template).toContain('Ear cytology');
      expect(template).toContain('Otitis externa');
      expect(template).toContain('Discussed with owner otitis externa');
    });

    it('should generate correct template for dog with eye abnormality', () => {
      const { container } = render(<TemplateGenerator />);
      setupTemplate(container, {
        animal: 'Dog',
        visitType: 'Wellness',
        abnormalities: ['Eyes']
      });
      const template = getGeneratedTemplate(container);

      expect(template).toContain('Eyes: Abnormal');
      expect(template).toContain('<li>OD</li>');
      expect(template).toContain('<li>OS</li>');
      // Eye diagnostics/assessments now require explicit sub-option selection
      // Plan text still shows automatically
      expect(template).toContain('Recommend fluorescein stain');
      expect(template).toContain('Recommend Schirmer tear test');
      expect(template).toContain('Recommend assessing IOP');
    });

    it('should generate correct template for dog with heart murmur', () => {
      const { container } = render(<TemplateGenerator />);
      setupTemplate(container, {
        animal: 'Dog',
        visitType: 'Wellness',
        abnormalities: ['Cardiovascular'],
        murmurGrade: 3
      });
      const template = getGeneratedTemplate(container);

      expect(template).toContain('Cardiovascular: Abnormal - grade 3/6');
      expect(template).toContain('Heart murmur - pathological vs physiological');
      expect(template).toContain('Discussed new onset heart murmur');
      expect(template).toContain('echocardiogram with cardiologist');
    });

    it('should generate correct template for dog with dental disease', () => {
      const { container } = render(<TemplateGenerator />);
      setupTemplate(container, {
        animal: 'Dog',
        visitType: 'Wellness',
        abnormalities: ['Oral-Nasal-Throat']
      });
      const template = getGeneratedTemplate(container);

      expect(template).toContain('Oral-Nasal-Throat: Abnormal');
      expect(template).toContain('Dental disease');
      expect(template).toContain('Discussed dental disease – recommend dental under GA');
    });
  });

  describe('Cat - Wellness Visit', () => {
    it('should generate correct template for healthy cat wellness visit', () => {
      const { container } = render(<TemplateGenerator />);
      setupTemplate(container, {
        animal: 'Cat',
        visitType: 'Wellness'
      });
      const template = getGeneratedTemplate(container);

      expect(template).toContain('Apparently healthy!');
      expect(template).toContain('Discussed diet - discussed risks with raw diets');
      expect(template).toContain('avian influenza');
      expect(template).toContain('Indoor/outdoor status');
      expect(template).toContain('FIV/FeLV');
      expect(template).toContain('Discussed FeLV vaccine');
    });
  });

  describe('Puppy Visit', () => {
    it('should generate correct template for puppy visit', () => {
      const { container } = render(<TemplateGenerator />);
      setupTemplate(container, {
        animal: 'Dog',
        visitType: 'Puppy'
      });
      const template = getGeneratedTemplate(container);

      expect(template).toContain('Oral-Nasal-Throat: Normal – deciduous teeth still present');
      expect(template).toContain('Abdominal: Normal - soft and non-tender on palpation; no umbilical hernia');
      expect(template).toContain('Fecal ova and parasites');
      expect(template).toContain('Apparently healthy puppy!');
      expect(template).toContain('Discussed diet – recommend continuing puppy diet');
      expect(template).toContain('Discussed normal puppy behaviors and training');
      expect(template).toContain('Discussed common toxins');
      expect(template).toContain('Discussed neutering/spaying');
    });
  });

  describe('Kitten Visit', () => {
    it('should generate correct template for kitten visit', () => {
      const { container } = render(<TemplateGenerator />);
      setupTemplate(container, {
        animal: 'Cat',
        visitType: 'Kitten'
      });
      const template = getGeneratedTemplate(container);

      expect(template).toContain('Oral-Nasal-Throat: Normal – deciduous teeth still present');
      expect(template).toContain('Abdominal: Normal - soft and non-tender on palpation; no umbilical hernia');
      expect(template).toContain('Fecal ova and parasites');
      expect(template).toContain('Apparently healthy kitten!');
      expect(template).toContain('Discussed diet – recommend continuing kitten diet');
      expect(template).toContain('Discussed normal kitten behaviors');
      expect(template).toContain('Ohio State Indoor Initiative');
      expect(template).toContain('Discussed common plant toxins including lilies');
    });
  });

  describe('Sick Visit', () => {
    it('should generate correct template for dog sick visit', () => {
      const { container } = render(<TemplateGenerator />);
      setupTemplate(container, {
        animal: 'Dog',
        visitType: 'Sick'
      });
      const template = getGeneratedTemplate(container);

      expect(template).toContain('Apparently healthy!');
      expect(template).toContain('Discussed above PE findings with owner');
      expect(template).toContain('Plan for today:');
      expect(template).toContain('Owner agrees with above plan');
    });

    it('should generate correct template for sick visit with abnormalities', () => {
      const { container } = render(<TemplateGenerator />);
      setupTemplate(container, {
        animal: 'Dog',
        visitType: 'Sick',
        abnormalities: ['Ears', 'Eyes']
      });
      const template = getGeneratedTemplate(container);

      expect(template).toContain('Ears: Abnormal');
      expect(template).toContain('Eyes: Abnormal');
      expect(template).toContain('Ear cytology');
      expect(template).toContain('Otitis externa');
      // Eye diagnostics/assessments require explicit sub-option selection
      // Plan text still shows automatically
      expect(template).toContain('Recommend fluorescein stain');
      expect(template).toContain('Recommend Schirmer tear test');
    });
  });

  describe('Multiple Abnormalities', () => {
    it('should handle multiple system abnormalities correctly', () => {
      const { container } = render(<TemplateGenerator />);
      setupTemplate(container, {
        animal: 'Dog',
        visitType: 'Wellness',
        abnormalities: ['Ears', 'Eyes', 'Respiratory']
      });
      const template = getGeneratedTemplate(container);

      expect(template).toContain('Ears: Abnormal');
      expect(template).toContain('Eyes: Abnormal');
      expect(template).toContain('Respiratory: Abnormal');
      expect(template).toContain('Ear cytology');
      expect(template).toContain('Otitis externa');
      // Eye diagnostics/assessments require explicit sub-option selection
      // Plan text still shows automatically
      expect(template).toContain('Recommend fluorescein stain');
      expect(template).toContain('Recommend Schirmer tear test');
    });
  });

  describe('All Body Systems', () => {
    it('should list all body systems in the objective section', () => {
      const { container } = render(<TemplateGenerator />);
      const template = getGeneratedTemplate(container);

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
        expect(template).toContain(system);
      });
    });
  });

  describe('User Interactions', () => {
    it('should update template when changing subjective assessment', () => {
      const { container } = render(<TemplateGenerator />);
      let template = getGeneratedTemplate(container);
      expect(template).toContain('Subjective Assessment: BAR');

      setupTemplate(container, { subjectiveAssessment: 'QAR' });
      template = getGeneratedTemplate(container);
      expect(template).toContain('Subjective Assessment: QAR');
    });

    it('should update template when changing ease of examination', () => {
      const { container } = render(<TemplateGenerator />);
      let template = getGeneratedTemplate(container);
      expect(template).toContain('Ease of Examination (5/5 is the easiest): 5/5');

      setupTemplate(container, { easeOfExamination: 3 });
      template = getGeneratedTemplate(container);
      expect(template).toContain('Ease of Examination (5/5 is the easiest): 3/5');
    });

    it('should update template when changing temperament', () => {
      const { container } = render(<TemplateGenerator />);
      let template = getGeneratedTemplate(container);
      expect(template).toContain('Temperament: Well-behaved');

      setupTemplate(container, { temperament: 'Nervous' });
      template = getGeneratedTemplate(container);
      expect(template).toContain('Temperament: Nervous');
    });
  });

  describe('Template Structure', () => {
    it('should have all major sections', () => {
      const { container } = render(<TemplateGenerator />);
      const template = getGeneratedTemplate(container);

      expect(template).toContain('<strong>OBJECTIVE</strong>');
      expect(template).toContain('<strong>DIAGNOSTICS</strong>');
      expect(template).toContain('<strong>ASSESSMENT</strong>');
      expect(template).toContain('<strong>PLAN</strong>');
      expect(template).toContain('KSW');
    });

    it('should use proper HTML list structure', () => {
      const { container } = render(<TemplateGenerator />);
      const template = getGeneratedTemplate(container);

      expect(template).toMatch(/<ul>/);
      expect(template).toMatch(/<li>/);
      expect(template).toMatch(/<\/li>/);
      expect(template).toMatch(/<\/ul>/);
    });
  });

  describe('Copy to Clipboard', () => {
    it('should show copy success message when copy button is clicked', () => {
      // Mock execCommand
      document.execCommand = jest.fn(() => true);

      render(<TemplateGenerator />);
      const copyButton = screen.getByText(/Copy to Clipboard/i);
      fireEvent.click(copyButton);

      expect(screen.getByText(/Copied!/i)).toBeInTheDocument();
    });
  });
});