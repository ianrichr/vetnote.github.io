// Configuration for all body system texts

export const oralNasalThroatConfig = {
  name: 'Oral-Nasal-Throat',
  normal: {
    default: 'Oral-Nasal-Throat: Normal',
    puppyKitten: 'Oral-Nasal-Throat: Normal – deciduous teeth still present; no cleft palate',
  },
  abnormal: {
    label: 'Oral-Nasal-Throat: Abnormal',
  },
  assessment: {
    condition: 'Dental disease',
  },
  plan: {
    abnormal: 'Discussed dental disease – recommend dental under GA at this time for COHAT. Discussed risks with GA and ways practice minimizes risk including pre-op bloodwork to assess underlying organ function. Dental estimate sent with owner lvl ***',
    wellness: 'Discussed dental health – recommend brushing teeth daily with VOHC approved brushes and toothpaste. Alternatively, recommend any VOHC approved dental products for plaque removal.',
  },
};

export const earsConfig = {
  name: 'Ears',
  normal: 'Ears: Normal',
  abnormal: {
    label: 'Ears: Abnormal',
    details: ['AD', 'AS'],
  },
  diagnostics: {
    cytology: {
      label: 'Ear cytology',
      details: ['AD', 'AS'],
    },
  },
  assessment: {
    condition: 'Otitis externa',
  },
  plan: {
    discussion: 'Discussed with owner otitis externa. Recommend ear cytology for further evaluation.',
    allergies: 'Discussed with owner likely underlying allergies - if ear infections re-occur or if skin issues develop will plan to discuss in more detail',
  },
};

export const eyesConfig = {
  name: 'Eyes',
  normal: 'Eyes: Normal',
  abnormal: {
    label: 'Eyes: Abnormal',
    details: ['OD', 'OS'],
  },
  // Configuration-driven sub-options with RECURSIVE NESTING support!
  subOptions: {
    'Fluorescein Stain': {
      diagnostics: {
        label: 'Fluorescein stain',
        details: ['OD', 'OS'],
      },
      // Nested sub-options for Fluorescein results
      subOptions: {
        'Corneal Ulcer': {
          assessment: 'Corneal ulcer',
        },
      },
    },
    'STT': {
      diagnostics: {
        label: 'Schirmer tear test',
        details: ['OD', 'OS'],
      },
      // Nested sub-options for Schirmer tear test results
      subOptions: {
        'KCS (dry eye)': {
          assessment: 'KCS (dry eye)',
        },
      },
    },
    'IOP': {
      diagnostics: {
        label: 'Intraocular pressure',
        details: ['OD', 'OS'],
      },
      // Nested sub-options for IOP findings (as requested!)
      subOptions: {
        'Glaucoma/anterior uveitis': {
          assessment: 'Glaucoma/anterior uveitis',
        },
      },
    },
    'Conjunctivitis': {
      assessment: 'Conjunctivitis',
    },
  },
  plan: {
    fluoresceinStain: 'Recommend fluorescein stain to evaluate for corneal ulcer.',
    schirmerTearTest: 'Recommend Schirmer tear test to evaluate tear production.',
    intraocularPressure: 'Recommend assessing IOP given PE findings.'
  },
};

export const cardiovascularConfig = {
  name: 'Cardiovascular',
  normal: 'Cardiovascular: Normal rate and rhythm; no murmur auscultated',
  abnormal: {
    label: 'Cardiovascular: Abnormal',
  },
  // Configuration-driven sub-options
  subOptions: {
    'Murmur': {
      // Murmur has additional grade/side parameters handled separately
      requiresGrade: true,
      requiresSide: true,
      objectiveLabel: (grade: number, side: string) =>
        `Cardiovascular: Abnormal - grade ${grade}/6 ${side} heart murmur`,
      assessment: 'Heart murmur - pathological vs physiological',
      plan: [
        'Discussed new onset heart murmur with owner including causes (as above) and diagnostics to evaluate further.',
        'Discussed gold standard is an echocardiogram with cardiologist to evaluate heart structure and function to assess for heart disease. Owner verbally quoted $800 dollars for mobile cardiologist. Also, briefly discussed thoracic radiographs to evaluate for changes in heart size as well as assess lungs. Discussed limitations of thoracic radiographs (unable to determine heart function). Estimate provided – owner to consider.',
      ],
    },
  },
};

export const respiratoryConfig = {
  name: 'Respiratory',
  normal: 'Respiratory: Normal bronchovesicular sounds auscultated bilaterally',
  abnormal: 'Respiratory: Abnormal',
};

export const abdominalConfig = {
  name: 'Abdominal',
  normal: {
    default: 'Abdominal: Normal - soft and non-tender on palpation',
    puppyKitten:
      'Abdominal: Normal - soft and non-tender on palpation; no umbilical hernia',
  },
  abnormal: 'Abdominal: Abnormal',
};

export const genitourinaryConfig = {
  name: 'Genitourinary',
  normal: 'Genitourinary: Normal',
  abnormal: 'Genitourinary: Abnormal',
};

export const musculoskeletalConfig = {
  name: 'Musculoskeletal',
  normal:
    'Musculoskeletal: Normal – full ROM in all joints, no crepitus or swelling appreciated on palpation',
  abnormal: 'Musculoskeletal: Abnormal',
};

export const integumentConfig = {
  name: 'Integument',
  normal: 'Integument: Normal',
  abnormal: 'Integument: Abnormal',
  subOptions: {
    'Fleas': {
      plan: {
        text: 'Discussed fleas with owner.',
        nestedItems: [
          'Discussed flea prevention - all pets in household treated with prescription products for at least 4 months.',
          'Discussed environmental control including knockout spray.',
          'Discussed tapeworm transmission - recommend broad spectrum deworker.',
          'Discussed pruritus control - recommend Cytopoint or Apoquel.',
        ]
      }
    },
    'Mass': {
      plan: {
        text: [
          'Discussed mass with owner including diagnostics for further evaluation. Recommend FNA with cytology. Discussed limitations with owner - may not get diagnostic sample.',
        ]
      }
    },
  },
};

export const lymphaticsConfig = {
  name: 'Lymphatics',
  normal: 'Lymphatics: Normal – no lymphadenopathy appreciated',
  abnormal: 'Lymphatics: Abnormal',
};

export const neurologicalConfig = {
  name: 'Neurological',
  normal:
    'Neurological: Normal - mentation appropriate; full neurological exam not performed',
  abnormal: 'Neurological: Abnormal',
};

export const rectalConfig = {
  name: 'Rectal',
  normal: 'Rectal: <u>Not examined</u>',
  abnormal: 'Rectal: Abnormal',
};

// Helper to get puppy/kitten diagnostics
export const getPuppyKittenDiagnostics = () => ({
  fecal: {
    label: 'Fecal ova and parasites - ',
  },
});

// Export all system configs as array for automatic discovery
export const allSystemConfigsList = [
  oralNasalThroatConfig,
  earsConfig,
  eyesConfig,
  cardiovascularConfig,
  respiratoryConfig,
  abdominalConfig,
  genitourinaryConfig,
  musculoskeletalConfig,
  integumentConfig,
  lymphaticsConfig,
  neurologicalConfig,
  rectalConfig,
];
