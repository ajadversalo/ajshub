import { techIcons } from "./data/experience";

export default function TechIcon({ tool, size = 15 }: { tool: string; size?: number }) {
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
