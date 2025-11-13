import React from 'react';

const purpleColor = '#6B5BCE';
const darkPurple = '#5645A8';
const lightPurple = '#7D6DD6';

// Ankh 1 - Gradient Fill (Top Left)
export const Ankh1 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor={lightPurple} />
        <stop offset="100%" stopColor={darkPurple} />
      </linearGradient>
    </defs>
    {/* Loop */}
    <path d="M 30 35 Q 30 15, 50 15 Q 70 15, 70 35 Q 70 50, 50 55 Q 30 50, 30 35 Z" fill="url(#grad1)" />
    {/* Stem */}
    <path d="M 42 55 L 42 140 Q 42 145, 47 148 Q 50 150, 53 148 Q 58 145, 58 140 L 58 55 Z" fill="url(#grad1)" />
    {/* Crossbar */}
    <path d="M 15 75 Q 12 75, 12 78 L 12 82 Q 12 85, 15 85 L 42 85 L 42 75 Z" fill="url(#grad1)" />
    <path d="M 58 75 L 85 75 Q 88 75, 88 78 L 88 82 Q 88 85, 85 85 L 58 85 Z" fill="url(#grad1)" />
  </svg>
);

// Ankh 2 - Solid Fill (Top Center)
export const Ankh2 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Loop */}
    <path d="M 30 35 Q 30 15, 50 15 Q 70 15, 70 35 Q 70 50, 50 55 Q 30 50, 30 35 Z" fill={purpleColor} />
    {/* Stem */}
    <path d="M 42 55 L 42 140 Q 42 145, 47 148 Q 50 150, 53 148 Q 58 145, 58 140 L 58 55 Z" fill={purpleColor} />
    {/* Crossbar */}
    <path d="M 15 75 Q 12 75, 12 78 L 12 82 Q 12 85, 15 85 L 42 85 L 42 75 Z" fill={purpleColor} />
    <path d="M 58 75 L 85 75 Q 88 75, 88 78 L 88 82 Q 88 85, 85 85 L 58 85 Z" fill={purpleColor} />
  </svg>
);

// Ankh 3 - Geometric Triangles (Top Right)
export const Ankh3 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Loop outline with double ring */}
    <path d="M 30 35 Q 30 15, 50 15 Q 70 15, 70 35 Q 70 50, 50 55 Q 30 50, 30 35 Z" stroke={purpleColor} strokeWidth="5" fill="none" />
    <path d="M 35 35 Q 35 22, 50 22 Q 65 22, 65 35 Q 65 45, 50 48 Q 35 45, 35 35 Z" stroke={purpleColor} strokeWidth="3" fill="none" />
    {/* Stem outline */}
    <path d="M 42 55 L 42 140 Q 42 145, 47 148 Q 50 150, 53 148 Q 58 145, 58 140 L 58 55 Z" stroke={purpleColor} strokeWidth="5" fill="none" />
    {/* Triangle patterns in stem */}
    <polygon points="50,70 45,80 55,80" fill={purpleColor} />
    <polygon points="50,90 45,100 55,100" fill={purpleColor} />
    <polygon points="50,110 45,120 55,120" fill={purpleColor} />
    {/* Crossbar outline with triangles */}
    <path d="M 15 75 L 42 75 L 42 85 L 15 85 Q 12 85, 12 82 L 12 78 Q 12 75, 15 75 Z" stroke={purpleColor} strokeWidth="5" fill="none" />
    <polygon points="20,80 25,75 25,85" fill={purpleColor} />
    <path d="M 58 75 L 85 75 Q 88 75, 88 78 L 88 82 Q 88 85, 85 85 L 58 85 Z" stroke={purpleColor} strokeWidth="5" fill="none" />
    <polygon points="80,80 75,75 75,85" fill={purpleColor} />
    {/* Center circle */}
    <circle cx="50" cy="80" r="4" fill={purpleColor} />
  </svg>
);

// Ankh 4 - Solid with Gradient (Row 2 Left)
export const Ankh4 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={lightPurple} />
        <stop offset="100%" stopColor={purpleColor} />
      </linearGradient>
    </defs>
    {/* Loop */}
    <path d="M 30 35 Q 30 15, 50 15 Q 70 15, 70 35 Q 70 50, 50 55 Q 30 50, 30 35 Z" fill="url(#grad4)" />
    {/* Stem */}
    <path d="M 42 55 L 42 140 Q 42 145, 47 148 Q 50 150, 53 148 Q 58 145, 58 140 L 58 55 Z" fill="url(#grad4)" />
    {/* Crossbar */}
    <path d="M 15 75 Q 12 75, 12 78 L 12 82 Q 12 85, 15 85 L 42 85 L 42 75 Z" fill="url(#grad4)" />
    <path d="M 58 75 L 85 75 Q 88 75, 88 78 L 88 82 Q 88 85, 85 85 L 58 85 Z" fill="url(#grad4)" />
  </svg>
);

// Ankh 5 - Dotted Loop (Row 2 Center)
export const Ankh5 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Loop with dots */}
    <path d="M 30 35 Q 30 15, 50 15 Q 70 15, 70 35 Q 70 50, 50 55 Q 30 50, 30 35 Z" fill={purpleColor} />
    <circle cx="50" cy="18" r="3" fill="white" />
    <circle cx="42" cy="22" r="3" fill="white" />
    <circle cx="58" cy="22" r="3" fill="white" />
    <circle cx="35" cy="30" r="3" fill="white" />
    <circle cx="65" cy="30" r="3" fill="white" />
    <circle cx="38" cy="40" r="3" fill="white" />
    <circle cx="62" cy="40" r="3" fill="white" />
    <circle cx="45" cy="48" r="3" fill="white" />
    <circle cx="55" cy="48" r="3" fill="white" />
    {/* Stem */}
    <path d="M 42 55 L 42 140 Q 42 145, 47 148 Q 50 150, 53 148 Q 58 145, 58 140 L 58 55 Z" fill={purpleColor} />
    {/* Crossbar */}
    <path d="M 15 75 Q 12 75, 12 78 L 12 82 Q 12 85, 15 85 L 42 85 L 42 75 Z" fill={purpleColor} />
    <path d="M 58 75 L 85 75 Q 88 75, 88 78 L 88 82 Q 88 85, 85 85 L 58 85 Z" fill={purpleColor} />
  </svg>
);

// Ankh 6 - Solid Dark (Row 2 Right)
export const Ankh6 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Loop */}
    <path d="M 30 35 Q 30 15, 50 15 Q 70 15, 70 35 Q 70 50, 50 55 Q 30 50, 30 35 Z" fill={darkPurple} />
    {/* Stem */}
    <path d="M 42 55 L 42 140 Q 42 145, 47 148 Q 50 150, 53 148 Q 58 145, 58 140 L 58 55 Z" fill={darkPurple} />
    {/* Crossbar */}
    <path d="M 15 75 Q 12 75, 12 78 L 12 82 Q 12 85, 15 85 L 42 85 L 42 75 Z" fill={darkPurple} />
    <path d="M 58 75 L 85 75 Q 88 75, 88 78 L 88 82 Q 88 85, 85 85 L 58 85 Z" fill={darkPurple} />
  </svg>
);

// Ankh 7 - Outline (Row 3 Left)
export const Ankh7 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Loop outline */}
    <path d="M 30 35 Q 30 15, 50 15 Q 70 15, 70 35 Q 70 50, 50 55 Q 30 50, 30 35 Z" stroke={purpleColor} strokeWidth="6" fill="none" />
    {/* Stem outline */}
    <path d="M 42 55 L 42 140 Q 42 145, 47 148 Q 50 150, 53 148 Q 58 145, 58 140 L 58 55 Z" stroke={purpleColor} strokeWidth="6" fill="none" />
    {/* Crossbar outline */}
    <path d="M 15 75 Q 12 75, 12 78 L 12 82 Q 12 85, 15 85 L 42 85 L 42 75 Z" stroke={purpleColor} strokeWidth="6" fill="none" />
    <path d="M 58 75 L 85 75 Q 88 75, 88 78 L 88 82 Q 88 85, 85 85 L 58 85 Z" stroke={purpleColor} strokeWidth="6" fill="none" />
  </svg>
);

// Ankh 8 - Solid Medium (Row 3 Center)
export const Ankh8 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Loop */}
    <path d="M 30 35 Q 30 15, 50 15 Q 70 15, 70 35 Q 70 50, 50 55 Q 30 50, 30 35 Z" fill={purpleColor} />
    {/* Stem */}
    <path d="M 42 55 L 42 140 Q 42 145, 47 148 Q 50 150, 53 148 Q 58 145, 58 140 L 58 55 Z" fill={purpleColor} />
    {/* Crossbar */}
    <path d="M 15 75 Q 12 75, 12 78 L 12 82 Q 12 85, 15 85 L 42 85 L 42 75 Z" fill={purpleColor} />
    <path d="M 58 75 L 85 75 Q 88 75, 88 78 L 88 82 Q 88 85, 85 85 L 58 85 Z" fill={purpleColor} />
  </svg>
);

// Ankh 9 - Chevron Pattern (Row 3 Right)
export const Ankh9 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Loop outline with double ring */}
    <path d="M 30 35 Q 30 15, 50 15 Q 70 15, 70 35 Q 70 50, 50 55 Q 30 50, 30 35 Z" stroke={purpleColor} strokeWidth="5" fill="none" />
    <path d="M 35 35 Q 35 22, 50 22 Q 65 22, 65 35 Q 65 45, 50 48 Q 35 45, 35 35 Z" stroke={purpleColor} strokeWidth="3" fill="none" />
    {/* Stem outline */}
    <path d="M 42 55 L 42 140 Q 42 145, 47 148 Q 50 150, 53 148 Q 58 145, 58 140 L 58 55 Z" stroke={purpleColor} strokeWidth="5" fill="none" />
    {/* Stacked chevron patterns */}
    <path d="M 45 65 L 50 70 L 55 65" stroke={purpleColor} strokeWidth="3" fill="none" />
    <path d="M 45 75 L 50 80 L 55 75" stroke={purpleColor} strokeWidth="3" fill="none" />
    <path d="M 45 85 L 50 90 L 55 85" stroke={purpleColor} strokeWidth="3" fill="none" />
    <path d="M 45 95 L 50 100 L 55 95" stroke={purpleColor} strokeWidth="3" fill="none" />
    <path d="M 45 105 L 50 110 L 55 105" stroke={purpleColor} strokeWidth="3" fill="none" />
    <path d="M 45 115 L 50 120 L 55 115" stroke={purpleColor} strokeWidth="3" fill="none" />
    {/* Crossbar outline */}
    <path d="M 15 75 L 42 75 L 42 85 L 15 85 Q 12 85, 12 82 L 12 78 Q 12 75, 15 75 Z" stroke={purpleColor} strokeWidth="5" fill="none" />
    <path d="M 58 75 L 85 75 Q 88 75, 88 78 L 88 82 Q 88 85, 85 85 L 58 85 Z" stroke={purpleColor} strokeWidth="5" fill="none" />
  </svg>
);

// Ankh 10 - 3D Effect (Row 4 Left)
export const Ankh10 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="grad10" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor={lightPurple} />
        <stop offset="50%" stopColor={purpleColor} />
        <stop offset="100%" stopColor={darkPurple} />
      </linearGradient>
    </defs>
    {/* Loop with 3D effect */}
    <path d="M 30 35 Q 30 15, 50 15 Q 70 15, 70 35 Q 70 50, 50 55 Q 30 50, 30 35 Z" fill="url(#grad10)" />
    <path d="M 30 35 Q 30 15, 50 15 Q 70 15, 70 35 Q 70 50, 50 55 Q 30 50, 30 35 Z" stroke={darkPurple} strokeWidth="2" fill="none" opacity="0.5" transform="translate(2, 2)" />
    {/* Stem */}
    <path d="M 42 55 L 42 140 Q 42 145, 47 148 Q 50 150, 53 148 Q 58 145, 58 140 L 58 55 Z" fill="url(#grad10)" />
    {/* Crossbar */}
    <path d="M 15 75 Q 12 75, 12 78 L 12 82 Q 12 85, 15 85 L 42 85 L 42 75 Z" fill="url(#grad10)" />
    <path d="M 58 75 L 85 75 Q 88 75, 88 78 L 88 82 Q 88 85, 85 85 L 58 85 Z" fill="url(#grad10)" />
  </svg>
);

// Ankh 11 - Wavy S-Curve (Row 4 Center)
export const Ankh11 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Loop */}
    <path d="M 30 35 Q 30 15, 50 15 Q 70 15, 70 35 Q 70 50, 50 55 Q 30 50, 30 35 Z" fill={purpleColor} />
    {/* Stem */}
    <path d="M 42 55 L 42 140 Q 42 145, 47 148 Q 50 150, 53 148 Q 58 145, 58 140 L 58 55 Z" fill={purpleColor} />
    {/* S-curve decoration in stem */}
    <path d="M 47 70 Q 52 85, 47 100 Q 42 115, 47 130" stroke="white" strokeWidth="3" fill="none" />
    <path d="M 53 70 Q 48 85, 53 100 Q 58 115, 53 130" stroke="white" strokeWidth="3" fill="none" />
    {/* Crossbar */}
    <path d="M 15 75 Q 12 75, 12 78 L 12 82 Q 12 85, 15 85 L 42 85 L 42 75 Z" fill={purpleColor} />
    <path d="M 58 75 L 85 75 Q 88 75, 88 78 L 88 82 Q 88 85, 85 85 L 58 85 Z" fill={purpleColor} />
  </svg>
);

// Ankh 12 - Stacked Chevrons with Circle (Row 4 Right)
export const Ankh12 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Loop outline */}
    <path d="M 30 35 Q 30 15, 50 15 Q 70 15, 70 35 Q 70 50, 50 55 Q 30 50, 30 35 Z" stroke={purpleColor} strokeWidth="5" fill="none" />
    {/* Stem outline */}
    <path d="M 42 55 L 42 140 Q 42 145, 47 148 Q 50 150, 53 148 Q 58 145, 58 140 L 58 55 Z" stroke={purpleColor} strokeWidth="5" fill="none" />
    {/* Stacked triangle/chevron patterns inside stem */}
    <polygon points="50,65 46,72 54,72" fill={purpleColor} />
    <polygon points="50,78 46,85 54,85" fill={purpleColor} />
    <polygon points="50,91 46,98 54,98" fill={purpleColor} />
    <polygon points="50,104 46,111 54,111" fill={purpleColor} />
    <polygon points="50,117 46,124 54,124" fill={purpleColor} />
    <polygon points="50,130 46,137 54,137" fill={purpleColor} />
    {/* Center circle */}
    <circle cx="50" cy="80" r="5" fill={purpleColor} />
    {/* Crossbar outline */}
    <path d="M 15 75 L 42 75 L 42 85 L 15 85 Q 12 85, 12 82 L 12 78 Q 12 75, 15 75 Z" stroke={purpleColor} strokeWidth="5" fill="none" />
    <path d="M 58 75 L 85 75 Q 88 75, 88 78 L 88 82 Q 88 85, 85 85 L 58 85 Z" stroke={purpleColor} strokeWidth="5" fill="none" />
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
  { id: 'ankh9', name: 'Chevron Pattern', component: Ankh9 },
  { id: 'ankh10', name: '3D Effect', component: Ankh10 },
  { id: 'ankh11', name: 'Wavy Decoration', component: Ankh11 },
  { id: 'ankh12', name: 'Triangle Pattern', component: Ankh12 },
];
