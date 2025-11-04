import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
export const PermanentFindReplaceBar = () => {
  return <div className="bg-[hsl(var(--panel))] border border-[hsl(var(--stroke))] rounded-[var(--radius)] shadow-[0_10px_28px_rgba(96,48,200,.16)] p-2.5 px-3 grid grid-cols-[160px_auto_1fr_auto_1fr_220px_auto_auto_auto] items-center gap-2">
      {/* Label */}
      <div className="text-sm font-bold text-[hsl(var(--ink))]">Find and Replace</div>

      {/* Match Counter */}
      <div className="text-xs font-semibold text-[hsl(var(--ink))] whitespace-nowrap">
        0/0
      </div>

      {/* Find Input */}
      <input type="text" placeholder="Hexapoda" defaultValue="Hexapoda" disabled className="bg-white border border-[hsl(var(--stroke))] rounded-[var(--r-sm)] px-2.5 py-2 text-sm text-[hsl(var(--ink))] placeholder:text-[hsl(var(--ink-weak))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]" />

      {/* Swap Button */}
      <button disabled className="w-9 h-9 rounded-[var(--r-sm)] bg-white border border-[hsl(var(--stroke))] grid place-items-center hover:bg-[hsl(var(--panel-2))] transition-colors" title="Swap">
        
      </button>

      {/* Replace Input */}
      <input type="text" placeholder="intestata" defaultValue="intestata" disabled className="bg-white border border-[hsl(var(--stroke))] rounded-[var(--r-sm)] px-2.5 py-2 text-sm text-[hsl(var(--ink))] placeholder:text-[hsl(var(--ink-weak))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]" />

      {/* Segmented Control */}
      <div className="flex gap-1.5 bg-[#EFE7FF] border border-[hsl(var(--stroke))] rounded-[var(--r-sm)] p-1 justify-self-end" role="tablist">
        <button disabled className="px-2.5 py-2 rounded-lg text-xs font-semibold bg-[#7A49FF] text-white shadow-sm">
          Keep Regular Style
        </button>
        <button disabled className="px-2.5 py-2 rounded-lg text-xs font-semibold bg-transparent text-[#4737B2]">
          Apply With Style
        </button>
      </div>

      {/* Navigation Arrows */}
      <div className="flex gap-1 justify-self-center">
        <button disabled className="w-9 h-9 rounded-[var(--r-sm)] bg-white border border-[hsl(var(--stroke))] grid place-items-center opacity-50 cursor-not-allowed">
          <ChevronLeft className="w-4 h-4 text-[hsl(var(--ink))]" />
        </button>

        <button disabled className="w-9 h-9 rounded-[var(--r-sm)] bg-white border border-[hsl(var(--stroke))] grid place-items-center opacity-50 cursor-not-allowed">
          <ChevronRight className="w-4 h-4 text-[hsl(var(--ink))]" />
        </button>
      </div>

      {/* Replace Button */}
      <button disabled className="px-3.5 py-2 bg-gradient-to-b from-[#A77CFF] to-[#7A49FF] border-0 rounded-[var(--r-sm)] text-sm font-medium text-white flex items-center gap-1">
        Replace
        <ChevronDown className="w-3 h-3" />
      </button>

      {/* Close Button placeholder (empty space) */}
      <div className="w-9 h-9" />
    </div>;
};