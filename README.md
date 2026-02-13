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
- **Copy to Clipboard**: One-click copying of generated notes

## Project Structure

The project has been refactored into a modular architecture for easier maintenance and extensibility:

```
src/
├── components/              # React UI components
│   ├── TemplateGenerator.tsx       # Main component (orchestrates UI)
│   ├── AnimalSelector.tsx          # Animal type selector
│   ├── VisitTypeSelector.tsx       # Visit type selector
│   ├── AbnormalitiesSelector.tsx   # Body system abnormality selector
│   └── ...other selectors
│
├── templates/               # Template generation logic
│   ├── MainTemplate.ts             # Main orchestrator for template generation
│   ├── systems/                    # Individual body system builders
│   │   ├── OralNasalThroat.ts
│   │   ├── Ears.ts
│   │   ├── Eyes.ts
│   │   ├── Cardiovascular.ts
│   │   └── ...other systems
│   └── sections/                   # Section-level template builders
│       ├── ObjectiveSection.ts     # Builds Objective section
│       ├── DiagnosticsSection.ts   # Builds Diagnostics section
│       ├── AssessmentSection.ts    # Builds Assessment section
│       └── PlanSection.ts          # Builds Plan section
│
├── config/                  # Configuration and text content
│   ├── systemTexts.ts              # Text for all body systems
│   └── sectionTexts.ts             # Text for plan/assessment sections
│
├── types/                   # TypeScript type definitions
│   └── template.types.ts           # All template-related types
│
└── utils/                   # Utility functions
    └── templateRenderers.ts        # HTML rendering functions
```

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

### Run Tests
```bash
npm test
```
Runs all unit tests. Tests are located in `src/components/__tests__/`.

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

## How to Modify Templates

### Adding New Text Content

1. **For body system text**: Edit `src/config/systemTexts.ts`
   - Add new properties to the relevant system config
   - Example: Adding new assessment text for ears

2. **For plan/assessment text**: Edit `src/config/sectionTexts.ts`
   - Add new plan items for visit types
   - Modify assessment configurations

### Adding New Body System Logic

1. **Create system builder**: Add new file in `src/templates/systems/`
   - Follow the pattern of existing systems (e.g., `Ears.ts`)
   - Implement: `buildXObjective`, `buildXDiagnostics`, `buildXAssessment`, `buildXPlan`

2. **Update section builders**: Import and use in `src/templates/sections/`
   - Add to `ObjectiveSection.ts` to include in template

3. **Update types**: Add new system name to `SystemName` type in `src/types/template.types.ts`

### Adding New Visit Types

1. Update `VisitType` in `src/types/template.types.ts`
2. Add configuration in `src/config/sectionTexts.ts`
3. Update logic in `src/templates/sections/PlanSection.ts`
4. Add UI option in `src/components/VisitTypeSelector.tsx`

### Modifying HTML Output

Edit the rendering functions in `src/utils/templateRenderers.ts` to change how the structured data is converted to HTML.

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

Add test cases to `src/components/__tests__/TemplateGenerator.test.tsx` following the existing patterns.

## Architecture Benefits

The modular architecture provides several advantages:

1. **Separation of Concerns**: Text content, logic, and rendering are separate
2. **Easy to Modify**: Change text without touching logic
3. **Testable**: Each module can be tested independently
4. **Extensible**: Add new systems/sections without affecting existing code
5. **Type-Safe**: TypeScript ensures correctness across the system

## Known Issues

- **Copy-to-Clipboard**: When pasting into some veterinary charting software, the notes may be editable when they shouldn't be. Workaround: Right-click and select "Copy" instead of using the button. This is being investigated.

## Browser Compatibility

Tested and working on:
- Chrome/Edge (recommended)
- Firefox
- Safari

## License

This project is for personal/educational use.

## Contributing

This is a personal project, but suggestions and feedback are welcome via GitHub issues.