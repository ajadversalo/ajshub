"use client";

import { useMemo, useState } from "react";
import { COPY, SECTIONS } from "../constants";
import { toolboxGroups } from "../data/portfolio";
import TechChips from "./tech-chips";

/** Homepage toolkit: filterable skill groups from `toolboxGroups`. */
export default function ToolboxSection() {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredGroups = useMemo(() => toolboxGroups
    .map((group) => ({
      ...group,
      tools: normalizedQuery
        ? group.tools.filter((tool) => tool.toLowerCase().includes(normalizedQuery))
        : group.tools,
    }))
    .filter((group) => group.tools.length > 0), [normalizedQuery]);

  return (
    <section className="toolbox shell" id={SECTIONS.toolbox}>
      <header className="toolbox-heading">
        <h2>{COPY.toolboxHeading}</h2>
        <p>{COPY.toolboxSub}</p>
      </header>

      <div className="toolbox-filter">
        <label htmlFor="technology-filter">{COPY.toolboxFilterLabel}</label>
        <div className="toolbox-filter-field">
          <input
            id="technology-filter"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={COPY.toolboxPlaceholder}
            autoComplete="off"
          />
          {query && <button type="button" onClick={() => setQuery("")} aria-label={COPY.toolboxClear}>Clear</button>}
        </div>
      </div>

      <div className={`toolbox-grid${normalizedQuery ? " is-filtered" : ""}`}>
        {filteredGroups.map((group) => (
          <article className="toolbox-group" key={group.category}>
            <div className="toolbox-group-heading">
              <h3>{group.category}</h3>
              <p>{group.description}</p>
            </div>
            <TechChips tools={group.tools} label={`${group.category} technologies`} />
          </article>
        ))}
        {filteredGroups.length === 0 && (
          <p className="toolbox-empty" role="status">{COPY.toolboxEmpty}</p>
        )}
      </div>
    </section>
  );
}
