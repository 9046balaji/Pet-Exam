import React from "react";
import { EXAM_DATA } from "../../data/readingData";
import SectionHead from "../shared/SectionHead";
import QuestionCard from "../shared/QuestionCard";

export function Part3Left({ activePara, fontScale }) {
  const { article } = EXAM_DATA.part3;
  return (
    <div>
      <SectionHead icon="📖" label="Article" title={article.title} />
      <div style={{background:'#fff',border:'1px solid #E2E0F0',borderRadius:12,padding:'22px 26px'}}>
        {article.paragraphs.map(p => (
          <div key={p.id} className={`para-b${activePara===p.id?' active':''}`}>
            <p className="rt" style={{fontSize:`${fontScale}em`}}>{p.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Part3Right({ answers, setAnswer, flagged, toggleFlag, submitted, setActivePara }) {
  return (
    <div>
      <SectionHead icon="❓" label="Questions" title="Questions 11–15" />
      <p style={{color:'#636E72',fontSize:'.88em',marginBottom:16}}>Click a question to highlight the relevant paragraph in the article.</p>
      {EXAM_DATA.part3.questions.map((q, i) => (
        <div key={q.id} onClick={()=>setActivePara(q.para)} style={{cursor:'pointer'}}>
          <QuestionCard qNum={i+11} question={q} ans={answers[q.id]}
            setAnswer={v=>setAnswer(q.id,v)} flagged={flagged.has(q.id)}
            toggleFlag={()=>toggleFlag(q.id)} submitted={submitted} delay={i*60} opts4={true} stopProp />
        </div>
      ))}
    </div>
  );
}
