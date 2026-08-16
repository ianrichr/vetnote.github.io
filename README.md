# VetNote - Veterinary Medical Chart Template Generator

A React-based web application that generates customizable SOAP (Subjective, Objective, Assessment, Plan) note templates for veterinarians. The tool allows veterinarians to quickly generate comprehensive medical chart notes by selecting various options, which can then be copied and pasted into their charting software.

## Live Site

The application is deployed at: https://ianrichr.github.io/vetnote.github.io/

## Features

- **Animal Types**: Dog and Cat templates
- **Visit Types**: Wellness, Sick, Puppy, and Kitten visits
- **Customizable Assessment**: Multiple subjective assessment and temperament options
- **Body Systems**: Comprehensive coverage of all veterinary body systems
- **Abnormality Tracking**: Easy selection of abnormal findings with automatic template adjustments
- **Nested Sub-Options**: Infinitely nestable diagnostic tests and findings for detailed clinical documentation
- **Configuration-Driven**: Add new template options by editing a single configuration file
- **Copy to Clipboard**: One-click copying of generated notes

## Project Structure

The project has been refactored into a modular architecture for easier maintenance and extensibility:

```
src/
├── App.tsx                  # Tab shell, renders one tab per generator mode
├── modes/
│   ├── types.ts             # TemplateMode contract
│   ├── registry.ts          # MODES list, the only place a mode is registered
│   └── chart/               # Chart note generator, self-contained
│       ├── components/              # React UI components
│       │   ├── TemplateGenerator.tsx    # Chart panel (orchestrates UI)
│       │   ├── AnimalSelector.tsx
│       │   ├── VisitTypeSelector.tsx
│       │   ├── AbnormalitiesSelector.tsx
│       │   └── ...other selectors
│       ├── templates/
│       │   ├── MainTemplate.ts          # Orchestrates template generation
│       │   └── sections/                # Section-level builders
│       │       ├── ObjectiveSection.ts
│       │       ├── DiagnosticsSection.ts
│       │       ├── AssessmentSection.ts
│       │       └── PlanSection.ts
│       ├── config/
│       │   ├── systemTexts.ts           # Text and options for all body systems
│       │   └── sectionTexts.ts          # Text for plan/assessment sections
│       ├── types/
│       │   └── template.types.ts
│       └── utils/
│           ├── systemBuilders.ts        # Generic builders and aggregators
│           └── templateRenderers.ts     # HTML rendering functions
```

There are no per-system files. Every body system is described entirely by its
config object in `systemTexts.ts`, and the section builders iterate
`allSystemConfigsList` to assemble output.

## Development Commands

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm start
```
Opens the app at http://localhost:3000 in development mode with hot reloading.

**For HTTPS (useful for testing clipboard functionality):**
```bash
HTTPS=true npm start
```
Opens the app at https://localhost:3000. Your browser will show a security warning for the self-signed certificate - click "Advanced" and "Proceed" (safe for local development).

Alternatively, create a `.env` file in the project root:
```
HTTPS=true
```

### Run Tests
```bash
npm test
```
Runs all unit tests. Tests are located in `src/modes/chart/components/__tests__/`.

To run tests without watch mode:
```bash
npm test -- --watchAll=false
```

### Build for Production
```bash
npm run build
```
Creates an optimized production build in the `build/` directory.

### Deploy to GitHub Pages
```bash
npm run deploy
```
Builds and deploys the application to the `gh-pages` branch, making it live at the GitHub Pages URL.

## Deployment Workflow

The project uses a two-branch setup:
- **`main` branch**: Contains the source code
- **`gh-pages` branch**: Contains the built/deployed application (auto-generated)

### Deployment Process

1. Make changes to source code on the `main` branch
2. Commit and push changes:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```
3. Deploy to production:
   ```bash
   npm run deploy
   ```
   
This automatically:
- Builds the production version
- Pushes to the `gh-pages` branch
- Updates the live site

**Note**: You should never manually edit the `gh-pages` branch. It's automatically managed by the deployment script.

## Architecture Overview

### Generic Builder Pattern

VetNote uses a **generic builder pattern** that eliminates code duplication across all 12 body systems:

- **Generic Builders** (`src/modes/chart/utils/systemBuilders.ts`): reusable functions that work for ANY body system
  - `buildGenericObjective()` - Handles objective section for all systems
  - `buildGenericDiagnostics()` - Handles diagnostics section for all systems
  - `buildGenericAssessment()` - Handles assessment section for all systems
  - `buildGenericPlan()` - Handles plan section with nested items support for all systems

- **Aggregators** in the same file (`buildAllObjectives`, `buildAllDiagnostics`,
  `buildAllAssessments`, `buildAllPlans`) run those builders across every config
  in `allSystemConfigsList`. The section builders call the aggregators, so a
  system never needs its own file or its own import anywhere.

**Benefits:**
- **No per-system code**: a body system is a config object and nothing else
- **Consistency**: All systems behave identically
- **Maintainability**: Fix bugs once, applies to all systems
- **Extensibility**: Add features to generic builders, all systems get them automatically

### Configuration-Driven Architecture

VetNote uses a powerful configuration-driven system that makes adding new template features incredibly simple. **See [CONFIGURATION_GUIDE.md](CONFIGURATION_GUIDE.md) for detailed documentation.**

### Quick Example: Adding Sub-Options

To add new diagnostic options with findings (like IOP test with Glaucoma finding):

```typescript
// In src/modes/chart/config/systemTexts.ts
export const eyesConfig = {
  name: 'Eyes',  // Name property enables auto-discovery
  // ... existing config
  subOptions: {
    'IOP': {
      diagnostics: {
        label: 'Intraocular pressure',
        details: ['OD', 'OS'],
      },
      // Nest findings under the diagnostic
      subOptions: {
        'Glaucoma': {
          assessment: 'Glaucoma',
          plan: 'Discussed glaucoma management...'
        },
        'Normal Pressure': {
          assessment: 'Normal intraocular pressure'
        }
      }
    }
  }
};

// Register in allSystemConfigsList (one-time only for new systems)
export const allSystemConfigsList = [
  // ... other configs
  eyesConfig,  // Auto-discovered via name property
];
```

**That's it!** The UI checkboxes, state management, and template generation happen automatically.

### Key Benefits

- ✅ **Automatic Discovery**: Configs auto-register via `name` property
- ✅ **One File Changes**: Add features by editing only `systemTexts.ts`
- ✅ **Infinite Nesting**: Nest sub-options as deep as clinically meaningful
- ✅ **Automatic UI**: Checkboxes render automatically
- ✅ **Auto-Cleanup**: Unchecking parent options clears all child selections
- ✅ **Type-Safe**: TypeScript catches configuration errors

For comprehensive documentation on the configuration system, see **[CONFIGURATION_GUIDE.md](CONFIGURATION_GUIDE.md)**.

---

## How to Modify Templates

### Adding New Text Content

1. **For body system text**: Edit `src/modes/chart/config/systemTexts.ts`
   - Add new properties to the relevant system config
   - Add sub-options with nested findings
   - Example: See `eyesConfig` for nested diagnostic options

2. **For plan/assessment text**: Edit `src/modes/chart/config/sectionTexts.ts`
   - Add new plan items for visit types
   - Modify assessment configurations

### Adding a New Body System

1. Add a config object in `systemTexts.ts` with a `name` property
2. Append it to `allSystemConfigsList` in the same file
3. Add the system name to the `SystemName` type in `types/template.types.ts`
4. Add the name to the `systems` array in `AbnormalitiesSelector.tsx`

No builder file is needed. The section builders discover the config through
`allSystemConfigsList`.

### Adding New Visit Types

1. Update `VisitType` in `src/modes/chart/types/template.types.ts`
2. Add configuration in `src/modes/chart/config/sectionTexts.ts`
3. Update logic in `src/modes/chart/templates/sections/PlanSection.ts`
4. Add UI option in `src/modes/chart/components/VisitTypeSelector.tsx`

### Adding a New Generator Mode

1. Build a panel component that owns its own state
2. Append an entry to `MODES` in `src/modes/registry.ts`

The tab shell in `App.tsx` picks it up automatically.

### Modifying HTML Output

Edit the rendering functions in `src/modes/chart/utils/templateRenderers.ts` to change how the structured data is converted to HTML.

## Testing

The project includes comprehensive unit tests that verify template generation remains consistent after code changes.

### Test Coverage

- Default template generation
- All visit types (Wellness, Sick, Puppy, Kitten)
- All animal types (Dog, Cat)
- Abnormality handling (Ears, Eyes, Cardiovascular, etc.)
- Multiple abnormalities
- User interactions (changing assessments, temperament, etc.)

### Running Specific Tests

```bash
npm test -- --testNamePattern="should generate correct template for puppy visit"
```

### Adding New Tests

Add test cases to `src/modes/chart/components/__tests__/TemplateGenerator.test.tsx` following the existing patterns.

## Architecture Benefits

The modular architecture provides several advantages:

1. **Separation of Concerns**: Text content, logic, and rendering are separate
2. **Easy to Modify**: Change text without touching logic
3. **Testable**: Each module can be tested independently
4. **Extensible**: Add new systems/sections without affecting existing code
5. **Type-Safe**: TypeScript ensures correctness across the system

## Known Issues

- **Copy-to-Clipboard**: The copy function now strips `contentEditable` attributes before copying to prevent pasted notes from being unexpectedly editable in veterinary charting software. If you still experience issues with editability after pasting, please report via GitHub issues with details about your charting software.

## Browser Compatibility

Tested and working on:
- Chrome/Edge (recommended)
- Firefox
- Safari

## License

This project is for personal/educational use.

## Contributing

This is a personal project, but suggestions and feedback are welcome via GitHub issues.