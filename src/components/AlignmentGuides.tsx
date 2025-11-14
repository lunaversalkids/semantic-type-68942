interface AlignmentGuidesProps {
  editorElement: HTMLElement;
}

export const AlignmentGuides = ({ editorElement }: AlignmentGuidesProps) => {
  const rect = editorElement.getBoundingClientRect();
  const centerX = rect.width / 2;
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Grid pattern */}
      <svg 
        className="w-full h-full opacity-20"
        style={{
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height
        }}
      >
        <defs>
          <pattern
            id="grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="hsl(253, 100%, 64%)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Center guide */}
      <div
        className="absolute top-0 bottom-0 w-px bg-[hsl(253,100%,64%)] opacity-40"
        style={{ left: `${centerX}px` }}
      />

      {/* Quarter guides */}
      <div
        className="absolute top-0 bottom-0 w-px bg-[hsl(253,100%,64%)]/20"
        style={{ left: `${centerX / 2}px` }}
      />
      <div
        className="absolute top-0 bottom-0 w-px bg-[hsl(253,100%,64%)]/20"
        style={{ left: `${centerX + centerX / 2}px` }}
      />
    </div>
  );
};
