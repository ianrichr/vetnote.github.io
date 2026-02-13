import { AnimalType, VisitType } from '../types/template.types';

// Configuration for all body system texts

export const oralNasalThroatConfig = {
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
  normal: 'Eyes: Normal',
  abnormal: {
    label: 'Eyes: Abnormal',
    details: ['OD', 'OS'],
  },
  diagnostics: {
    fluorescein: {
      label: 'Fluorescein stain',
      details: ['OD', 'OS'],
    },
    schirmer: {
      label: 'Schirmer tear test',
      details: ['OD', 'OS'],
    },
  },
  assessment: {
    conditions: ['Corneal ulcer', 'Conjunctivitis'],
  },
  plan: {
    discussion: 'Discussed eye findings with owner – recommend fluorescein stain to evaluate for corneal ulcer.',
    schirmer: 'Recommend Schirmer tear test to evaluate tear production given PE findings.',
  },
};

export const cardiovascularConfig = {
  normal: 'Cardiovascular: Normal rate and rhythm; no murmur auscultated',
  abnormal: {
    label: 'Cardiovascular: Abnormal',
    withMurmur: (grade: number, side: string) =>
      `Cardiovascular: Abnormal - grade ${grade}/6 ${side} heart murmur`,
  },
  assessment: {
    murmur: 'Heart murmur - pathological vs physiological',
  },
  plan: {
    murmur: {
      discussion:
        'Discussed new onset heart murmur with owner including causes (as above) and diagnostics to evaluate further.',
      echo:
        'Discussed gold standard is an echocardiogram with cardiologist to evaluate heart structure and function to assess for heart disease. Owner verbally quoted $800 dollars for mobile cardiologist. Also, briefly discussed thoracic radiographs to evaluate for changes in heart size as well as assess lungs. Discussed limitations of thoracic radiographs (unable to determine heart function). Estimate provided – owner to consider.',
    },
  },
};

export const respiratoryConfig = {
  normal: 'Respiratory: Normal bronchovesicular sounds auscultated bilaterally',
  abnormal: 'Respiratory: Abnormal',
};

export const abdominalConfig = {
  normal: {
    default: 'Abdominal: Normal - soft and non-tender on palpation',
    puppyKitten:
      'Abdominal: Normal - soft and non-tender on palpation; no umbilical hernia',
  },
  abnormal: 'Abdominal: Abnormal',
};

export const genitourinaryConfig = {
  normal: 'Genitourinary: Normal',
  abnormal: 'Genitourinary: Abnormal',
};

export const musculoskeletalConfig = {
  normal:
    'Musculoskeletal: Normal – full ROM in all joints, no crepitus or swelling appreciated on palpation',
  abnormal: 'Musculoskeletal: Abnormal',
};

export const integumentConfig = {
  normal: 'Integument: Normal',
  abnormal: 'Integument: Abnormal',
};

export const lymphaticsConfig = {
  normal: 'Lymphatics: Normal – no lymphadenopathy appreciated',
  abnormal: 'Lymphatics: Abnormal',
};

export const neurologicalConfig = {
  normal:
    'Neurological: Normal - mentation appropriate; full neurological exam not performed',
  abnormal: 'Neurological: Abnormal',
};

export const rectalConfig = {
  normal: 'Rectal: <u>Not examined</u>',
  abnormal: 'Rectal: Abnormal',
};

// Helper to get puppy/kitten diagnostics
export const getPuppyKittenDiagnostics = () => ({
  fecal: {
    label: 'Fecal ova and parasites - ',
  },
});