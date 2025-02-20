import React, { useState, useRef } from "react";
import AbnormalitiesSelector from "./AbnormalitiesSelector";
import EaseOfExaminationSelector from "./EaseOfExaminationSelector";
import SubjectiveAssessmentSelector from "./SubjectiveAssessmentSelector";
import TemperamentSelector from "./TemperamentSelector";
import AnimalSelector from "./AnimalSelector";
import VisitTypeSelector from "./VisitTypeSelector";

const TemplateGenerator: React.FC = () => {
  const [animal, setAnimal] = useState("Dog");
  const [visitType, setVisitType] = useState("Wellness");
  const [abnormalities, setAbnormalities] = useState<string[]>([]);
  const [easeOfExamination, setEaseOfExamination] = useState(5);
  const [subjectiveAssessment, setSubjectiveAssessment] = useState("BAR");
  const [temperament, setTemperament] = useState("Well-behaved");
  const [copySuccess, setCopySuccess] = useState(false);
  const templateRef = useRef<HTMLDivElement>(null);
  let earsAbnormal = false;
  let eyesAbnormal = false;

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
      if (system === "Ears") {
        if (abnormalities.includes(system)) {
          earsAbnormal = true;
          return `
          <li>Ears: Abnormal</li>
            <ul>
              <li>AD</li>
              <li>AS</li>
            </ul>
          `;
        } else {
          return `<li>Ears: Normal</li>`;
        }
      } else if (system === "Eyes") {
        if (abnormalities.includes(system)) {
          eyesAbnormal = true;
          return `
          <li>Eyes: Abnormal</li>
            <ul>
              <li>OD</li>
              <li>OS</li>
            </ul>
          `;
        } else {
          return `<li>Eyes: Normal</li>`;
        }
      }
      else if (system === "Cardiovascular") {
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

  const generateDiagnosticsText = () => {
    if (earsAbnormal) {
      return `
        <li>Ear cytology</li>
          <ul><li>AD</li></ul>
          <ul><li>AS</li></ul>
      `;
    } else if (eyesAbnormal) {
      return `
        <li>Fluorescein stain</li>
          <ul><li>OD</li></ul>
          <ul><li>OS</li></ul>
        <li>Schirmer tear test</li>
          <ul><li>OD</li></ul>
          <ul><li>OS</li></ul>
      `;
    }  else {
      return `
        <li> </li>
      `;
    }
  }

  const generateAssessmentsText = () => {
    if (abnormalities.length != 0) {
      if (eyesAbnormal) {
        return `
          <li>Corneal ulcer</li>
          <li>Conjunctivitis</li>
        `;
      } else {
        return `
          <li></li>
        `;
      }
    } else {
      return `
        <li>Apparently healthy!</li>
      `;
    }
  }

  const generatePlanText = () => {
    let sickPlanHtml = ``;
    if (visitType === "Wellness") {
      if (animal === "Dog") {
        return `
          <li>Discussed above PE findings with owner</li>
          <li>Discussed dental health – recommend brushing teeth daily with VOHC approved brushes and toothpaste. Discussed with owner to start slow and build up to daily brushing (let patient lick toothpaste off toothbrush x few days, then touch toothbrush to teeth x few days, then try brushing)</li>
          <li>Discussed diet – discussed risks with grain free and raw diets – do not recommend!</li>
          <li>Discussed parasite prevention – recommend monthly flea/tick prevention year round with annual fecals. Recommend simparica and discussed with owners difference between simparica and simparica trio. Owner elects for ***simparica OR simparica trio with HWT today.</li>
          <li>Discussed activity and mobility – no changes noted by owner and no signs of arthritis.</li>
          <li>Discussed vaccines – today due for ***</li>
          <li>Discussed leptospirosis vaccine – now recommended as core vaccine by AAHA due to risks associated with disease and zoonotic risk. Recommend 1st lepto vaccine today and booster in 3-4 weeks. Discussed risks of lepto vaccine with owners.</li>
          <li>Plan for today:</li>
            <ul><li> </li></ul>
          <li>Owner agrees with above plan and has no questions at this time.</li>
        `;
      } else if (animal === "Cat") {
        return `
          <li>Discussed above PE findings with owner</li>
          <li>Discussed dental health – recommend brushing teeth daily with VOHC approved brushes and toothpaste. Discussed with owner to start slow and build up to daily brushing (let patient lick toothpaste off toothbrush x few days, then touch toothbrush to teeth x few days, then try brushing)</li>
          <li>Discussed diet – discussed potential risks with grain free diets and cats – do not recommend at this time. Discussed risks with raw diets (especially poultry) and raw milk – increased risk for Avian influenza – do not recommend any raw diet including raw milk for cats.</li>
          <li>Indoor/outdoor status – discussed risks associated with FIV/FeLV and avian influenza with owner.</li>
          <li>Discussed parasite prevention – recommend monthly flea/tick prevention year round with annual fecals. Recommend revolution.</li>
          <li>Discussed activity and mobility – no changes in jumping on couches/bed or using litterbox per owner report.</li>
          <li>Discussed vaccines – today due for ***</li>
          <li>Discussed FeLV vaccine – recommend for all cats under 1 yr of age and then for indoor/outdoor cats. ***Recommend FIV/FeLV test today and if negative recommend FeLV vax today and booster in 3-4 weeks. ***Recommend annual FeLV booster.</li>
          <li>Plan for today:</li>
            <ul><li> </li></ul>
          <li>Owner agrees with above plan and has no questions at this time.</li>
        `;
      }
    }
    if (earsAbnormal) {
      return `
        <li>Discussed above PE findings with owner</li>
        <li>Discussed with owner otitis externa. Recommend ear cytology for further evaluation.</li>
        <li>Discussed with owner likely underlying allergies - if ear infections re-occur or if skin issues develop will plan to discuss in more detail</li>
        <li>Plan for today:</li>
          <ul><li> </li></ul>
        <li>Owner agrees with above plan and has no questions at this time.</li>
      `;
    } else if (eyesAbnormal) {
      return `
        <li>Discussed above PE findings with owner</li>
        <li>Discussed eye findings with owner – recommend fluorescein stain to evaluate for corneal ulcer.</li>
        <li>Recommend Schirmer tear test to evaluate tear production given PE findings. </li>
        <li>Plan for today:</li>
          <ul><li> </li></ul>
        <li>Owner agrees with above plan and has no questions at this time.</li>
      `;
    } else {
      return `
        <li>Discussed above PE findings with owner</li>
        <li>Plan for today:</li>
          <ul><li> </li></ul>
        <li>Owner agrees with above plan and has no questions at this time.</li>
      `;
    }
  };

  const templateHTML = `
    <p><strong>OBJECTIVE</strong></p>
    <ul>
      <li>Subjective Assessment: ${subjectiveAssessment}</li>
      <li>Ease of Examination (5/5 is the easiest): ${easeOfExamination}</li>
      <li>Temperament: ${temperament}</li>
      ${generateObjectiveText()}
    </ul>
    
    <p><strong>DIAGNOSTICS</strong></p>
    <ul>${generateDiagnosticsText()}</ul>
    
    <p><strong>ASSESSMENT</strong></p>
    <ul>${generateAssessmentsText()}</ul>
    
    <p><strong>PLAN</strong></p>
    <ul>${generatePlanText()}</ul>

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
    <div style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
      <div style={{ width: "40%" }}>
        <AnimalSelector value={animal} onChange={setAnimal} />
        <VisitTypeSelector value={visitType} onChange={setVisitType} />
        <SubjectiveAssessmentSelector value={subjectiveAssessment} onChange={setSubjectiveAssessment} />
        <EaseOfExaminationSelector value={easeOfExamination} onChange={setEaseOfExamination} />
        <TemperamentSelector value={temperament} onChange={setTemperament} />
        <AbnormalitiesSelector abnormalities={abnormalities} toggle={toggleAbnormality} />
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
