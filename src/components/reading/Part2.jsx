import { useState } from "react";
import { EXAM_DATA } from "../../data/readingData";
import SectionHead from "../shared/SectionHead";
import FlagBtn from "../shared/FlagBtn";
import QNumBadge from "../shared/QNumBadge";

export function Part2Left({ fontScale }) {
  return (
    <div>
      <SectionHead icon="📚" label="Book Reviews A–H" title="Part 2 — Matching" />
      <p className="text-text-muted text-[0.88em] mb-5">Read these eight book descriptions, then match each person on the right to the most suitable book.</p>
      {EXAM_DATA.part2.books.map((b,i)=>(
        <div key={b.id} className="qcard mb-3 fu" style={{animationDelay:`${i*45}ms`}}>
          <div style={{display:'flex',alignItems:'flex-start',gap:12}}>
            <span style={{width:38,height:38,borderRadius:10,background:'var(--color-primary)',color:'#fff',fontWeight:800,fontSize:'1.1em',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{b.id}</span>
            <div>
              <div className="font-semibold text-[0.95em] mb-1.5 text-text">{b.title}</div>
              <div className="rt" style={{fontSize:`${fontScale*.86}em`,color:'var(--color-text-muted)',lineHeight:1.65}}>{b.content}</div>
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
      <p className="text-text-muted text-[0.88em] mb-4">Drag a letter from the bank onto each person's card, or click an assigned letter to remove it.</p>

      {/* Letter Bank */}
      <div 
        className="bg-surface dark:bg-card border-[1.5px] border-dashed border-[#C4B8F3] dark:border-[#C4B8F3]/50 rounded-[14px] p-[12px_14px] mb-5"
        onDragOver={e=>e.preventDefault()} onDrop={dropToBank}
      >
        <div className="text-[0.75em] font-bold text-text-muted uppercase tracking-[0.06em] mb-2.5">Letter Bank — drag to assign</div>
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
                {used && <span style={{position:'absolute',top:-5,right:-5,background:'var(--color-success)',borderRadius:'50%',width:15,height:15,display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,color:'#fff',border:'2px solid #fff'}}>✓</span>}
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
                  <span className="font-semibold text-[0.95em] text-text">{q.name}</span>
                  <FlagBtn on={flagged.has(q.id)} onClick={()=>toggleFlag(q.id)} />
                </div>
                <p className="text-[0.87em] leading-relaxed text-text-muted mb-3 ml-9">{q.desc}</p>
                <div className={`dzone${over===q.id?' over':''}${assigned?' has':''}`}
                  onDragOver={e=>{e.preventDefault();setOver(q.id)}}
                  onDragLeave={()=>setOver(null)}
                  onDrop={()=>dropToSlot(q.id)}
                  draggable={!!assigned}
                  onDragStart={()=>assigned&&(setDragLetter(assigned),setDragSrc(q.id))}>
                  {assigned ? <span>{assigned} — {book?.title}</span> : <span>Drop a letter here</span>}
                </div>
                {assigned && <button className="mt-1 text-[0.75em] text-slate-400 hover:text-text bg-none border-none cursor-pointer" onClick={()=>setAnswer(q.id,null)}>Clear ×</button>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
