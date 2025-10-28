import { LucideProps } from "lucide-react";

export const SquareFrame = (props: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
  </svg>
);

export const CircleNode = (props: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="9" />
  </svg>
);

export const TrianglePointer = (props: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2 L22 20 L2 20 Z" />
  </svg>
);

export const DiamondMarker = (props: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2 L22 12 L12 22 L2 12 Z" />
  </svg>
);

export const LineConnector = (props: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="3" y1="12" x2="21" y2="12" />
  </svg>
);

export const coreShapes = [
  { id: 'square', name: 'Square Frame', component: SquareFrame, description: 'Structured text or image container' },
  { id: 'circle', name: 'Circle Node', component: CircleNode, description: 'Highlight or anchor point' },
  { id: 'triangle', name: 'Triangle Pointer', component: TrianglePointer, description: 'Directional indicator' },
  { id: 'diamond', name: 'Diamond Marker', component: DiamondMarker, description: 'Insight or transition marker' },
  { id: 'line', name: 'Line Connector', component: LineConnector, description: 'Visual flow or linkage' },
];
