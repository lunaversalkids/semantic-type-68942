import { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';

interface FindReplaceBottomBarProps {
  editor?: any;
}

export const FindReplaceBottomBar = ({ editor }: FindReplaceBottomBarProps) => {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [mode, setMode] = useState<'keep' | 'apply'>('keep');

  const handleSwap = () => {
    const temp = findText;
    setFindText(replaceText);
    setReplaceText(temp);
  };

  const handleReplace = () => {
    if (!editor || !findText) return;
    
    const content = editor.getHTML();
    const regex = new RegExp(findText, 'gi');
    const newContent = content.replace(regex, replaceText);
    editor.commands.setContent(newContent);
  };

  return (
    <div className="bg-[hsl(var(--panel))] border border-[hsl(var(--stroke))] rounded-[var(--radius)] shadow-[0_10px_28px_rgba(96,48,200,.16)] p-2.5 px-3 grid grid-cols-[160px_1fr_auto_1fr_auto_220px] items-center gap-2">
      {/* Label */}
      <div className="text-sm font-bold text-[hsl(var(--ink))]">Find and Replace</div>

      {/* Find Input */}
      <input
        type="text"
        value={findText}
        onChange={(e) => setFindText(e.target.value)}
        placeholder="Hexapoda"
        className="bg-white border border-[hsl(var(--stroke))] rounded-[var(--r-sm)] px-2.5 py-2 text-sm text-[hsl(var(--ink))] placeholder:text-[hsl(var(--ink-weak))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]"
      />

      {/* Swap Button */}
      <button
        onClick={handleSwap}
        className="w-9 h-9 rounded-[var(--r-sm)] bg-white border border-[hsl(var(--stroke))] grid place-items-center hover:bg-[hsl(var(--panel-2))] transition-colors"
        title="Swap"
      >
        <ArrowLeftRight className="w-4 h-4 text-[hsl(var(--ink))]" />
      </button>

      {/* Replace Input */}
      <input
        type="text"
        value={replaceText}
        onChange={(e) => setReplaceText(e.target.value)}
        placeholder="intestata"
        className="bg-white border border-[hsl(var(--stroke))] rounded-[var(--r-sm)] px-2.5 py-2 text-sm text-[hsl(var(--ink))] placeholder:text-[hsl(var(--ink-weak))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]"
      />

      {/* Segmented Control */}
      <div className="flex gap-1.5 bg-[#EFE7FF] border border-[hsl(var(--stroke))] rounded-[var(--r-sm)] p-1" role="tablist">
        <button
          onClick={() => setMode('keep')}
          className={`px-2.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            mode === 'keep'
              ? 'bg-[#7A49FF] text-white shadow-sm'
              : 'bg-transparent text-[#4737B2] hover:bg-white/50'
          }`}
          role="tab"
          aria-selected={mode === 'keep'}
        >
          Keep Regular Style
        </button>
        <button
          onClick={() => setMode('apply')}
          className={`px-2.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            mode === 'apply'
              ? 'bg-[#7A49FF] text-white shadow-sm'
              : 'bg-transparent text-[#4737B2] hover:bg-white/50'
          }`}
          role="tab"
          aria-selected={mode === 'apply'}
        >
          Apply With Style
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <button className="px-3.5 py-2 bg-white border border-[hsl(var(--stroke))] rounded-[var(--r-sm)] text-sm font-medium text-[hsl(var(--ink))] hover:bg-[hsl(var(--panel-2))] transition-colors">
          Edit All
        </button>
        <button 
          onClick={handleReplace}
          className="px-3.5 py-2 bg-gradient-to-b from-[#A77CFF] to-[#7A49FF] border-0 rounded-[var(--r-sm)] text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          Replace
        </button>
      </div>
    </div>
  );
};
