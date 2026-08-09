const projects = [
  {
    number: "01",
    type: "Product engineering",
    title: "GenXys Health Care Systems",
    summary:
      "Building reliable clinical software that helps turn complex pharmacogenomic data into useful decisions for health-care teams.",
    tags: ["React", ".NET", "TypeScript", "Azure"],
    href: "https://www.genxys.com",
    label: "Visit GenXys",
    accent: "lime",
  },
  {
    number: "02",
    type: "Digital platform",
    title: "Centra Windows",
    summary:
      "Contributing to customer-facing experiences and internal tools for one of Western Canada’s leading window manufacturers.",
    tags: ["C#", "SQL", "React", "Cloud"],
    href: "https://www.centrawindows.com",
    label: "Visit Centra",
    accent: "blue",
  },
  {
    number: "03",
    type: "Founder project",
    title: "AI Jabber",
    summary:
      "A personal AI assistant designed as a focused, approachable space to think, ask, and create with modern language models.",
    tags: ["Next.js", "OpenAI", "Supabase", "Vercel"],
    href: "https://aijabber.ca",
    label: "Launch AI Jabber",
    accent: "violet",
  },
];

const stack = [
  "TypeScript",
  "React",
  "Next.js",
  "C# / .NET",
  "Node.js",
  "PostgreSQL",
  "Azure",
  "AWS",
  "OpenAI",
  "Playwright",
];

const concepts = [
  "UI Systems",
  "AI Tools",
  "Product Thinking",
  "API Design",
  "Accessibility",
  "Cloud Architecture",
  "Performance",
  "Automation",
  "Developer Experience",
  "Prototyping",
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  return (
    <main>
      <header className="nav shell">
        <a className="monogram" href="#top" aria-label="AJ Adversalo, home">
          AJ<span>®</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <a
          className="availability"
          href="https://www.linkedin.com/in/ajadversalo"
          target="_blank"
          rel="noreferrer"
        >
          <span /> Let’s connect
        </a>
      </header>

      <section className="hero shell" id="top">
        <div className="rain" aria-hidden="true">
          <i /><i /><i /><i /><i />
        </div>
        <p className="eyebrow">Full-stack developer · Vancouver, BC</p>
        <h1>
          I build digital
          <br />
          things that <em>work.</em>
        </h1>
        <div className="hero-bottom">
          <p>
            Hey, I’m AJ — a product-minded developer turning complex systems
            into simple, useful experiences.
          </p>
          <a className="round-link" href="#work" aria-label="Explore selected work">
            <span>Explore</span>
            <b aria-hidden="true">↓</b>
          </a>
        </div>
      </section>

      <section className="ticker" aria-label="Core technologies">
        <div className="ticker-label">
          <span>Toolbox</span>
          <i>Always learning</i>
        </div>
        <div className="ticker-window">
          <div className="ticker-track">
            {[...stack, ...stack].map((item, index) => (
              <span key={`${item}-${index}`}>
                <b>{String((index % stack.length) + 1).padStart(2, "0")}</b>
                {item}
              </span>
            ))}
          </div>
          <div className="ticker-track ticker-track-reverse" aria-hidden="true">
            {[...concepts, ...concepts].map((item, index) => (
              <span key={`reverse-${item}-${index}`}>{item}<i>↗</i></span>
            ))}
          </div>
        </div>
      </section>

      <section className="work shell" id="work">
        <div className="section-heading">
          <p className="eyebrow">Selected work · 2022—Now</p>
          <h2>Built with intent.</h2>
          <p className="section-note">
            A mix of health-tech, commerce, and independent products — each
            shaped around a real problem.
          </p>
        </div>

        <div className="project-list">
          {projects.map((project) => (
            <a
              className={`project ${project.accent}`}
              href={project.href}
              target="_blank"
              rel="noreferrer"
              key={project.title}
            >
              <div className="project-top">
                <span>{project.number}</span>
                <span>{project.type}</span>
                <Arrow />
              </div>
              <div className="project-visual" aria-hidden="true">
                <div className="window-bar"><i /><i /><i /></div>
                <strong>{project.title.split(" ")[0]}</strong>
                <span className="visual-orbit" />
              </div>
              <div className="project-copy">
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <ul aria-label="Technologies used">
                  {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
                <span className="project-cta">{project.label} <Arrow /></span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="about shell" id="about">
        <div>
          <p className="eyebrow">A little about me</p>
          <p className="about-lede">
            I’m at my best where <span>engineering</span>, product thinking,
            and human curiosity meet.
          </p>
        </div>
        <div className="about-copy">
          <p>
            I’m AJ Adversalo, a full-stack developer who enjoys making the hard
            stuff feel effortless. I care about thoughtful interfaces, resilient
            systems, and the small details that earn a user’s trust.
          </p>
          <p>
            Away from the editor, I’m usually exploring new AI tools, refining a
            side project, or looking for a better way to explain a complicated idea.
          </p>
          <div className="principles">
            <div><span>01</span><strong>Make it useful.</strong></div>
            <div><span>02</span><strong>Keep it clear.</strong></div>
            <div><span>03</span><strong>Sweat the details.</strong></div>
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="shell contact-inner">
          <p className="eyebrow">Have a project in mind?</p>
          <h2>Let’s make<br /><em>something good.</em></h2>
          <div className="contact-links">
            <a href="https://www.linkedin.com/in/ajadversalo" target="_blank" rel="noreferrer">
              Start a conversation <Arrow />
            </a>
            <div>
              <a href="https://github.com/ajadversalo" target="_blank" rel="noreferrer">GitHub <Arrow /></a>
              <a href="https://www.linkedin.com/in/ajadversalo" target="_blank" rel="noreferrer">LinkedIn <Arrow /></a>
            </div>
          </div>
          <footer>
            <span>© {new Date().getFullYear()} AJ Adversalo</span>
            <a href="#top">Back to top ↑</a>
          </footer>
        </div>
      </section>
    </main>
  );
}
