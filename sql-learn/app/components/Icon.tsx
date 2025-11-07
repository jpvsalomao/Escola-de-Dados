import { getIconPath, type IconName } from "@/app/lib/ui-constants";

interface IconProps {
  name: IconName | string;
  className?: string;
}

/**
 * Reusable icon component that renders SVG icons from the centralized registry
 */
export function Icon({ name, className = "w-6 h-6" }: IconProps) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {getIconPath(name)}
    </svg>
  );
}
