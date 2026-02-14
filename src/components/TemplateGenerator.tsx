import React, { useState, useRef } from "react";
import AbnormalitiesSelector from "./AbnormalitiesSelector";
import EaseOfExaminationSelector from "./EaseOfExaminationSelector";
import SubjectiveAssessmentSelector from "./SubjectiveAssessmentSelector";
import TemperamentSelector from "./TemperamentSelector";
import AnimalSelector from "./AnimalSelector";
import VisitTypeSelector from "./VisitTypeSelector";
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
  const [copySuccess, setCopySuccess] = useState(false);
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
  };

  // Generate template HTML using the new modular system
  const templateHTML = generateTemplate(context);

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
      </div>
      <div style={{ width: "55%", textAlign: "left" }}>
        <h2>Generated Template</h2>
        <div
          ref={templateRef}
          contentEditable
          dangerouslySetInnerHTML={{ __html: templateHTML }}
          style={{
            width: "100%",
            fontFamily: "Arial",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "5px",
            minHeight: "200px",
          }}
        ></div>
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