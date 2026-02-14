# VetNote Configuration Guide

## Overview

VetNote now uses a **configuration-driven architecture** that makes adding new template options incredibly simple. Instead of modifying multiple files, you can now add new sub-options (like eye diagnostics) by **editing just one configuration file**.

## Generic Builder Architecture

VetNote uses a **generic builder pattern** that eliminates code duplication across all body systems:

### How It Works

**1. Generic Builders** (`src/utils/systemBuilders.ts`)
- `buildGenericObjective()` - Works for ANY system's objective section
- `buildGenericDiagnostics()` - Works for ANY system's diagnostics section  
- `buildGenericAssessment()` - Works for ANY system's assessment section
- `buildGenericPlan()` - Works for ANY system's plan section

**2. System Files** (`src/templates/systems/*.ts`)
Each system file is now just 4 simple one-liners:

```typescript
export const buildIntegumentObjective = (context: TemplateContext): TemplateItem => {
  return buildGenericObjective(context, 'Integument', integumentConfig);
};

export const buildIntegumentDiagnostics = (context: TemplateContext): DiagnosticItem[] => {
  return buildGenericDiagnostics(context, 'Integument', integumentConfig);
};

export const buildIntegumentAssessment = (context: TemplateContext): AssessmentItem[] => {
  return buildGenericAssessment(context, 'Integument', integumentConfig);
};

export const buildIntegumentPlan = (context: TemplateContext): PlanItem[] => {
  return buildGenericPlan(context, 'Integument', integumentConfig);
};
```

**That's it!** All 12 body systems use this same pattern.

### Benefits

✅ **DRY**: One implementation, used everywhere (80%+ code reduction)  
✅ **Consistent**: All systems behave identically  
✅ **Maintainable**: Fix bugs once, applies everywhere  
✅ **Simple**: Each system file is ~20 lines instead of 100+  
✅ **Extensible**: Add features to generic builders, all systems get them automatically

### Adding Nested Plan Items

The generic builders support nested plan items (sub-bullets) automatically:

```typescript
'Fleas': {
  plan: {
    text: 'Discussed fleas with owner.',
    nestedItems: [
      'Discussed flea prevention - all pets treated for 4 months.',
      'Discussed environmental control including knockout spray.',
      'Discussed tapeworm transmission - recommend broad spectrum dewormer.'
    ]
  }
}
```

This renders as:
```
• Discussed fleas with owner.
  • Discussed flea prevention - all pets treated for 4 months.
  • Discussed environmental control including knockout spray.
  • Discussed tapeworm transmission - recommend broad spectrum dewormer.
```

## Quick Start: Adding Sub-Options

The system supports **infinitely nested sub-options**. Here's what it looks like:

```typescript
// In src/config/systemTexts.ts
export const systemConfig = {
  normal: 'System: Normal',
  abnormal: {
    label: 'System: Abnormal',
    details: ['Detail1', 'Detail2'],
  },
  // Sub-options can be nested infinitely deep!
  subOptions: {
    'Diagnostic Test': {
      diagnostics: {
        label: 'Diagnostic test name',
        details: ['OD', 'OS'],
      },
      // Nest sub-options under this option
      subOptions: {
        'Finding A': {
          assessment: 'Condition A',
          plan: 'Treatment plan for condition A',
        },
        'Finding B': {
          assessment: 'Condition B',
          // Nest even deeper!
          subOptions: {
            'Severity - Mild': {
              plan: 'Management for mild case',
            },
            'Severity - Severe': {
              assessment: 'Severe condition B - referral needed',
              plan: 'Recommend specialist referral',
            },
          },
        },
      },
    },
  },
  plan: {
    discussion: 'Base plan text that always shows...',
  },
};
```

**That's it!** The UI checkboxes, state management, and template generation all happen automatically at any depth.

---

## How It Works

### 1. Configuration (`src/config/systemTexts.ts`)

Each body system can have a `subOptions` object:

```typescript
subOptions: {
  'Option Name': {
    diagnostics?: {       // Optional: adds to Diagnostics section
      label: string,
      details?: string[]  // Optional: sub-items like 'OD', 'OS'
    },
    assessment?: string,  // Optional: adds to Assessment section
    plan?: string | string[],  // Optional: adds to Plan section
  }
}
```

### 2. Automatic UI Generation (`src/components/AbnormalitiesSelector.tsx`)

The component automatically:
- Reads `subOptions` from the config
- Renders checkboxes for each option
- Manages selection state
- Shows/hides based on parent system selection

### 3. Automatic Template Generation

The system builders automatically:
- Check which sub-options are selected
- Include appropriate diagnostics
- Include appropriate assessments
- Include appropriate plan items

---

## Adding Sub-Options to Any System

### Step 1: Add to Configuration

Edit `src/config/systemTexts.ts`:

```typescript
export const [systemName]Config = {
  normal: '...',
  abnormal: { ... },
  
  // Add this:
  subOptions: {
    'Your Option Name': {
      diagnostics: {
        label: 'Test name',
        details: ['Detail 1', 'Detail 2']
      },
      assessment: 'Condition name',
      plan: 'Discussion text about this finding'
    }
  }
};
```

### Step 2: Register in allSystemConfigsList

Edit `src/config/systemTexts.ts` and add your new config to the `allSystemConfigsList` array at the bottom:

```typescript
export const allSystemConfigsList = [
  oralNasalThroatConfig,
  earsConfig,
  eyesConfig,
  // ... other configs
  yourSystemConfig,  // Add this line
];
```

**That's it!** The UI will automatically detect and render sub-options for your system.

### Step 3: Ensure Config Has Name Property

Each config must have a `name` property matching the system name:

```typescript
export const yourSystemConfig = {
  name: 'YourSystem',  // Must match system name exactly
  normal: '...',
  abnormal: '...',
  subOptions: { ... }
};
```

### Step 4: Update System Builder (if needed)

Most systems already support sub-options generically. If your system doesn't have sub-option support yet, follow the pattern in `src/templates/systems/Eyes.ts`:

```typescript
export const buildYourSystemDiagnostics = (context: TemplateContext): DiagnosticItem[] => {
  const { abnormalities, subOptions } = context;
  const items: DiagnosticItem[] = [];
  
  if (abnormalities.includes('YourSystem') && yourSystemConfig.subOptions) {
    const selectedOptions = subOptions['YourSystem'] || [];
    
    selectedOptions.forEach(option => {
      const config = (yourSystemConfig.subOptions as Record<string, any>)?.[option];
      if (config?.diagnostics) {
        items.push({
          label: config.diagnostics.label,
          details: config.diagnostics.details,
        });
      }
    });
  }
  
  return items;
};
```

---

## Special Cases

### Sub-Options with Additional Parameters (like Murmur)

Some sub-options need extra information (e.g., Murmur needs grade and side):

```typescript
export const cardiovascularConfig = {
  subOptions: {
    'Murmur': {
      requiresGrade: true,  // Special flag
      requiresSide: true,   // Special flag
      objectiveLabel: (grade: number, side: string) =>
        `Cardiovascular: Abnormal - grade ${grade}/6 ${side} heart murmur`,
      assessment: 'Heart murmur - pathological vs physiological',
      plan: [
        'Discussed new onset heart murmur...',
        'Discussed gold standard is an echocardiogram...'
      ],
    },
  },
};
```

For these special cases, you need to:
1. Add UI elements in `AbnormalitiesSelector.tsx` (like `MurmurGradeSelector`)
2. Add state management in `TemplateGenerator.tsx`
3. Pass special parameters to the builders

---

## Configuration Options Reference

### diagnostics
Adds items to the **DIAGNOSTICS** section

```typescript
diagnostics: {
  label: string,          // Main diagnostic name (e.g., "Fluorescein stain")
  details?: string[]      // Optional sub-items (e.g., ["OD", "OS"])
}
```

### assessment
Adds items to the **ASSESSMENT** section

```typescript
assessment: string  // Condition name (e.g., "Corneal ulcer")
```

### plan
Adds items to the **PLAN** section

```typescript
plan: string | string[]  // Single text or array of texts
```

---

## Examples

### Simple Sub-Option (Single Diagnostic)

```typescript
'Blood Pressure': {
  diagnostics: {
    label: 'Blood pressure measurement'
  },
  assessment: 'Hypertension',
  plan: 'Discussed blood pressure findings with owner.'
}
```

### Complex Sub-Option (Multiple Details)

```typescript
'Radiographs': {
  diagnostics: {
    label: 'Thoracic radiographs',
    details: ['Lateral view', 'VD view', 'DV view']
  },
  assessment: 'Pulmonary infiltrates',
  plan: [
    'Discussed radiographic findings with owner.',
    'Recommend follow-up radiographs in 2 weeks.'
  ]
}
```

### Sub-Option with Only Plan Text

```typescript
'Physical Therapy': {
  plan: 'Discussed physical therapy exercises for improved mobility.'
}
```

### Nested Sub-Options (Infinite Depth)

```typescript
'IOP': {
  diagnostics: {
    label: 'Intraocular pressure',
    details: ['OD', 'OS'],
  },
  // Nest findings under the diagnostic
  subOptions: {
    'Glaucoma': {
      assessment: 'Glaucoma',
      plan: 'Discussed glaucoma management...',
    },
    'Normal Pressure': {
      assessment: 'Normal intraocular pressure',
    },
    'Elevated': {
      assessment: 'Elevated IOP - monitor',
      // Can nest even deeper!
      subOptions: {
        'Recheck in 2 weeks': {
          plan: 'Recommend IOP recheck in 2 weeks.',
        },
        'Referral needed': {
          plan: 'Recommend ophthalmology referral.',
        },
      },
    },
  },
}
```

**Key Features:**
- Nest as deep as clinically meaningful
- Each level can have diagnostics, assessments, and/or plan items
- Child options only appear when parent is selected
- Unchecking parent automatically clears all child selections

---

## Nested Sub-Options Deep Dive

### When to Use Nesting

Use nested sub-options when:
- A diagnostic test can have multiple findings
- A finding can have different severities
- Treatment paths branch based on results

**Example Flow:**
```
Diagnostic Test → Finding → Severity → Treatment Plan
```

### Path-Based State Management

Internally, the system uses paths to track selections:

```typescript
// User selects: Eyes → IOP → Glaucoma
subOptions: {
  'Eyes': ['IOP'],
  'Eyes>IOP': ['Glaucoma']
}

// User selects: Eyes → Fluorescein → Ulcer → Deep
subOptions: {
  'Eyes': ['Fluorescein Stain'],
  'Eyes>Fluorescein Stain': ['Corneal Ulcer'],
  'Eyes>Fluorescein Stain>Corneal Ulcer': ['Deep']
}
```

The `>` separator creates hierarchy. This enables:
- Infinite nesting depth
- Automatic cleanup when parent unchecked
- Clear parent-child relationships

### UI Behavior

```
☐ System
   ☑ Diagnostic Test          (level 1)
      ☑ Finding A             (level 2 - indented)
         ☐ Severity - Mild    (level 3 - more indented)
         ☑ Severity - Severe  (level 3)
      ☐ Finding B
```

- Each level indents further right
- Children only appear when parent is checked
- Unchecking parent removes all descendants

### Template Generation

The system walks all paths and collects:
- **Diagnostics**: From any level that defines them
- **Assessments**: From any level that defines them
- **Plan items**: From any level that defines them

**Example:**
```
Path: Eyes>Fluorescein Stain>Corneal Ulcer>Deep

Collects:
- Diagnostic: "Fluorescein stain" (from Fluorescein Stain)
- Assessment: "Deep corneal ulcer" (from Deep)
- Plan: "Recommend referral" (from Deep)
```

---

## Best Practices

1. **Descriptive Names**: Use clear, clinical terminology for option names
2. **Consistent Details**: Use standard abbreviations (OD/OS, AD/AS, etc.)
3. **Complete Text**: Write full sentences for plan items
4. **Logical Grouping**: Group related diagnostics under appropriate systems
5. **Meaningful Nesting**: Nest only when it represents a logical clinical flow
6. **Test Changes**: Run `npm test` after adding new options

---

## Testing Your Changes

After adding new sub-options:

```bash
# 1. Start development server
npm start

# 2. Test in browser
# - Check the system's abnormality checkbox
# - Verify sub-option checkboxes appear
# - Select sub-options
# - Verify template includes correct text

# 3. Run automated tests
npm test
```

---

## Architecture Benefits

✅ **One File Changes**: Add features by editing only `systemTexts.ts`  
✅ **Automatic UI**: Checkboxes render automatically  
✅ **Type Safe**: TypeScript catches errors  
✅ **Consistent**: All systems work the same way  
✅ **Maintainable**: Easy to modify existing options  
✅ **Testable**: Isolated configuration makes testing simple  

---

## Migration from Old System

The old system required changes to:
1. `systemTexts.ts` - text configuration
2. `template.types.ts` - type definitions
3. `AbnormalitiesSelector.tsx` - UI checkboxes
4. `TemplateGenerator.tsx` - state management
5. `[System].ts` - template logic

The new system only requires:
1. `systemTexts.ts` - everything is here!
2. `AbnormalitiesSelector.tsx` - one-line registration (if new system)

This is an **80% reduction in code changes** for adding new features!

---

## Troubleshooting

### Sub-options don't appear
- Check that the system is in `systemConfigs` in `AbnormalitiesSelector.tsx`
- Verify `subOptions` is spelled correctly in config
- Ensure parent system checkbox is checked

### Text doesn't appear in template
- Check that the system builder supports sub-options
- Verify diagnostics/assessment/plan fields are spelled correctly
- Check browser console for TypeScript errors

### Tests fail
- Update test expectations to match new behavior
- Sub-options require explicit selection (not automatic)
- Run `npm test` to see specific failures

---

## Future Enhancements

Potential improvements to the configuration system:

1. **Conditional sub-options**: Show/hide based on other selections
2. **Validation**: Ensure required combinations are selected
3. **Templates**: Reusable patterns for common sub-option types
4. **Import/Export**: Share configurations between installations
5. **UI Customization**: Control checkbox order, grouping, styling

---

## Questions?

See the main README.md for:
- Project structure
- Development commands
- Deployment workflow
- Architecture overview

For specific questions about adding features, refer to the examples in:
- `src/config/systemTexts.ts` (Eyes and Cardiovascular configs)
- `src/templates/systems/Eyes.ts` (Generic sub-option handling)
- `src/components/AbnormalitiesSelector.tsx` (UI generation)