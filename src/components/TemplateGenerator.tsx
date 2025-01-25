import React, { useState } from "react";
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
      if (abnormalities.includes(system)) {
        return `${system}: Abnormal - <ENTER DETAILS>`;
      }
      return `${system}: Normal`;
    });
  };

  const template = `
Objective

    Subjective Assessment: ${subjectiveAssessment}
    Ease of Examination (5/5 is the easiest): ${easeOfExamination}
    Temperament: ${temperament}
    ${generateObjectiveText().join("\n    ")}

DIAGNOSTICS

     

ASSESSMENT

·        

PLAN

    Discussed above PE findings with owner
    Plan for today:
    Owner agrees with above plan and has no questions at this time.

Dr. Woodling
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(template).then(
      () => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000); // Reset success message after 2 seconds
      },
      () => {
        alert("Failed to copy template to clipboard.");
      }
    );
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
      <textarea
        readOnly
        value={template}
        rows={20}
        cols={80}
        style={{ width: "100%", fontFamily: "monospace" }}
      />
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
