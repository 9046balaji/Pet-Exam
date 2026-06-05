export default function WordTooltip({ tooltip }) {
  if (!tooltip) return null;

  return (
    <div
      className="fixed z-[999] bg-card border-2 border-primary rounded-[10px] px-3.5 py-2.5 max-w-[240px] shadow-[0_8px_24px_rgba(108,92,231,0.25)] pointer-events-none"
      style={{ left: tooltip.x + 12, top: tooltip.y - 8 }}
    >
      <div className="font-bold text-primary text-[0.88em] mb-1 capitalize">
        {tooltip.word}
      </div>
      <div className="text-[0.82em] text-text-muted leading-normal">
        {tooltip.def}
      </div>
    </div>
  );
}
