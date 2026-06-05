import React, { useState } from "react";
import { WRITING_TASKS } from "../../data/writingData";
import ScoreGauge from "./ScoreGauge";
import AnnotatedEssay from "./AnnotatedEssay";

const PICONS = ["📝", "📰"];
const PNAMES = ["Email", "Article / Story"];

export default function ResultsPanel({ feedback, draft, part, taskType, onClose, onRevise }) {
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [showModel, setShowModel] = useState(false);
  const [expandedCriterion, setExpandedCriterion] = useState(null);

  if (!feedback) return null;

  const {
    scores, total, cambridge_scale, band_label, overall_comment,
    criterion_feedback, annotations, strengths, improvements, missing_notes,
  } = feedback;

  const modelAnswer =
    part === 1
      ? WRITING_TASKS.part1.modelAnswer
      : taskType === "article"
      ? WRITING_TASKS.part2.article.modelAnswer
      : WRITING_TASKS.part2.story.modelAnswer;

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "rgba(15,15,20,0.7)" }}>
      <div className="mt-auto bg-white rounded-t-3xl shadow-2xl overflow-y-auto" style={{ maxHeight: "90vh" }}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800">AI Feedback Results</h2>
            <p className="text-sm text-gray-500">Cambridge B1 PET Assessment</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onRevise}
              className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              ✏ Revise & Resubmit
            </button>
            <button onClick={onClose} className="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm hover:bg-gray-200">✕</button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Missing notes alert */}
          {missing_notes && missing_notes.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-700 font-semibold text-sm">
                ⚠ You did not address note(s): #{missing_notes.join(", #")} — this will affect your Content score
              </p>
            </div>
          )}

          {/* Score dashboard */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-4xl font-black text-purple-800">
                  {total} <span className="text-xl font-normal text-purple-400">/ 20</span>
                </p>
                <p className="text-sm text-purple-600 mt-1">{band_label}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                  Cambridge Scale: ~{cambridge_scale}
                </span>
              </div>
              <div className="flex gap-4">
                {Object.entries(scores).map(([k, v]) => (
                  <ScoreGauge key={k} score={v} maxScore={5} label={k} color={k} />
                ))}
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed bg-white rounded-xl p-4 border border-purple-100">
              {overall_comment}
            </p>
          </div>

          {/* Per-criterion cards */}
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(criterion_feedback).map(([k, v]) => (
              <div key={k} className="border border-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedCriterion(expandedCriterion === k ? null : k)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-sm font-bold text-purple-700">{scores[k]}</span>
                    </div>
                    <span className="font-semibold text-gray-700 capitalize text-sm">{k}</span>
                  </div>
                  <span className="text-gray-400 text-xs">{expandedCriterion === k ? "▲" : "▼"}</span>
                </button>
                {expandedCriterion === k && (
                  <div className="p-4">
                    <div className="h-1.5 bg-gray-100 rounded-full mb-3">
                      <div
                        className="h-1.5 rounded-full bg-purple-500"
                        style={{ width: `${(scores[k] / 5) * 100}%`, transition: "width 0.5s ease" }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{v}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Annotated essay */}
          <div className="border border-gray-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-700">Annotated Essay</h3>
              <button
                onClick={() => setShowAnnotations(!showAnnotations)}
                className="text-xs px-3 py-1 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50"
              >
                {showAnnotations ? "Hide" : "Show"} Annotations
              </button>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 text-sm leading-relaxed border border-amber-100">
              {showAnnotations
                ? <AnnotatedEssay text={draft} annotations={annotations} />
                : <p className="whitespace-pre-wrap text-sm leading-relaxed">{draft}</p>
              }
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {[["grammar", "#EF4444"], ["vocab", "#3B82F6"], ["register", "#F97316"], ["linking", "#8B5CF6"], ["missing note", "#EC4899"]].map(([t, c]) => (
                <span key={t} className="text-xs flex items-center gap-1">
                  <span style={{ display: "inline-block", width: 10, height: 2, background: c }} /> {t}
                </span>
              ))}
            </div>
          </div>

          {/* Strengths & improvements */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
              <h3 className="font-semibold text-green-800 mb-3 text-sm">✅ What you did well</h3>
              <ul className="space-y-2">
                {strengths.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm text-green-700">
                    <span className="text-green-500 mt-0.5">✓</span> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <h3 className="font-semibold text-amber-800 mb-3 text-sm">📈 How to improve</h3>
              <ul className="space-y-2">
                {improvements.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm text-amber-700">
                    <span className="text-amber-500 mt-0.5">→</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Model answer */}
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <button
              onClick={() => setShowModel(!showModel)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 text-left"
            >
              <span className="font-semibold text-gray-700 text-sm">📖 See a model answer</span>
              <span className="text-gray-400 text-xs">{showModel ? "▲" : "▼"}</span>
            </button>
            {showModel && (
              <div className="p-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Your answer</p>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm leading-relaxed whitespace-pre-wrap">{draft}</div>
                </div>
                <div>
                  <p className="text-xs font-bold text-green-500 mb-2 uppercase tracking-wider">Grade A model</p>
                  <div className="bg-green-50 rounded-lg p-3 text-sm leading-relaxed whitespace-pre-wrap border border-green-100">
                    {modelAnswer}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pb-4">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors"
            >
              📥 Download Feedback PDF
            </button>
            <button className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors">
              Next: Listening Paper →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
