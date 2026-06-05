import { useState } from "react";
import { EXAM_DATA } from "../../data/readingData";
import SectionHead from "../shared/SectionHead";
import QNumBadge from "../shared/QNumBadge";

export function Part4Left({ answers, setAnswer, fontScale }) {
  const [dLabel, setDLabel] = useState(null);
  const [dSrc, setDSrc] = useState(null);
  const [over, setOver] = useState(null);

  const usedMap = {};
  [1,2,3,4,5].forEach(n => { const l = answers[`q4_${n}`]; if(l) usedMap[l] = n; });

  const dropOnGap = (n) => {
    if(!dLabel) return;
    if(dSrc !== 'bank') setAnswer(`q4_${dSrc}`, null);
    setAnswer(`q4_${n}`, dLabel);
    setDLabel(null); setDSrc(null); setOver(null);
  };
  const dropToBank = () => {
    if(!dLabel || dSrc === 'bank') return;
    setAnswer(`q4_${dSrc}`, null);
    setDLabel(null); setDSrc(null); setOver(null);
  };

  const sentMap = {};
  EXAM_DATA.part4.sentences.forEach(s => sentMap[s.id] = s);

  return (
    <div>
      <SectionHead icon="✂️" label="Article with Gaps" title="Part 4 — Gapped Text" />
      <p className="text-text-muted" style={{fontSize:'.88em',marginBottom:16}}>{EXAM_DATA.part4.instructions}</p>

      <div className="bg-card border border-border rounded-xl" style={{padding:'20px 24px'}}>
        <div className="text-text font-bold" style={{fontFamily:'Outfit,system-ui',fontSize:'1em',marginBottom:16}}>{EXAM_DATA.part4.article.title}</div>
        <div className="rt" style={{fontSize:`${fontScale}em`,lineHeight:1.9}}>
          {EXAM_DATA.part4.article.segments.map((seg,i)=>{
            if(seg.t==='text') return <span key={i}>{seg.v}</span>;
            const n = seg.n, assigned = answers[`q4_${n}`], sent = assigned ? sentMap[assigned] : null;
            return (
              <span key={i} className={`gbox${assigned?' filled':''}${over===n?' over':''}`}
                onDragOver={e=>{e.preventDefault();setOver(n)}}
                onDragLeave={()=>setOver(null)}
                onDrop={()=>dropOnGap(n)}
                draggable={!!assigned}
                onDragStart={()=>assigned&&(setDLabel(assigned),setDSrc(n))}>
                {assigned?(
                  <>
                    <span style={{fontWeight:800,flexShrink:0}}>{assigned}</span>
                    <span style={{fontSize:'.8em',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:110}}>{sent?.text.slice(0,38)}…</span>
                    <button style={{background:'none',border:'none',color:'rgba(255,255,255,.8)',cursor:'pointer',fontWeight:700,fontSize:'1em',padding:'0 2px',flexShrink:0}}
                      onClick={e=>{e.stopPropagation();setAnswer(`q4_${n}`,null)}}>×</button>
                  </>
                ):(
                  <span style={{fontStyle:'italic',opacity:.7}}>[{n}] drop here</span>
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* Sentence Bank */}
      <div className="border-2 border-dashed border-primary rounded-xl bg-primary-light/30 dark:bg-primary-dark/20" style={{marginTop:20,padding:'14px 16px'}}
        onDragOver={e=>e.preventDefault()} onDrop={dropToBank}>
        <div className="text-primary font-bold uppercase" style={{fontSize:'.75em',letterSpacing:'.07em',marginBottom:10}}>Sentence Bank — drag into gaps above</div>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {EXAM_DATA.part4.sentences.map(s=>{
            const isUsed = !!usedMap[s.id];
            return (
              <div key={s.id} className={`stile${isUsed?' used':''}`}
                draggable={!isUsed}
                onDragStart={()=>!isUsed&&(setDLabel(s.id),setDSrc('bank'))}>
                <span style={{width:24,height:24,borderRadius:7,background:isUsed?'#A0AEC0':'var(--color-primary)',color:'#fff',fontWeight:700,fontSize:'.8em',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{s.id}</span>
                <span style={{flex:1}}>{s.text}</span>
                {isUsed&&<span className="text-success font-semibold whitespace-nowrap" style={{fontSize:'.75em'}}>✓ Gap {usedMap[s.id]}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function Part4Right({ answers }) {
  return (
    <div>
      <SectionHead icon="📊" label="Gap Tracker" title="Questions 16–20" />
      <p className="text-text-muted" style={{fontSize:'.88em',marginBottom:16}}>Drag sentences from the bank into the numbered gaps in the article.</p>
      {[1,2,3,4,5].map(n=>{
        const assigned = answers[`q4_${n}`];
        const sent = assigned ? EXAM_DATA.part4.sentences.find(s=>s.id===assigned) : null;
        return (
          <div key={n} id={`q4_${n}`} className="qcard mb-3">
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:assigned?8:0}}>
              <QNumBadge n={n+15} />
              <span className="text-text font-semibold" style={{fontSize:'.9em'}}>Gap {n}</span>
              <span className="ml-auto font-semibold rounded-full" style={{fontSize:'.76em',padding:'2px 10px',background:assigned?'rgba(0,184,148,0.15)':'var(--color-surface)',color:assigned?'var(--color-success)':'var(--color-text-light)'}}>
                {assigned?`Letter ${assigned}`:'Not answered'}
              </span>
            </div>
            {sent&&<p className="text-text-muted border-l-3 border-primary" style={{fontSize:'.82em',lineHeight:1.45,paddingLeft:8,marginLeft:36,borderLeftWidth:3,borderLeftStyle:'solid',borderLeftColor:'var(--color-primary)'}}>{sent.text}</p>}
          </div>
        );
      })}
      <div className="bg-primary-light dark:bg-primary-dark/30 border border-primary rounded-xl" style={{padding:'14px 16px',marginTop:4}}>
        <div className="text-primary font-bold" style={{fontSize:'.8em',marginBottom:5}}>💡 Strategy Tip</div>
        <p className="text-primary" style={{fontSize:'.8em',lineHeight:1.55,opacity:.85}}>Look for pronouns (it, they, this), connecting phrases (however, what is more), and words that refer back to ideas already mentioned. These clues link gaps to the surrounding sentences.</p>
      </div>
    </div>
  );
}
