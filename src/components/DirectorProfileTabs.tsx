"use client";

import { useState } from "react";

type DirectorProfileSection = {
  lines: string[];
  title: string;
};

type DirectorProfileTabsProps = {
  sections: DirectorProfileSection[];
};

export function DirectorProfileTabs({ sections }: DirectorProfileTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSection = sections[activeIndex] || sections[0];

  if (!activeSection) {
    return null;
  }

  return (
    <div className="instructor-profile-tabs">
      <div className="instructor-profile-tablist" role="tablist" aria-label="프로필 항목">
        {sections.map((section, index) => {
          const isSelected = index === activeIndex;

          return (
            <button
              aria-controls={`director-profile-panel-${index}`}
              aria-selected={isSelected}
              className="instructor-profile-tab"
              id={`director-profile-tab-${index}`}
              key={section.title}
              onClick={() => setActiveIndex(index)}
              role="tab"
              type="button"
            >
              {section.title}
            </button>
          );
        })}
      </div>
      <section
        aria-labelledby={`director-profile-tab-${activeIndex}`}
        className="instructor-profile-panel instructor-profile-section-card"
        id={`director-profile-panel-${activeIndex}`}
        role="tabpanel"
      >
        <h3>{activeSection.title}</h3>
        <ul>
          {activeSection.lines.map((line, lineIndex) => (
            <li key={`${activeSection.title}-${lineIndex}`}>{line}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
