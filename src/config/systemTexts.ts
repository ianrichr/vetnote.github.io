// Configuration for all body system texts
// Standardized structure for consistency and maintainability

export const oralNasalThroatConfig = {
  name: 'Oral-Nasal-Throat',
  normal: {
    default: 'Oral-Nasal-Throat: Normal',
    puppyKitten: 'Oral-Nasal-Throat: Normal – deciduous teeth still present; no cleft palate',
  },
  abnormal: {
    label: 'Oral-Nasal-Throat: Abnormal',
  },
  plan: '',
  subOptions: {
    'Dental': {
      assessment: 'Dental disease',
      plan: 'Discussed dental disease – recommend dental under GA at this time for COHAT. Discussed risks with GA and ways practice minimizes risk including pre-op bloodwork to assess underlying organ function. Dental estimate sent with owner lvl ***',
    },
  },
};

export const earsConfig = {
  name: 'Ears',
  normal: {
    default: 'Ears: Normal',
  },
  abnormal: {
    label: 'Ears: Abnormal',
    details: ['AD', 'AS'],
  },
  diagnostics: {
    label: 'Ear cytology',
    details: ['AD', 'AS'],
  },
  assessment: 'Otitis externa',
  plan: {
    text: 'Discussed with owner otitis externa. Recommend ear cytology for further evaluation.',
    nestedItems:  [
      'Discussed cytology results and treatment options.',
      'Discussed suspicion for underlying allergies - if ear infections re-occur or if skin issues develop will plan to discuss in more detail.',
    ],
  },
};

export const eyesConfig = {
  name: 'Eyes',
  normal: {
    default: 'Eyes: Normal',
  },
  abnormal: {
    label: 'Eyes: Abnormal',
    details: ['OD', 'OS'],
  },
  plan: [
    'Recommend fluorescein stain to evaluate for corneal ulcer.',
    'Recommend Schirmer tear test to evaluate tear production.',
    'Recommend assessing IOP given PE findings.',
  ],
  subOptions: {
    'Fluorescein Stain': {
      diagnostics: {
        label: 'Fluorescein stain',
        details: ['OD', 'OS'],
      },
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
};

export const cardiovascularConfig = {
  name: 'Cardiovascular',
  normal: {
    default: 'Cardiovascular: Normal rate and rhythm; no murmur auscultated',
  },
  abnormal: {
    label: 'Cardiovascular: Abnormal',
  },
  subOptions: {
    'Murmur': {
      // Murmur has additional grade/side parameters handled separately
      requiresGrade: true,
      requiresSide: true,
      objectiveLabel: (grade: number, side: string) =>
        `Cardiovascular: Abnormal - grade ${grade}/6 ${side} heart murmur`,
      assessment: 'Heart murmur - pathological vs physiological',
      plan: [
        'Discussed heart murmur incouding possible etiologies.',
        'Discussed diagnostics - thoracic radiographs and cardiology consult for echocardiogram for further evaluation.',
      ],
    },
  },
};

export const respiratoryConfig = {
  name: 'Respiratory',
  normal: {
    default: 'Respiratory: Normal bronchovesicular sounds auscultated bilaterally',
  },
  abnormal: {
    label: 'Respiratory: Abnormal',
  },
};

export const abdominalConfig = {
  name: 'Abdominal',
  normal: {
    default: 'Abdominal: Normal - soft and non-tender on palpation',
    puppyKitten: 'Abdominal: Normal - soft and non-tender on palpation; no umbilical hernia',
  },
  abnormal: {
    label: 'Abdominal: Abnormal',
  },
};

export const genitourinaryConfig = {
  name: 'Genitourinary',
  normal: {
    default: 'Genitourinary: Normal',
  },
  abnormal: {
    label: 'Genitourinary: Abnormal',
  },
};

export const musculoskeletalConfig = {
  name: 'Musculoskeletal',
  normal: {
    default: 'Musculoskeletal: Normal – full ROM in all joints, no crepitus or swelling appreciated on palpation',
  },
  abnormal: {
    label: 'Musculoskeletal: Abnormal',
  },
};

export const integumentConfig = {
  name: 'Integument',
  normal: {
    default: 'Integument: Normal',
  },
  abnormal: {
    label: 'Integument: Abnormal',
  },
  subOptions: {
    'Fleas': {
      plan: {
        text: 'Discussed fleas with owner.',
        nestedItems: [
          'Discussed flea prevention - all pets in household treated with prescription products for at least 4 months.',
          'Discussed environmental control including knockout spray.',
          'Discussed tapeworm transmission - recommend broad spectrum deworker.',
          'Discussed pruritus control - recommend Cytopoint or Apoquel.',
        ],
      },
    },
    'Mass': {
      diagnostics: {
        label: 'FNA with cytology',
      },
      plan: 'Discussed mass with owner including diagnostics for further evaluation. Recommend FNA with cytology. Discussed limitations with owner - may not get diagnostic sample.',
    },
  },
};

export const lymphaticsConfig = {
  name: 'Lymphatics',
  normal: {
    default: 'Lymphatics: Normal – no lymphadenopathy appreciated',
  },
  abnormal: {
    label: 'Lymphatics: Abnormal',
  },
};

export const neurologicalConfig = {
  name: 'Neurological',
  normal: {
    default: 'Neurological: Normal - mentation appropriate; full neurological exam not performed',
  },
  abnormal: {
    label: 'Neurological: Abnormal',
  },
};

export const rectalConfig = {
  name: 'Rectal',
  normal: {
    default: 'Rectal: <u>Not examined</u>',
  },
  abnormal: {
    label: 'Rectal: Abnormal',
  },
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