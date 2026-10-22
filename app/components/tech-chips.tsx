import PropTypes from "prop-types";
import TechIcon from "./tech-icon";

export type TechChipsProps = {
  /** Skill names to render, in display order. */
  tools: string[];
  /** Icon size passed to {@link TechIcon}. */
  size?: number;
  /** Optional accessible name for the list. */
  label?: string;
};

/**
 * Unstyled list of skill chips with icons. Parent CSS (toolbox, stack, facts)
 * owns layout.
 */
export default function TechChips({ tools, size = 15, label }: TechChipsProps) {
  return (
    <ul aria-label={label}>
      {tools.map((tool) => (
        <li key={tool}>
          <TechIcon tool={tool} size={size} />
          {tool}
        </li>
      ))}
    </ul>
  );
}

TechChips.propTypes = {
  tools: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  size: PropTypes.number,
  label: PropTypes.string,
};
