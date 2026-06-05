import { useState } from "react";
import { PHRASE_BANKS } from "../../data/writingData";

export default function PhraseBank({ type, onInsert, savedPhrases, onToggleFavorite }) {
  const bank = PHRASE_BANKS[type] || PHRASE_BANKS.email;
  const [openCat, setOpenCat] = useState(Object.keys(bank)[0]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Phrase Bank</span>
        </div>
        {savedPhrases.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">⭐ Favourites</p>
            <div className="flex flex-wrap gap-1">
              {savedPhrases.map((p, i) => (
                <button
                  key={i}
                  onClick={() => onInsert(p)}
                  className="text-xs px-2 py-1 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-800/40 transition-colors"
                >
                  {p.length > 20 ? p.slice(0, 20) + "…" : p}
                </button>
              ))}
            </div>
          </div>
        )}
        {Object.entries(bank).map(([cat, phrases]) => (
          <div key={cat} className="mb-2">
            <button
              onClick={() => setOpenCat(openCat === cat ? null : cat)}
              className="text-xs font-semibold text-text-muted w-full text-left flex items-center justify-between py-1"
            >
              {cat} <span>{openCat === cat ? "▲" : "▼"}</span>
            </button>
            {openCat === cat && (
              <div className="flex flex-wrap gap-1 mt-1">
                {phrases.map((p, i) => (
                  <div key={i} className="flex items-center gap-0.5">
                    <button
                      onClick={() => onInsert(p)}
                      className="text-xs px-2 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-800/40 transition-colors"
                    >
                      {p}
                    </button>
                    <button
                      onClick={() => onToggleFavorite(p)}
                      title="Favourite"
                      className={`text-xs ${savedPhrases.includes(p) ? "text-amber-500" : "text-text-light hover:text-amber-400"}`}
                    >
                      ★
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
