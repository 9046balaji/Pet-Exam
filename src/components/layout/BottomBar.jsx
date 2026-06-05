import { useState } from "react";
import { EXAM_DATA } from "../../data/readingData";
import ReviewModal from "./ReviewModal";

const ALL_QIDS = [
  ...EXAM_DATA.part1.questions.map(q=>({id:q.id,part:1})),
  ...EXAM_DATA.part2.questions.map(q=>({id:q.id,part:2})),
  ...EXAM_DATA.part3.questions.map(q=>({id:q.id,part:3})),
  ...[1,2,3,4,5].map(n=>({id:`q4_${n}`,part:4})),
  ...EXAM_DATA.part5.gaps.map(g=>({id:g.id,part:5})),
  ...EXAM_DATA.part6.gaps.map(g=>({id:g.id,part:6})),
];

export default function BottomBar({ currentPart, setCurrent, answers, flagged, onSubmit }) {
  const [showNav, setShowNav] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  /* ── Question status: differentiate flagged+answered vs flagged+unanswered ── */
  const getStatus = (id) => {
    const a = answers[id];
    const isFlagged = flagged.has(id);
    const isAnswered = a && a.toString().trim() !== '';
    if (isFlagged && isAnswered) return 'flagged-ans';  // amber outlined
    if (isFlagged) return 'flagged';                     // solid amber
    if (isAnswered) return 'ans';                        // solid primary
    return '';                                            // default
  };

  /* ── Submit via ReviewModal — close modal first, then submit ── */
  const handleReviewSubmit = () => {
    setShowReviewModal(false);
    // Small delay to let modal close animation complete
    setTimeout(() => onSubmit(), 150);
  };

  const btnFont = { fontFamily: 'var(--font-family-ui)' };

  return (
    <div style={{position:'sticky',bottom:0,background:'var(--color-card, #fff)',borderTop:'1px solid var(--color-border, #E8E6F5)',padding:'10px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,zIndex:200,boxShadow:'0 -2px 16px rgba(0,0,0,.08)'}}>
      <button onClick={()=>setCurrent(p=>Math.max(1,p-1))} disabled={currentPart===1}
        style={{padding:'8px 18px',borderRadius:9,border:'1.5px solid var(--color-border-light, #E2E0F0)',background:'var(--color-card, #fff)',cursor:currentPart===1?'not-allowed':'pointer',color:currentPart===1?'#CBD5E1':'var(--color-text, #2D3436)',...btnFont,fontWeight:600,fontSize:'.88em',transition:'all 150ms',opacity:currentPart===1?.5:1}}>
        ← Previous
      </button>

      {/* Question navigator toggle */}
      <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
        <button onClick={()=>setShowNav(v=>!v)}
          style={{fontSize:'.78em',color:'var(--color-primary, #6C5CE7)',background:'none',border:'none',cursor:'pointer',fontWeight:600,...btnFont}}>
          {showNav?'▼ Hide Navigator':'▲ Question Navigator'}
        </button>
        {showNav && (
          <div style={{display:'flex',flexWrap:'wrap',gap:4,maxWidth:480,justifyContent:'center'}}>
            {ALL_QIDS.map(({id,part},idx)=>{
              const status = getStatus(id);
              /* CSS classes: qnav, qnav ans, qnav flagged, qnav flagged-ans */
              return (
                <div key={id}
                  className={`qnav${status ? ` ${status}` : ''}`}
                  onClick={()=>setCurrent(part)}
                  title={`Q${idx+1} · Part ${part}${status==='ans'?' ✓':status.includes('flagged')?' 🚩':''}`}>
                  {idx+1}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <button onClick={()=>setCurrent(p=>Math.min(6,p+1))} disabled={currentPart===6}
          style={{padding:'8px 18px',borderRadius:9,border:'1.5px solid var(--color-primary, #6C5CE7)',background:currentPart===6?'transparent':'var(--color-primary, #6C5CE7)',color:currentPart===6?'#CBD5E1':'#fff',cursor:currentPart===6?'not-allowed':'pointer',...btnFont,fontWeight:600,fontSize:'.88em',transition:'all 150ms',opacity:currentPart===6?.5:1}}>
          Next →
        </button>
        <button onClick={() => setShowReviewModal(true)}
          style={{padding:'8px 16px',borderRadius:9,border:'none',background:'var(--color-danger, #E17055)',color:'#fff',cursor:'pointer',...btnFont,fontWeight:700,fontSize:'.86em',transition:'all 150ms',boxShadow:'0 2px 8px rgba(225,112,85,.4)'}}>
          Submit Paper
        </button>
      </div>

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        answers={answers}
        flagged={flagged}
        onSubmit={handleReviewSubmit}
        setCurrentPart={setCurrent}
      />
    </div>
  );
}
