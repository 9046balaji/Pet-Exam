import React, { useState } from "react";
import { PHRASE_BANKS } from "../../data/writingData";

export default function PhraseBank({ type, onInsert, savedPhrases, onToggleFavorite }) {
  const bank = PHRASE_BANKS[type] || PHRASE_BANKS.email;
  const [openCat, setOpenCat] = useState(Object.keys(bank)[0]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phrase Bank</span>
        </div>
        {savedPhrases.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-amber-600 mb-1">⭐ Favourites</p>
            <div className="flex flex-wrap gap-1">
              {savedPhrases.map((p, i) => (
                <button
                  key={i}
                  onClick={() => onInsert(p)}
                  className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors"
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
              className="text-xs font-semibold text-gray-600 w-full text-left flex items-center justify-between py-1"
            >
              {cat} <span>{openCat === cat ? "▲" : "▼"}</span>
            </button>
            {openCat === cat && (
              <div className="flex flex-wrap gap-1 mt-1">
                {phrases.map((p, i) => (
                  <div key={i} className="flex items-center gap-0.5">
                    <button
                      onClick={() => onInsert(p)}
                      className="text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 transition-colors"
                    >
                      {p}
                    </button>
                    <button
                      onClick={() => onToggleFavorite(p)}
                      title="Favourite"
                      className={`text-xs ${savedPhrases.includes(p) ? "text-amber-500" : "text-gray-300 hover:text-amber-400"}`}
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
