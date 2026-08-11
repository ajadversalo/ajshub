"use client";

import { useMemo, useState } from "react";
import { toolboxGroups } from "./data/portfolio";

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
    <section className="toolbox shell" id="toolbox">
      <header className="toolbox-heading">
        <p className="eyebrow">Technical range · One connected practice</p>
        <h2>Tools for the<br /><em>whole product.</em></h2>
        <p>From interface decisions to production systems, these are the technologies I use to move ideas forward.</p>
      </header>

      <div className="toolbox-filter">
        <label htmlFor="technology-filter">Find a technology</label>
        <div className="toolbox-filter-field">
          <input
            id="technology-filter"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try React, Python, Azure…"
            autoComplete="off"
          />
          {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear technology filter">Clear</button>}
        </div>
      </div>

      <div className={`toolbox-grid${normalizedQuery ? " is-filtered" : ""}`}>
        {filteredGroups.map((group) => {
          const originalIndex = toolboxGroups.findIndex((item) => item.category === group.category);
          return (
          <article className="toolbox-group" data-index={`0${originalIndex + 1}`} key={group.category}>
            <span className="toolbox-number">0{originalIndex + 1}</span>
            <div className="toolbox-group-heading">
              <h3>{group.category}</h3>
              <p>{group.description}</p>
            </div>
            <ul aria-label={`${group.category} technologies`}>
              {group.tools.map((tool) => <li key={tool}>{tool}</li>)}
            </ul>
          </article>
          );
        })}
        {filteredGroups.length === 0 && (
          <p className="toolbox-empty" role="status">No matching technologies. Try a broader search.</p>
        )}
      </div>
    </section>
  );
}
