import React, { useState } from "react";
import { computeResults, cambScale } from "../../utils/readingHelpers";

const PICONS = ['📝','🔗','📖','✂️','🔤','✏️'];
const PNAMES = ['Short Texts','Matching','Long Text','Gapped Text','Word Choice','Open Fill'];

export default function ResultsScreen({ answers, onRetry }) {
  const { rows, correct, incorrect, skipped } = computeResults(answers);
  const { score, grade, level, color } = cambScale(correct);
  const [openPart, setOpenPart] = useState(null);
  const pct = Math.round((correct / 32) * 100);

  const partRows = p => rows.filter(r => r.part === p);

  return (
    <div style={{minHeight:'100vh',background:'#F5F4FB',fontFamily:'Outfit,system-ui,sans-serif',padding:'0 0 60px 0'}}>
      {/* Header */}
      <div style={{background:'#3D3190',color:'#fff',padding:'20px 32px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <span style={{fontWeight:800,fontSize:'1.1em'}}>📚 PETPrep</span>
        <span style={{fontSize:'.85em',opacity:.7}}>Results — Reading Paper</span>
      </div>

      <div style={{maxWidth:780,margin:'0 auto',padding:'32px 20px'}}>
        {/* Score Banner */}
        <div style={{background:'#fff',borderRadius:18,padding:'28px 32px',marginBottom:24,border:'2px solid #E8E6F5',boxShadow:'0 4px 20px rgba(108,92,231,.1)',textAlign:'center'}}>
          <div style={{fontSize:'.82em',color:'#636E72',marginBottom:8,fontWeight:500,textTransform:'uppercase',letterSpacing:'.08em'}}>Cambridge Scale Score</div>
          <div style={{fontSize:'4em',fontWeight:800,color,lineHeight:1,marginBottom:6}}>{score}</div>
          <div style={{fontSize:'1.1em',fontWeight:700,color:'#2D3436',marginBottom:4}}>{grade} — {level}</div>
          <div style={{fontSize:'.85em',color:'#636E72',marginBottom:16}}>{pct}% correct ({correct}/32 questions)</div>
          <div style={{height:12,background:'#F1F0FB',borderRadius:99,overflow:'hidden',marginBottom:8}}>
            <div style={{height:'100%',borderRadius:99,background:color,width:`${pct}%`,transition:'width 1s ease'}}></div>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:'.72em',color:'#9CA3AF'}}>
            <span>100</span><span>120</span><span>140</span><span>160</span><span>170</span>
          </div>
        </div>

        {/* Stat Cards */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:24}}>
          {[
            {label:'Correct', val:correct, bg:'#F0FDF4', tx:'#166534', brd:'#BBF7D0'},
            {label:'Incorrect', val:incorrect, bg:'#FEF2F2', tx:'#991B1B', brd:'#FECACA'},
            {label:'Skipped', val:skipped, bg:'#F9FAFB', tx:'#374151', brd:'#E5E7EB'}
          ].map(s => (
            <div key={s.label} style={{background:s.bg,border:`1.5px solid ${s.brd}`,borderRadius:14,padding:'18px 20px',textAlign:'center'}}>
              <div style={{fontSize:'2.2em',fontWeight:800,color:s.tx,lineHeight:1}}>{s.val}</div>
              <div style={{fontSize:'.82em',color:s.tx,fontWeight:600,marginTop:4}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Part-by-part chart */}
        <div style={{background:'#fff',borderRadius:16,padding:'20px 24px',marginBottom:24,border:'1.5px solid #E8E6F5'}}>
          <div style={{fontWeight:700,fontSize:'.95em',color:'#2D3436',marginBottom:16}}>Accuracy by Part</div>
          {[1,2,3,4,5,6].map(p => {
            const pr = partRows(p);
            const pcor = pr.filter(r => r.s === 'ok').length;
            const pct2 = Math.round((pcor / pr.length) * 100);
            return (
              <div key={p} style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
                <div style={{fontSize:'.8em',fontWeight:600,color:'#636E72',width:52}}>Part {p}</div>
                <div style={{flex:1,height:10,background:'#F1F0FB',borderRadius:99,overflow:'hidden'}}>
                  <div style={{height:'100%',borderRadius:99,background:pct2>=70?'#00B894':pct2>=50?'#6C5CE7':'#E17055',width:`${pct2}%`,transition:'width 1.2s ease'}}></div>
                </div>
                <div style={{fontSize:'.82em',fontWeight:700,color:'#2D3436',width:40,textAlign:'right'}}>{pcor}/{pr.length}</div>
              </div>
            );
          })}
        </div>

        {/* Review Accordion */}
        <div style={{background:'#fff',borderRadius:16,border:'1.5px solid #E8E6F5',overflow:'hidden',marginBottom:28}}>
          <div style={{padding:'16px 20px',borderBottom:'1px solid #E8E6F5',fontWeight:700,fontSize:'.95em',color:'#2D3436'}}>Review All Answers</div>
          {[1,2,3,4,5,6].map(p => {
            const pr = partRows(p);
            const pcor = pr.filter(r => r.s === 'ok').length;
            const isOpen = openPart === p;
            return (
              <div key={p} style={{borderBottom:'1px solid #F3F2FB'}}>
                <button onClick={() => setOpenPart(isOpen ? null : p)}
                  style={{width:'100%',padding:'13px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',background:'none',border:'none',cursor:'pointer',fontFamily:'Outfit,system-ui',color:'#2D3436',transition:'background 150ms'}}>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <span style={{fontSize:'1.1em'}}>{PICONS[p-1]}</span>
                    <span style={{fontWeight:600,fontSize:'.9em'}}>Part {p} — {PNAMES[p-1]}</span>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{fontSize:'.8em',fontWeight:700,color:pcor===pr.length?'#00B894':pcor>=pr.length*.6?'#6C5CE7':'#E17055'}}>{pcor}/{pr.length}</span>
                    <span style={{fontSize:'.75em',color:'#9CA3AF'}}>{isOpen?'▲':'▼'}</span>
                  </div>
                </button>
                {isOpen && (
                  <div style={{padding:'4px 20px 16px'}}>
                    {pr.map(r => (
                      <div key={r.qNum} style={{padding:'10px 14px',borderRadius:10,marginBottom:8,background:r.s==='ok'?'#F0FDF4':r.s==='bad'?'#FEF2F2':'#F9FAFB',border:`1px solid ${r.s==='ok'?'#BBF7D0':r.s==='bad'?'#FECACA':'#E5E7EB'}`}}>
                        <div style={{display:'flex',alignItems:'flex-start',gap:8,marginBottom:4}}>
                          <span style={{fontSize:'.75em',fontWeight:700,color:r.s==='ok'?'#166534':r.s==='bad'?'#991B1B':'#6B7280',flexShrink:0}}>{r.s==='ok'?'✓':'✗'} Q{r.qNum}</span>
                          <span style={{fontSize:'.85em',color:'#2D3436',fontWeight:500}}>{r.text}</span>
                        </div>
                        <div style={{fontSize:'.8em',marginLeft:28,marginBottom:4}}>
                          <span style={{color:'#636E72'}}>Your answer: </span>
                          <span style={{fontWeight:700,color:r.s==='ok'?'#166534':r.s==='bad'?'#991B1B':'#9CA3AF'}}>{r.given}</span>
                          {r.s!=='ok' && <><span style={{color:'#636E72',marginLeft:8}}>· Correct: </span><span style={{fontWeight:700,color:'#166534'}}>{r.right}</span></>}
                        </div>
                        <div style={{fontSize:'.78em',color:'#4A5568',marginLeft:28,lineHeight:1.5,fontStyle:'italic'}}>{r.exp}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Buttons */}
        <div style={{display:'flex',gap:12,justifyContent:'center'}}>
          <button onClick={onRetry}
            style={{padding:'12px 28px',borderRadius:10,border:'2px solid #6C5CE7',background:'#fff',color:'#6C5CE7',cursor:'pointer',fontFamily:'Outfit,system-ui',fontWeight:700,fontSize:'.9em',transition:'all 150ms'}}>
            🔄 Retry This Test
          </button>
          <button style={{padding:'12px 28px',borderRadius:10,border:'none',background:'#6C5CE7',color:'#fff',cursor:'pointer',fontFamily:'Outfit,system-ui',fontWeight:700,fontSize:'.9em',boxShadow:'0 4px 14px rgba(108,92,231,.35)'}}>
            Go to Writing Paper →
          </button>
        </div>
      </div>
    </div>
  );
}
