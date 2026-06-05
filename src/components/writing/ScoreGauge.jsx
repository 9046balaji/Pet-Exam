

export default function ScoreGauge({ score, maxScore, label, color }) {
  const pct = score / maxScore;
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  const colors = { content: "#6C5CE7", communicative: "#00B894", organisation: "#FDCB6E", language: "#E17055" };
  const c = colors[color] || "#6C5CE7";
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: 88, height: 88 }}>
        <svg width="88" height="88" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r={r} fill="none" stroke="var(--color-border)" strokeWidth="7" />
          <circle
            cx="44" cy="44" r={r} fill="none" stroke={c} strokeWidth="7"
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            transform="rotate(-90 44 44)"
            style={{ transition: "stroke-dasharray 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-bold text-base" style={{ color: c }}>{score}/{maxScore}</span>
        </div>
      </div>
      <span className="text-xs text-center font-medium capitalize text-text-muted" style={{ maxWidth: 80 }}>{label}</span>
    </div>
  );
}
