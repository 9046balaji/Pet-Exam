import React from "react";

export default function SectionHead({ icon, label, title }) {
  return (
    <div className="mb-3.5">
      <div className="text-[0.72em] font-bold text-primary uppercase tracking-[0.1em] mb-0.5">
        {icon} {label}
      </div>
      <h2 className="text-[1.15em] font-bold text-text font-ui">
        {title}
      </h2>
    </div>
  );
}
