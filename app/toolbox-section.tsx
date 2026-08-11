import { toolboxGroups } from "./data/portfolio";

export default function ToolboxSection() {
  return (
    <section className="toolbox shell" id="toolbox">
      <header className="toolbox-heading">
        <p className="eyebrow">Technical range · One connected practice</p>
        <h2>Tools for the<br /><em>whole product.</em></h2>
        <p>From interface decisions to production systems, these are the technologies I use to move ideas forward.</p>
      </header>

      <div className="toolbox-grid">
        {toolboxGroups.map((group, index) => (
          <article className="toolbox-group" data-index={`0${index + 1}`} key={group.category}>
            <span className="toolbox-number">0{index + 1}</span>
            <div className="toolbox-group-heading">
              <h3>{group.category}</h3>
              <p>{group.description}</p>
            </div>
            <ul aria-label={`${group.category} technologies`}>
              {group.tools.map((tool) => <li key={tool}>{tool}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
