import React, { useState } from "react";
import { EXAM_DATA } from "../../data/readingData";
import SectionHead from "../shared/SectionHead";
import FlagBtn from "../shared/FlagBtn";
import QNumBadge from "../shared/QNumBadge";

export function Part2Left({ fontScale }) {
  return (
    <div>
      <SectionHead icon="📚" label="Book Reviews A–H" title="Part 2 — Matching" />
      <p style={{color:'#636E72',fontSize:'.88em',marginBottom:20}}>Read these eight book descriptions, then match each person on the right to the most suitable book.</p>
      {EXAM_DATA.part2.books.map((b,i)=>(
        <div key={b.id} className="qcard mb-3 fu" style={{animationDelay:`${i*45}ms`}}>
          <div style={{display:'flex',alignItems:'flex-start',gap:12}}>
            <span style={{width:38,height:38,borderRadius:10,background:'#6C5CE7',color:'#fff',fontWeight:800,fontSize:'1.1em',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{b.id}</span>
            <div>
              <div style={{fontWeight:600,fontSize:'.95em',marginBottom:5,color:'#2D3436'}}>{b.title}</div>
              <div className="rt" style={{fontSize:`${fontScale*.86}em`,color:'#4A5568',lineHeight:1.65}}>{b.content}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Part2Right({ answers, setAnswer, flagged, toggleFlag }) {
  const [dragLetter, setDragLetter] = useState(null);
  const [dragSrc, setDragSrc] = useState(null);
  const [over, setOver] = useState(null);

  const usedMap = {};
  EXAM_DATA.part2.questions.forEach(q => { if(answers[q.id]) usedMap[answers[q.id]] = q.id; });

  const dropToSlot = (qId) => {
    if(!dragLetter) return;
    if(dragSrc !== 'bank') setAnswer(dragSrc, null);
    setAnswer(qId, dragLetter);
    setDragLetter(null); setDragSrc(null); setOver(null);
  };
  const dropToBank = () => {
    if(!dragLetter || dragSrc === 'bank') return;
    setAnswer(dragSrc, null);
    setDragLetter(null); setDragSrc(null); setOver(null);
  };

  return (
    <div>
      <SectionHead icon="🔗" label="Questions 6–10" title="Match People to Books" />
      <p style={{color:'#636E72',fontSize:'.88em',marginBottom:16}}>Drag a letter from the bank onto each person's card, or click an assigned letter to remove it.</p>

      {/* Letter Bank */}
      <div style={{background:'#F9F8FF',border:'1.5px dashed #C4B8F3',borderRadius:14,padding:'12px 14px',marginBottom:20}}
        onDragOver={e=>e.preventDefault()} onDrop={dropToBank}>
        <div style={{fontSize:'.75em',fontWeight:700,color:'#636E72',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:10}}>Letter Bank — drag to assign</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
          {EXAM_DATA.part2.books.map(b => {
            const used = !!usedMap[b.id];
            const assignedName = used ? EXAM_DATA.part2.questions.find(q=>q.id===usedMap[b.id])?.name : '';
            return (
              <div key={b.id} className={`ltile${used?' used':''}`}
                draggable={!used}
                onDragStart={() => !used && (setDragLetter(b.id), setDragSrc('bank'))}
                title={used ? `Assigned to ${assignedName}` : `Drag to assign "${b.title}"`}>
                {b.id}
                {used && <span style={{position:'absolute',top:-5,right:-5,background:'#00B894',borderRadius:'50%',width:15,height:15,display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,color:'#fff',border:'2px solid #fff'}}>✓</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Person Slots */}
      {EXAM_DATA.part2.questions.map((q,i) => {
        const assigned = answers[q.id];
        const book = assigned ? EXAM_DATA.part2.books.find(b=>b.id===assigned) : null;
        return (
          <div key={q.id} className="qcard mb-3 fu" style={{animationDelay:`${i*55}ms`}}>
            <div style={{display:'flex',alignItems:'flex-start',gap:10}}>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                  <QNumBadge n={i+6} />
                  <span style={{fontWeight:600,fontSize:'.95em',color:'#2D3436'}}>{q.name}</span>
                  <FlagBtn on={flagged.has(q.id)} onClick={()=>toggleFlag(q.id)} />
                </div>
                <p style={{fontSize:'.87em',lineHeight:1.6,color:'#4A5568',marginBottom:12,marginLeft:36}}>{q.desc}</p>
                <div className={`dzone${over===q.id?' over':''}${assigned?' has':''}`}
                  onDragOver={e=>{e.preventDefault();setOver(q.id)}}
                  onDragLeave={()=>setOver(null)}
                  onDrop={()=>dropToSlot(q.id)}
                  draggable={!!assigned}
                  onDragStart={()=>assigned&&(setDragLetter(assigned),setDragSrc(q.id))}>
                  {assigned ? <span>{assigned} — {book?.title}</span> : <span>Drop a letter here</span>}
                </div>
                {assigned && <button style={{marginTop:4,fontSize:'.75em',color:'#A0AEC0',background:'none',border:'none',cursor:'pointer'}} onClick={()=>setAnswer(q.id,null)}>Clear ×</button>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
