// Assessment section configurations

export const assessmentConfig = {
  healthy: {
    default: 'Apparently healthy!',
    puppy: 'Apparently healthy puppy!',
    kitten: 'Apparently healthy kitten!',
  },
};

// Diagnostics section configurations

export const diagnosticsConfig = {
  wellness: {
    default: 'Fecal ova and parasites - ',
    dog: 'HWT - ',
    cat: '',
  },
};

// Plan section configurations by visit type and animal

export const planConfig = {
  wellness: {
    dog: {
      peFindings: 'Discussed above PE findings with owner.',
      dentalHealth: 'Discussed dental health – recommend VOHC approved products for plaque removal.',
      parasite:
        'Discussed parasite prevention – recommend monthly flea/tick prevention with Simparica Trio for HW prevention. Recommend annual fecals to lab.',
      activity:
        'Discussed activity and mobility – no changes noted by owner and no signs of arthritis.',
      vaccines:
        'Discussed vaccines including vaccine reactions – VOHC handout provided to owner.',
      planForToday: 'Plan for today:',
      ownerAgrees:
        'Owner agrees with above plan and has no questions at this time.',
    },
    cat: {
      peFindings: 'Discussed above PE findings with owner.',
      dentalHealth: 'Discussed dental health – recommend VOHC approved products for plaque removal.',
      indoorOutdoor:
        'Indoor/outdoor status – discussed risks associated with FIV/FeLV and avian influenza with owner.',
      parasite:
        'Discussed parasite prevention – recommend monthly flea/tick prevention year round with Revolution. Recommend annual fecals to lab.',
      activity:
        'Discussed activity and mobility – no changes in jumping on couches/bed or using litterbox per owner report.',
      vaccines:
        'Discussed vaccines including vaccine reactions.',
      planForToday: 'Plan for today:',
      ownerAgrees:
        'Owner agrees with above plan and has no questions at this time.',
    },
  },
  sick: {
    common: {
      peFindings: 'Discussed above PE findings with owner',
      etiologies: 'Discussed ***, including possible etiologies (as above) and diagnostics for further evaluation.',
      planForToday: 'Plan for today:',
      ownerAgrees:
        'Owner agrees with above plan and has no questions at this time.',
    },
  },
  puppy: {
    peFindings: 'Discussed above PE findings with owner',
    diet: 'Discussed diet – recommend continuing puppy diet until at least 1 yr of age. Discussed risks with grain free and raw diets. Do not recommend for future diets.',
    parasite:
      'Discussed parasite prevention – recommend fecal to lab to assess for parasites. Recommend monthly flea/tick prevention year round with Simparica Trio. HWT due at 6 months of age.',
    training:
      'Discussed normal puppy behaviors and training – educated owner on training including crate and potty training.',
    toxins:
      'Discussed common toxins with owner including chocolate, grapes, raisins, and xylitol.',
    vaccines:
      'Discussed vaccines with owner including core (rabies, DHPP, and leptospirosis) and lifestyle (Bordetella and canine influenza vaccine).',
    neutering:
      'Discussed neutering/spaying – recommend at ***. Discussed risks with procedure.',
    planForToday: 'Plan for today:',
    ownerAgrees:
      'Owner agrees with above plan and has no questions at this time.',
  },
  kitten: {
    peFindings: 'Discussed above PE findings with owner.',
    diet: 'Discussed diet – recommend continuing kitten diet until 1 yr of age. Discussed risks with grain free and raw diets – do not recommend.',
    parasite:
      'Discussed parasite prevention – recommend fecal to lab to assess for parasites. Recommend monthly flea/tick prevention year-round with Revolution.',
    enrichment:
      'Discussed normal kitten behaviors and environmental enrichment – Ohio State Indoor Initiative handout sent with owner.',
    toxins:
      'Discussed common plant toxins including lilies and poinsettias. Gave owner information for ASPCA for plant toxicities.',
    vaccines:
      'Discussed vaccines with owner (rabies, FVRCP, and FeLV). Recommend FeLV for all kittens under 1 year of age and then annually for all indoor/outdoor cats.',
    neutering:
      'Discussed neutering/spaying – recommend at 6 months of age. Discussed risks with procedure.',
    planForToday: 'Plan for today:',
    ownerAgrees:
      'Owner agrees with above plan and has no questions at this time.',
  },
};

export const templateFooter = 'KSW';