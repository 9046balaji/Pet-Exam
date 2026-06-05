
import { EXAM_DATA } from "../../data/readingData";
import SectionHead from "../shared/SectionHead";
import FlagBtn from "../shared/FlagBtn";
import QNumBadge from "../shared/QNumBadge";

export function Part6Left({ answers, setAnswer, fontScale }) {
  const gapMap = {};
  EXAM_DATA.part6.gaps.forEach(g => gapMap[g.n] = g);
  return (
    <div>
      <SectionHead icon="✏️" label="Reading Text" title="Part 6 — Open Cloze" />
      <p className="text-text-muted" style={{fontSize:'.88em',marginBottom:16}}>{EXAM_DATA.part6.instructions}</p>
      <div className="bg-card border border-border rounded-xl" style={{padding:'22px 26px'}}>
        <p className="rt" style={{fontSize:`${fontScale}em`,lineHeight:2.1}}>
          {EXAM_DATA.part6.segments.map((seg, i) => {
            if(seg.t==='text') return <span key={i}>{seg.v}</span>;
            const g = gapMap[seg.n], val = answers[g.id]||'', err = val.includes(' ');
            return (
              <span key={i} style={{position:'relative',display:'inline-block',verticalAlign:'middle'}}>
                <input className={`iinp${err?' err':''}`} value={val}
                  onChange={e=>setAnswer(g.id,e.target.value)}
                  maxLength={20} placeholder={`(${seg.n})`}
                  autoCapitalize="none" autoCorrect="off" spellCheck={false}
                  title={err?'Write only ONE word':''} />
                {err&&<span style={{position:'absolute',top:-22,left:'50%',transform:'translateX(-50%)',background:'var(--color-danger)',color:'#fff',fontSize:'.7em',padding:'2px 8px',borderRadius:4,whiteSpace:'nowrap',zIndex:20,pointerEvents:'none'}}>One word only!</span>}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
}

export function Part6Right({ answers, setAnswer, flagged, toggleFlag }) {
  return (
    <div>
      <SectionHead icon="📝" label="Answer Cards" title="Questions 27–32" />
      <p className="text-text-muted" style={{fontSize:'.88em',marginBottom:16}}>Type one word per gap. Your answer syncs with the text on the left.</p>
      {EXAM_DATA.part6.gaps.map((g, i) => {
        const val = answers[g.id]||'', err = val.includes(' ');
        return (
          <div key={g.id} id={g.id} className="qcard fu" style={{animationDelay:`${i*55}ms`}}>
            <div style={{display:'flex',alignItems:'flex-start',gap:10,marginBottom:10}}>
              <QNumBadge n={i+27} />
              <div style={{flex:1}}>
                <div className="text-text font-semibold" style={{fontSize:'.9em'}}>Gap {g.n}</div>
                <div className="text-text-muted" style={{fontSize:'.78em',marginTop:2}}>💡 {g.hint}</div>
              </div>
              <FlagBtn on={flagged.has(g.id)} onClick={()=>toggleFlag(g.id)} />
            </div>
            <input type="text" value={val} placeholder="Type one word…"
              onChange={e=>setAnswer(g.id,e.target.value)}
              autoCapitalize="none" autoCorrect="off" spellCheck={false}
              className="w-full rounded-lg outline-none transition-colors bg-primary-light dark:bg-primary-dark/30 text-primary"
              style={{padding:'8px 12px',border:`2px solid ${err?'var(--color-danger)':'var(--color-primary)'}`,fontSize:'.9em',fontFamily:'var(--font-family-ui)'}} />
            {err&&<div className="text-danger font-semibold" style={{fontSize:'.78em',marginTop:4}}>⚠ Write only ONE word per gap.</div>}
            {val&&!err&&<button className="text-text-light hover:text-text-muted" style={{marginTop:4,fontSize:'.75em',background:'none',border:'none',cursor:'pointer'}} onClick={()=>setAnswer(g.id,'')}>Clear ×</button>}
          </div>
        );
      })}
    </div>
  );
}
