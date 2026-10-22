import PropTypes from "prop-types";
import { techIcons } from "../data/tech-icons";

export type TechIconProps = {
  /** Skill name as it appears in toolbox / stack lists. */
  tool: string;
  /** Rendered width and height in pixels. */
  size?: number;
};

/**
 * Vendor mark for a named skill. Renders nothing when `tool` has no icon.
 */
export default function TechIcon({ tool, size = 15 }: TechIconProps) {
  const icon = techIcons[tool];
  if (!icon) return null;

  return (
    <img
      src={icon.src}
      className={icon.invert ? "tech-icon-light" : undefined}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
    />
  );
}

TechIcon.propTypes = {
  tool: PropTypes.string.isRequired,
  size: PropTypes.number,
};
