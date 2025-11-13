import { LucideProps } from "lucide-react";

// Sumerian cuneiform wedge mark
export const SumerianIcon = (props: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
    {...props}
  >
    <path d="M4 6 L8 6 L7 9 L5 9 Z" fill="currentColor" />
    <path d="M10 6 L14 6 L13 9 L11 9 Z" fill="currentColor" />
    <path d="M16 6 L20 6 L19 9 L17 9 Z" fill="currentColor" />
    <path d="M4 12 L8 12 L7 15 L5 15 Z" fill="currentColor" />
    <path d="M10 12 L14 12 L13 15 L11 15 Z" fill="currentColor" />
    <path d="M16 12 L20 12 L19 15 L17 15 Z" fill="currentColor" />
  </svg>
);

// Egyptian ankh symbol
export const EgyptianIcon = (props: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
    {...props}
  >
    <circle cx="12" cy="6" r="3" />
    <line x1="12" y1="9" x2="12" y2="20" />
    <line x1="7" y1="13" x2="17" y2="13" />
  </svg>
);

// Sacred Geometry - Flower of Life pattern
export const SacredGeometryIcon = (props: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
    {...props}
  >
    <circle cx="12" cy="12" r="4" />
    <circle cx="12" cy="7" r="4" />
    <circle cx="12" cy="17" r="4" />
    <circle cx="8.5" cy="9.5" r="4" />
    <circle cx="15.5" cy="9.5" r="4" />
    <circle cx="8.5" cy="14.5" r="4" />
    <circle cx="15.5" cy="14.5" r="4" />
  </svg>
);
