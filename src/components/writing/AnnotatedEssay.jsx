

export default function AnnotatedEssay({ text, annotations }) {
  if (!annotations || annotations.length === 0)
    return <p className="whitespace-pre-wrap text-sm leading-relaxed">{text}</p>;

  const typeColors = {
    grammar: "#EF4444",
    vocab: "#3B82F6",
    register: "#F97316",
    linking: "#8B5CF6",
    missing_note: "#EC4899",
  };

  let parts = [{ text, annotated: false }];
  annotations.forEach((ann) => {
    const phrase = ann.phrase;
    let newParts = [];
    parts.forEach((part) => {
      if (part.annotated || !part.text.includes(phrase)) {
        newParts.push(part);
        return;
      }
      const idx = part.text.indexOf(phrase);
      if (idx > 0) newParts.push({ text: part.text.slice(0, idx), annotated: false });
      newParts.push({ text: phrase, annotated: true, ann });
      if (idx + phrase.length < part.text.length)
        newParts.push({ text: part.text.slice(idx + phrase.length), annotated: false });
    });
    parts = newParts;
  });

  return (
    <p className="whitespace-pre-wrap text-sm leading-relaxed">
      {parts.map((part, i) =>
        part.annotated ? (
          <span
            key={i}
            className="relative group cursor-pointer"
            style={{ borderBottom: `2px solid ${typeColors[part.ann.type] || "#999"}` }}
          >
            {part.text}
            <span className="absolute bottom-full left-0 z-50 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 w-48 shadow-lg">
              <strong className="capitalize">{part.ann.type}</strong>: {part.ann.suggestion}
            </span>
          </span>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </p>
  );
}
