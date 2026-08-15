import React, { useState, useRef, useEffect } from "react";
import AbnormalitiesSelector from "./AbnormalitiesSelector";
import EaseOfExaminationSelector from "./EaseOfExaminationSelector";
import SubjectiveAssessmentSelector from "./SubjectiveAssessmentSelector";
import TemperamentSelector from "./TemperamentSelector";
import AnimalSelector from "./AnimalSelector";
import VisitTypeSelector from "./VisitTypeSelector";
import DietSelector from "./DietSelector";
import VaccinesSelector from "./VaccinesSelector";
import { generateTemplate } from "../templates/MainTemplate";
import { TemplateContext } from "../types/template.types";

const TemplateGenerator: React.FC = () => {
  const [animal, setAnimal] = useState("Dog");
  const [visitType, setVisitType] = useState("Wellness");
  const [abnormalities, setAbnormalities] = useState<string[]>([]);
  const [subOptions, setSubOptions] = useState<Record<string, string[]>>({});
  const [murmurGrade, setMurmurGrade] = useState(3);
  const [murmurSide, setMurmurSide] = useState<string | "">("");
  const [easeOfExamination, setEaseOfExamination] = useState(5);
  const [subjectiveAssessment, setSubjectiveAssessment] = useState("BAR");
  const [temperament, setTemperament] = useState("Well-behaved");
  const [dietOptions, setDietOptions] = useState<string[]>([]);
  const [vaccineOptions, setVaccineOptions] = useState<string[]>([]);
  const [copySuccess, setCopySuccess] = useState(false);
  const [hasManualEdits, setHasManualEdits] = useState(false);
  const templateRef = useRef<HTMLDivElement>(null);

  const toggleAbnormality = (system: string) => {
    setAbnormalities((prev) =>
      prev.includes(system)
        ? prev.filter((item) => item !== system)
        : [...prev, system]
    );
  };

  const toggleSubOption = (parentPath: string, option: string) => {
    setSubOptions((prev) => {
      const pathOptions = prev[parentPath] || [];
      const isCurrentlySelected = pathOptions.includes(option);
      const newPathOptions = isCurrentlySelected
        ? pathOptions.filter((item) => item !== option)
        : [...pathOptions, option];
      
      const newSubOptions = {
        ...prev,
        [parentPath]: newPathOptions,
      };

      // If unchecking an option, recursively clear all child selections
      if (isCurrentlySelected) {
        const childPath = `${parentPath}>${option}`;
        Object.keys(newSubOptions).forEach(key => {
          if (key.startsWith(childPath)) {
            delete newSubOptions[key];
          }
        });
      }
      
      return newSubOptions;
    });
  };

  // Build template context from current state
  const context: TemplateContext = {
    animal: animal as 'Dog' | 'Cat',
    visitType: visitType as 'Wellness' | 'Sick' | 'Puppy' | 'Kitten',
    subjectiveAssessment: subjectiveAssessment as 'BAR' | 'QAR',
    easeOfExamination,
    temperament,
    abnormalities,
    subOptions,
    murmurGrade,
    murmurSide: murmurSide as '' | 'left' | 'right' | 'bilateral',
    dietOptions,
    vaccineOptions,
  };

  // Generate template HTML using the new modular system
  const templateHTML = generateTemplate(context);

  // Write the generated HTML into the preview imperatively instead of through
  // dangerouslySetInnerHTML. React owns the node's contents when using that
  // prop, so any text the user typed into the contentEditable preview was
  // silently discarded the next time a selection changed and the generated
  // string differed. Skipping the write while hasManualEdits is true preserves
  // those edits, and because we never rewrite innerHTML during typing the
  // caret position is left alone.
  useEffect(() => {
    if (!hasManualEdits && templateRef.current) {
      templateRef.current.innerHTML = templateHTML;
    }
  }, [templateHTML, hasManualEdits]);

  // Clearing the flag re-runs the effect above, which regenerates from the
  // current selections and throws away the manual edits.
  const discardManualEdits = () => setHasManualEdits(false);

  const copyToClipboard = async () => {
    if (templateRef.current) {
      // Clone the template and strip contentEditable attributes to prevent
      // pasted content from being editable in veterinary charting software
      const clone = templateRef.current.cloneNode(true) as HTMLElement;
      clone.removeAttribute('contenteditable');
      clone.querySelectorAll('[contenteditable]').forEach(el => 
        el.removeAttribute('contenteditable')
      );
      
      // Create temporary element with cleaned HTML for copying
      const temp = document.createElement('div');
      
      // Apply font styles to ensure they're preserved in clipboard
      temp.style.fontFamily = 'Arial';
      temp.style.fontSize = '10pt';
      
      temp.innerHTML = clone.innerHTML;
      temp.style.position = 'fixed';
      temp.style.left = '-9999px';
      document.body.appendChild(temp);
      
      // Select and copy the cleaned content
      const range = document.createRange();
      range.selectNodeContents(temp);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      document.execCommand('copy');
      
      // Cleanup
      document.body.removeChild(temp);
      window.getSelection()?.removeAllRanges();

      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
      <div style={{ width: "40%" }}>
        <AnimalSelector value={animal} onChange={setAnimal} />
        <VisitTypeSelector value={visitType} onChange={setVisitType} animal={animal}/>
        <SubjectiveAssessmentSelector value={subjectiveAssessment} onChange={setSubjectiveAssessment} />
        <EaseOfExaminationSelector value={easeOfExamination} onChange={setEaseOfExamination} />
        <TemperamentSelector value={temperament} onChange={setTemperament} />
        <AbnormalitiesSelector 
          abnormalities={abnormalities}
          toggle={toggleAbnormality}
          subOptions={subOptions}
          toggleSubOption={toggleSubOption}
          murmurGrade={murmurGrade}
          setMurmurGrade={setMurmurGrade}
          murmurSide={murmurSide}
          setMurmurSide={setMurmurSide}
        />
        <DietSelector 
          selectedOptions={dietOptions}
          onChange={setDietOptions}
        />
        <VaccinesSelector 
          selectedOptions={vaccineOptions}
          onChange={setVaccineOptions}
        />
      </div>
      <div style={{ width: "55%", textAlign: "left" }}>
        <h2>Generated Template</h2>
        <div
          ref={templateRef}
          contentEditable
          onInput={() => setHasManualEdits(true)}
          data-testid="template-preview"
          style={{
            width: "100%",
            fontFamily: "Arial",
            fontSize: "10pt",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "5px",
            minHeight: "200px",
          }}
        ></div>
        {hasManualEdits && (
          <div
            data-testid="manual-edits-notice"
            style={{
              marginTop: "10px",
              padding: "10px",
              border: "1px solid #ffa500",
              borderRadius: "5px",
              backgroundColor: "#fff8e6",
            }}
          >
            <span>
              You have edited this note by hand, so it is no longer updating
              automatically. New selections will not appear until you discard
              your edits.
            </span>
            <button
              onClick={discardManualEdits}
              style={{
                marginLeft: "10px",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              Discard edits and regenerate
            </button>
          </div>
        )}
        <div style={{ marginTop: "10px" }}>
          <button onClick={copyToClipboard} style={{ padding: "10px 20px", fontSize: "16px" }}>
            Copy to Clipboard
          </button>
          {copySuccess && (
            <span style={{ marginLeft: "10px", color: "green", fontWeight: "bold" }}>
              Copied!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateGenerator;