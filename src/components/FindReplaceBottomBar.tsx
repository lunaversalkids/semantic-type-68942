import { useState, useEffect } from 'react';
import { ArrowLeftRight, X, ChevronUp, ChevronDown } from 'lucide-react';

interface FindReplaceBottomBarProps {
  editor?: any;
  isVisible?: boolean;
  onClose?: () => void;
}

export const FindReplaceBottomBar = ({ editor, isVisible = true, onClose }: FindReplaceBottomBarProps) => {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [mode, setMode] = useState<'keep' | 'apply'>('keep');
  const [currentMatch, setCurrentMatch] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);

  // Search for matches and update count
  useEffect(() => {
    if (!editor || !findText) {
      setTotalMatches(0);
      setCurrentMatch(0);
      return;
    }

    const content = editor.getText();
    const regex = new RegExp(findText, 'gi');
    const matches = content.match(regex);
    setTotalMatches(matches ? matches.length : 0);
    if (matches && matches.length > 0 && currentMatch === 0) {
      setCurrentMatch(1);
    } else if (!matches || matches.length === 0) {
      setCurrentMatch(0);
    }
  }, [findText, editor]);

  const handleSwap = () => {
    const temp = findText;
    setFindText(replaceText);
    setReplaceText(temp);
  };

  const handleFindNext = () => {
    if (totalMatches === 0) return;
    setCurrentMatch((prev) => (prev >= totalMatches ? 1 : prev + 1));
  };

  const handleFindPrevious = () => {
    if (totalMatches === 0) return;
    setCurrentMatch((prev) => (prev <= 1 ? totalMatches : prev - 1));
  };

  const handleReplace = () => {
    if (!editor || !findText) return;
    
    const content = editor.getHTML();
    const regex = new RegExp(findText, 'gi');
    const newContent = content.replace(regex, replaceText);
    editor.commands.setContent(newContent);
  };

  return (
    <div 
      className={`bg-[hsl(var(--panel))] border border-[hsl(var(--stroke))] rounded-[var(--radius)] shadow-[0_10px_28px_rgba(96,48,200,.16)] p-2.5 px-3 grid grid-cols-[160px_1fr_auto_auto_auto_1fr_auto_220px_auto] items-center gap-2 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      {/* Label */}
      <div className="text-sm font-bold text-[hsl(var(--ink))]">Find and Replace</div>

      {/* Find Input with Match Counter */}
      <div className="relative">
        <input
          type="text"
          value={findText}
          onChange={(e) => setFindText(e.target.value)}
          placeholder="Hexapoda"
          className="bg-white border border-[hsl(var(--stroke))] rounded-[var(--r-sm)] px-2.5 py-2 pr-16 text-sm text-[hsl(var(--ink))] placeholder:text-[hsl(var(--ink-weak))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] w-full"
        />
        {totalMatches > 0 && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[hsl(var(--ink-weak))] font-medium">
            {currentMatch}/{totalMatches}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-1">
        <button
          onClick={handleFindPrevious}
          disabled={totalMatches === 0}
          className="w-9 h-9 rounded-[var(--r-sm)] bg-white border border-[hsl(var(--stroke))] grid place-items-center hover:bg-[hsl(var(--panel-2))] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          title="Previous match"
        >
          <ChevronUp className="w-4 h-4 text-[hsl(var(--ink))]" />
        </button>
        <button
          onClick={handleFindNext}
          disabled={totalMatches === 0}
          className="w-9 h-9 rounded-[var(--r-sm)] bg-white border border-[hsl(var(--stroke))] grid place-items-center hover:bg-[hsl(var(--panel-2))] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          title="Next match"
        >
          <ChevronDown className="w-4 h-4 text-[hsl(var(--ink))]" />
        </button>
      </div>

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

      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-[var(--r-sm)] bg-white border border-[hsl(var(--stroke))] grid place-items-center hover:bg-[hsl(var(--panel-2))] transition-colors"
          title="Close"
        >
          <X className="w-4 h-4 text-[hsl(var(--ink))]" />
        </button>
      )}
    </div>
  );
};
