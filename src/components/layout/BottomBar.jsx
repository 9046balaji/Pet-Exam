import React, { useState } from "react";
import { EXAM_DATA } from "../../data/readingData";

const ALL_QIDS = [
  ...EXAM_DATA.part1.questions.map(q=>({id:q.id,part:1})),
  ...EXAM_DATA.part2.questions.map(q=>({id:q.id,part:2})),
  ...EXAM_DATA.part3.questions.map(q=>({id:q.id,part:3})),
  ...[1,2,3,4,5].map(n=>({id:`q4_${n}`,part:4})),
  ...EXAM_DATA.part5.gaps.map(g=>({id:g.id,part:5})),
  ...EXAM_DATA.part6.gaps.map(g=>({id:g.id,part:6})),
];

export default function BottomBar({ currentPart, setCurrent, answers, flagged, allAnswered, onSubmit }) {
  const [showNav, setShowNav] = useState(false);
  
  const getStatus = (id) => {
    const a = answers[id];
    if(flagged.has(id)) return 'flagged';
    if(a && a.trim() !== '') return 'ans';
    return '';
  };

  return (
    <div style={{position:'sticky',bottom:0,background:'#fff',borderTop:'1px solid #E8E6F5',padding:'10px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,zIndex:200,boxShadow:'0 -2px 16px rgba(0,0,0,.08)'}}>
      <button onClick={()=>setCurrent(p=>Math.max(1,p-1))} disabled={currentPart===1}
        style={{padding:'8px 18px',borderRadius:9,border:'1.5px solid #E2E0F0',background:'#fff',cursor:currentPart===1?'not-allowed':'pointer',color:currentPart===1?'#CBD5E1':'#2D3436',fontFamily:'Outfit,system-ui',fontWeight:600,fontSize:'.88em',transition:'all 150ms',opacity:currentPart===1?.5:1}}>
        ← Previous
      </button>

      {/* Question navigator toggle */}
      <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
        <button onClick={()=>setShowNav(v=>!v)}
          style={{fontSize:'.78em',color:'#6C5CE7',background:'none',border:'none',cursor:'pointer',fontWeight:600,fontFamily:'Outfit,system-ui'}}>
          {showNav?'▼ Hide Navigator':'▲ Question Navigator'}
        </button>
        {showNav && (
          <div style={{display:'flex',flexWrap:'wrap',gap:4,maxWidth:480,justifyContent:'center'}}>
            {ALL_QIDS.map(({id,part},idx)=>(
              <div key={id} className={`qnav${getStatus(id)==='ans'?' ans':getStatus(id)==='flagged'?' flagged':''}`}
                onClick={()=>setCurrent(part)}
                title={`Q${idx+1} · Part ${part}${getStatus(id)==='ans'?' ✓':''}`}>
                {idx+1}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <button onClick={()=>setCurrent(p=>Math.min(6,p+1))} disabled={currentPart===6}
          style={{padding:'8px 18px',borderRadius:9,border:'1.5px solid #6C5CE7',background:currentPart===6?'transparent':'#6C5CE7',color:currentPart===6?'#CBD5E1':'#fff',cursor:currentPart===6?'not-allowed':'pointer',fontFamily:'Outfit,system-ui',fontWeight:600,fontSize:'.88em',transition:'all 150ms',opacity:currentPart===6?.5:1}}>
          Next →
        </button>
        <button onClick={()=>{
          const unanswered = 32 - Object.values(answers).filter(v=>v&&v.trim()!=='').length;
          if(unanswered > 0) { if(!window.confirm(`You have ${unanswered} unanswered question${unanswered!==1?'s':''}. Submit anyway?`)) return; }
          onSubmit();
        }}
          style={{padding:'8px 16px',borderRadius:9,border:'none',background:'#E17055',color:'#fff',cursor:'pointer',fontFamily:'Outfit,system-ui',fontWeight:700,fontSize:'.86em',transition:'all 150ms',boxShadow:'0 2px 8px rgba(225,112,85,.4)'}}>
          Submit Paper
        </button>
      </div>
    </div>
  );
}
