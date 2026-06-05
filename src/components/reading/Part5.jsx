
import { EXAM_DATA } from "../../data/readingData";
import SectionHead from "../shared/SectionHead";
import FlagBtn from "../shared/FlagBtn";
import QNumBadge from "../shared/QNumBadge";

export function Part5Left({ answers, setAnswer, fontScale }) {
  const gapMap = {};
  EXAM_DATA.part5.gaps.forEach(g => gapMap[g.n] = g);
  return (
    <div>
      <SectionHead icon="🔤" label="Reading Text" title="Part 5 — Multiple-Choice Cloze" />
      <p className="text-text-muted" style={{fontSize:'.88em',marginBottom:16}}>{EXAM_DATA.part5.instructions}</p>
      <div className="bg-card border border-border rounded-xl" style={{padding:'22px 26px'}}>
        <p className="rt" style={{fontSize:`${fontScale}em`,lineHeight:2}}>
          {EXAM_DATA.part5.segments.map((seg, i) => {
            if(seg.t==='text') return <span key={i}>{seg.v}</span>;
            const g = gapMap[seg.n], ans = answers[g.id];
            return (
              <select key={i} className="isel" value={ans||''} onChange={e=>setAnswer(g.id,e.target.value||null)}
                style={{color:ans?'var(--color-success)':'var(--color-primary)'}}>
                <option value="">({seg.n}) ___</option>
                {g.opts.map(o=><option key={o.l} value={o.l}>{o.l}: {o.w}</option>)}
              </select>
            );
          })}
        </p>
      </div>
    </div>
  );
}

export function Part5Right({ answers, setAnswer, flagged, toggleFlag }) {
  return (
    <div>
      <SectionHead icon="🗂" label="Vocabulary Focus" title="Questions 21–26" />
      <p className="text-text-muted" style={{fontSize:'.88em',marginBottom:16}}>Select the correct word. Your choice updates the inline text on the left automatically.</p>
      {EXAM_DATA.part5.gaps.map((g, i) => {
        const ans = answers[g.id];
        return (
          <div key={g.id} id={g.id} className="qcard fu" style={{animationDelay:`${i*55}ms`}}>
            <div style={{display:'flex',alignItems:'flex-start',gap:10,marginBottom:10}}>
              <QNumBadge n={i+21} />
              <div style={{flex:1}}>
                <div className="text-text font-semibold" style={{fontSize:'.9em'}}>Gap {g.n}</div>
                <div className="text-text-muted" style={{fontSize:'.78em',marginTop:2}}>💡 {g.hint}</div>
              </div>
              <FlagBtn on={flagged.has(g.id)} onClick={()=>toggleFlag(g.id)} />
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              {g.opts.map(o=>(
                <button key={o.l} className={`chip${ans===o.l?' sel':''}`} onClick={()=>setAnswer(g.id,ans===o.l?null:o.l)}>
                  <span style={{fontWeight:700,width:18}}>{o.l}</span><span>{o.w}</span>
                </button>
              ))}
            </div>
            {ans&&<button className="text-text-light hover:text-text-muted" style={{marginTop:6,fontSize:'.75em',background:'none',border:'none',cursor:'pointer'}} onClick={()=>setAnswer(g.id,null)}>Clear answer</button>}
          </div>
        );
      })}
    </div>
  );
}
