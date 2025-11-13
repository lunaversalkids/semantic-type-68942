import React from 'react';

// Ankh 1 - Gradient Ankh
export const Ankh1 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="hsl(253, 100%, 64%)" />
        <stop offset="100%" stopColor="hsl(253, 85%, 55%)" />
      </linearGradient>
    </defs>
    <ellipse cx="50" cy="30" rx="20" ry="25" fill="url(#grad1)" />
    <rect x="42" y="50" width="16" height="60" fill="url(#grad1)" />
    <rect x="20" y="75" width="60" height="16" fill="url(#grad1)" />
  </svg>
);

// Ankh 2 - Solid Purple
export const Ankh2 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <ellipse cx="50" cy="30" rx="20" ry="25" fill="hsl(253, 100%, 64%)" />
    <rect x="42" y="50" width="16" height="60" fill="hsl(253, 100%, 64%)" />
    <rect x="20" y="75" width="60" height="16" fill="hsl(253, 100%, 64%)" />
  </svg>
);

// Ankh 3 - Geometric Pattern
export const Ankh3 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <ellipse cx="50" cy="30" rx="20" ry="25" stroke="hsl(253, 100%, 64%)" strokeWidth="3" fill="none" />
    <polygon points="50,20 60,30 50,40 40,30" fill="hsl(253, 100%, 64%)" />
    <rect x="42" y="50" width="16" height="60" stroke="hsl(253, 100%, 64%)" strokeWidth="3" fill="none" />
    <polygon points="50,70 55,80 50,90 45,80" fill="hsl(253, 100%, 64%)" />
    <rect x="20" y="75" width="60" height="16" stroke="hsl(253, 100%, 64%)" strokeWidth="3" fill="none" />
  </svg>
);

// Ankh 4 - Simple Gradient
export const Ankh4 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="grad4" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="hsl(253, 100%, 70%)" />
        <stop offset="100%" stopColor="hsl(253, 100%, 50%)" />
      </linearGradient>
    </defs>
    <ellipse cx="50" cy="30" rx="20" ry="25" fill="url(#grad4)" />
    <rect x="42" y="50" width="16" height="60" fill="url(#grad4)" />
    <rect x="20" y="75" width="60" height="16" fill="url(#grad4)" />
  </svg>
);

// Ankh 5 - Dotted Loop
export const Ankh5 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <ellipse cx="50" cy="30" rx="20" ry="25" stroke="hsl(253, 100%, 64%)" strokeWidth="3" strokeDasharray="5,5" fill="none" />
    <circle cx="50" cy="20" r="3" fill="hsl(253, 100%, 64%)" />
    <circle cx="40" cy="30" r="3" fill="hsl(253, 100%, 64%)" />
    <circle cx="60" cy="30" r="3" fill="hsl(253, 100%, 64%)" />
    <circle cx="50" cy="40" r="3" fill="hsl(253, 100%, 64%)" />
    <rect x="42" y="50" width="16" height="60" fill="hsl(253, 100%, 64%)" />
    <rect x="20" y="75" width="60" height="16" fill="hsl(253, 100%, 64%)" />
  </svg>
);

// Ankh 6 - Solid Dark
export const Ankh6 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <ellipse cx="50" cy="30" rx="20" ry="25" fill="hsl(253, 85%, 45%)" />
    <rect x="42" y="50" width="16" height="60" fill="hsl(253, 85%, 45%)" />
    <rect x="20" y="75" width="60" height="16" fill="hsl(253, 85%, 45%)" />
  </svg>
);

// Ankh 7 - Basic Outline
export const Ankh7 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <ellipse cx="50" cy="30" rx="20" ry="25" stroke="hsl(253, 100%, 64%)" strokeWidth="4" fill="none" />
    <rect x="42" y="50" width="16" height="60" stroke="hsl(253, 100%, 64%)" strokeWidth="4" fill="none" />
    <rect x="20" y="75" width="60" height="16" stroke="hsl(253, 100%, 64%)" strokeWidth="4" fill="none" />
  </svg>
);

// Ankh 8 - Solid Medium
export const Ankh8 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <ellipse cx="50" cy="30" rx="20" ry="25" fill="hsl(253, 95%, 58%)" />
    <rect x="42" y="50" width="16" height="60" fill="hsl(253, 95%, 58%)" />
    <rect x="20" y="75" width="60" height="16" fill="hsl(253, 95%, 58%)" />
  </svg>
);

// Ankh 9 - Geometric Arms
export const Ankh9 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <ellipse cx="50" cy="30" rx="20" ry="25" fill="hsl(253, 100%, 64%)" />
    <rect x="42" y="50" width="16" height="60" fill="hsl(253, 100%, 64%)" />
    <rect x="20" y="75" width="60" height="16" fill="hsl(253, 100%, 64%)" />
    <polygon points="30,83 35,78 35,88" fill="white" opacity="0.4" />
    <polygon points="70,83 65,78 65,88" fill="white" opacity="0.4" />
  </svg>
);

// Ankh 10 - Gradient Light
export const Ankh10 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="grad10" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="hsl(253, 100%, 75%)" />
        <stop offset="100%" stopColor="hsl(253, 100%, 60%)" />
      </linearGradient>
    </defs>
    <ellipse cx="50" cy="30" rx="20" ry="25" fill="url(#grad10)" />
    <rect x="42" y="50" width="16" height="60" fill="url(#grad10)" />
    <rect x="20" y="75" width="60" height="16" fill="url(#grad10)" />
  </svg>
);

// Ankh 11 - Wavy Decoration
export const Ankh11 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <ellipse cx="50" cy="30" rx="20" ry="25" stroke="hsl(253, 100%, 64%)" strokeWidth="3" fill="none" />
    <path d="M45,20 Q47,25 45,30 Q43,35 45,40" stroke="hsl(253, 100%, 64%)" strokeWidth="2" fill="none" />
    <path d="M55,20 Q53,25 55,30 Q57,35 55,40" stroke="hsl(253, 100%, 64%)" strokeWidth="2" fill="none" />
    <rect x="42" y="50" width="16" height="60" fill="hsl(253, 100%, 64%)" />
    <rect x="20" y="75" width="60" height="16" fill="hsl(253, 100%, 64%)" />
  </svg>
);

// Ankh 12 - Triangle Pattern
export const Ankh12 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <ellipse cx="50" cy="30" rx="20" ry="25" stroke="hsl(253, 100%, 64%)" strokeWidth="3" fill="none" />
    <polygon points="50,15 45,25 55,25" fill="hsl(253, 100%, 64%)" />
    <polygon points="50,25 45,35 55,35" fill="hsl(253, 100%, 64%)" />
    <polygon points="50,35 45,45 55,45" fill="hsl(253, 100%, 64%)" />
    <rect x="42" y="50" width="16" height="60" fill="hsl(253, 100%, 64%)" />
    <rect x="20" y="75" width="60" height="16" fill="hsl(253, 100%, 64%)" />
  </svg>
);

export const egyptianAnkhs = [
  { id: 'ankh1', name: 'Gradient Ankh', component: Ankh1 },
  { id: 'ankh2', name: 'Solid Ankh', component: Ankh2 },
  { id: 'ankh3', name: 'Geometric Pattern', component: Ankh3 },
  { id: 'ankh4', name: 'Simple Gradient', component: Ankh4 },
  { id: 'ankh5', name: 'Dotted Loop', component: Ankh5 },
  { id: 'ankh6', name: 'Solid Dark', component: Ankh6 },
  { id: 'ankh7', name: 'Basic Outline', component: Ankh7 },
  { id: 'ankh8', name: 'Solid Medium', component: Ankh8 },
  { id: 'ankh9', name: 'Geometric Arms', component: Ankh9 },
  { id: 'ankh10', name: 'Gradient Light', component: Ankh10 },
  { id: 'ankh11', name: 'Wavy Decoration', component: Ankh11 },
  { id: 'ankh12', name: 'Triangle Pattern', component: Ankh12 },
];
