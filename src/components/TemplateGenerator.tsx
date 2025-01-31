import React, { useState, useRef } from "react";
import AbnormalitiesSelector from "./AbnormalitiesSelector";
import EaseOfExaminationSelector from "./EaseOfExaminationSelector";
import SubjectiveAssessmentSelector from "./SubjectiveAssessmentSelector";
import TemperamentSelector from "./TemperamentSelector";

const TemplateGenerator: React.FC = () => {
  const [abnormalities, setAbnormalities] = useState<string[]>([]);
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

  const generateObjectiveText = () => {
    const systems = [
      "Oral-Nasal-Throat",
      "Ears",
      "Eyes",
      "Cardiovascular",
      "Respiratory",
      "Abdominal",
      "Genitourinary",
      "Musculoskeletal",
      "Integument",
      "Lymphatics",
      "Neurological",
      "Rectal",
    ];

    return systems.map((system) => {
      if (system === "Cardiovascular") {
        if (abnormalities.includes(system)) {
          return `<li>Cardiovascular: Abnormal</li>`;
        } else {
          return `<li>Cardiovascular: Normal rate and rhythm; no murmur auscultated</li>`;
        }
      } else if (system === "Respiratory") {
        if (abnormalities.includes(system)) {
          return `<li>Respiratory: Abnormal</li>`;
        } else {
          return `<li>Respiratory: Normal bronchovesicular sounds auscultated bilaterally</li>`;
        }
      } else if (system === "Abdominal") {
        if (abnormalities.includes(system)) {
          return `<li>Abdominal: Abnormal</li>`;
        } else {
          return `<li>Abdominal: Normal - soft and non-tender on palpation</li>`;
        }
      } else if (system === "Musculoskeletal") {
        if (abnormalities.includes(system)) {
          return `<li>Musculoskeletal: Abnormal</li>`;
        } else {
          return `<li>Musculoskeletal: Normal – full ROM in all joints, no crepitus or swelling appreciated on palpation</li>`;
        }
      } else if (system === "Lymphatics") {
        if (abnormalities.includes(system)) {
          return `<li>Lymphatics: Abnormal</li>`;
        } else {
          return `<li>Lymphatics: Normal – no lymphadenopathy appreciated</li>`;
        }
      } else if (system === "Neurological") {
        if (abnormalities.includes(system)) {
          return `<li>Neurological: Abnormal</li>`;
        } else {
          return `<li>Neurological: Normal - mentation appropriate; full neurological exam not performed</li>`;
        }
      } else if (system === "Rectal") {
        if (abnormalities.includes(system)) {
          return `<li>Rectal: Abnormal</li>`;
        } else {
          return `<li>Rectal: <u>Not examined</u></li>`;
        }
      } else {
        return abnormalities.includes(system)
          ? `<li>${system}: Abnormal</li>`
          : `<li>${system}: Normal</li>`;
      }
    }).join("");
  };

  const templateHTML = `
    <p><span><strong>OBJECTIVE</span></strong></p>
    <ul>
      <li>Subjective Assessment: ${subjectiveAssessment}</li>
      <li>Ease of Examination (5/5 is the easiest): ${easeOfExamination}</li>
      <li>Temperament: ${temperament}</li>
      ${generateObjectiveText()}
    </ul>
    
    <p><span><strong>DIAGNOSTICS</span></strong></p>
    <ul><li> </li></ul>
    
    <p><span><strong>ASSESSMENT</span></strong></p>
    <ul><li>Apparently healthy!</li></ul>
    
    <p><span><strong>PLAN</span></strong></p>
    <ul>
      <li>Discussed above PE findings with owner</li>
      <li>Plan for today:</li>
      <li>Owner agrees with above plan and has no questions at this time.</li>
    </ul>

    <p>KSW</p>
  `;

  const copyToClipboard = async () => {
    if (templateRef.current) {
      const range = document.createRange();
      range.selectNode(templateRef.current);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      document.execCommand("copy");
      window.getSelection()?.removeAllRanges();

      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div>
      <SubjectiveAssessmentSelector
        value={subjectiveAssessment}
        onChange={setSubjectiveAssessment}
      />
      <EaseOfExaminationSelector value={easeOfExamination} onChange={setEaseOfExamination} />
      <TemperamentSelector value={temperament} onChange={setTemperament} />
      <AbnormalitiesSelector abnormalities={abnormalities} toggle={toggleAbnormality} />
      
      <h2>Generated Template</h2>
      <div
        ref={templateRef}
        contentEditable
        dangerouslySetInnerHTML={{ __html: templateHTML }}
        style={{ width: "100%", fontFamily: "Arial" }}
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
  );
};

export default TemplateGenerator;
