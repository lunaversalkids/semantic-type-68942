import { useState, useEffect, useRef } from 'react';
import { ArrowLeftRight, X, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

interface FindReplaceBottomBarProps {
  editor?: any;
  isVisible?: boolean;
  onClose?: () => void;
}

export const FindReplaceBottomBar = ({ editor, isVisible = true, onClose }: FindReplaceBottomBarProps) => {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [mode, setMode] = useState<'keep' | 'apply'>('keep');
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);
  const [showReplaceMenu, setShowReplaceMenu] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const replaceButtonRef = useRef<HTMLDivElement>(null);

  // Find matches whenever findText changes
  useEffect(() => {
    if (!editor || !findText) {
      setTotalMatches(0);
      setCurrentMatchIndex(0);
      return;
    }

    const content = editor.getText();
    const regex = new RegExp(findText, 'gi');
    const matches = content.match(regex);
    setTotalMatches(matches ? matches.length : 0);
    setCurrentMatchIndex(matches && matches.length > 0 ? 0 : 0);
  }, [findText, editor]);

  const handleSwap = () => {
    const temp = findText;
    setFindText(replaceText);
    setReplaceText(temp);
  };

  const handlePrevious = () => {
    if (totalMatches === 0) return;
    setCurrentMatchIndex((prev) => (prev === 0 ? totalMatches - 1 : prev - 1));
  };

  const handleNext = () => {
    if (totalMatches === 0) return;
    setCurrentMatchIndex((prev) => (prev === totalMatches - 1 ? 0 : prev + 1));
  };

  const handleReplace = () => {
    if (!editor || !findText) return;
    
    const content = editor.getHTML();
    const regex = new RegExp(findText, 'gi');
    let count = 0;
    const newContent = content.replace(regex, (match) => {
      if (count === currentMatchIndex) {
        count++;
        return replaceText;
      }
      count++;
      return match;
    });
    editor.commands.setContent(newContent);
    setShowReplaceMenu(false);
  };

  const handleReplaceAll = () => {
    if (!editor || !findText) return;
    
    const content = editor.getHTML();
    const regex = new RegExp(findText, 'gi');
    const newContent = content.replace(regex, replaceText);
    editor.commands.setContent(newContent);
    setShowReplaceMenu(false);
  };

  const handleMouseDown = () => {
    longPressTimer.current = setTimeout(() => {
      setShowReplaceMenu(true);
    }, 500);
  };

  const handleMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleMouseLeave = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  return (
    <div 
      className={`bg-[hsl(var(--panel))] border border-[hsl(var(--stroke))] rounded-[var(--radius)] shadow-[0_10px_28px_rgba(96,48,200,.16)] p-2.5 px-3 grid grid-cols-[160px_auto_1fr_auto_1fr_auto_220px_auto_auto] items-center gap-2 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      {/* Label */}
      <div className="text-sm font-bold text-[hsl(var(--ink))]">Find and Replace</div>

      {/* Match Counter */}
      <div className="text-xs font-semibold text-[hsl(var(--ink))] whitespace-nowrap">
        {totalMatches > 0 ? `${currentMatchIndex + 1}/${totalMatches}` : '0/0'}
      </div>

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

      {/* Navigation Arrows */}
      <div className="flex gap-1">
        <button
          onClick={handlePrevious}
          disabled={totalMatches === 0}
          className="w-9 h-9 rounded-[var(--r-sm)] bg-white border border-[hsl(var(--stroke))] grid place-items-center hover:bg-[hsl(var(--panel-2))] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Previous match"
        >
          <ChevronLeft className="w-4 h-4 text-[hsl(var(--ink))]" />
        </button>

        <button
          onClick={handleNext}
          disabled={totalMatches === 0}
          className="w-9 h-9 rounded-[var(--r-sm)] bg-white border border-[hsl(var(--stroke))] grid place-items-center hover:bg-[hsl(var(--panel-2))] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Next match"
        >
          <ChevronRight className="w-4 h-4 text-[hsl(var(--ink))]" />
        </button>
      </div>

      {/* Replace Button with Menu */}
      <div className="relative" ref={replaceButtonRef}>
        <button 
          onClick={handleReplace}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className="px-3.5 py-2 bg-gradient-to-b from-[#A77CFF] to-[#7A49FF] border-0 rounded-[var(--r-sm)] text-sm font-medium text-white hover:opacity-90 transition-opacity flex items-center gap-1"
        >
          Replace
          <ChevronDown className="w-3 h-3" />
        </button>
        
        {showReplaceMenu && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowReplaceMenu(false)}
            />
            <div className="absolute bottom-full right-0 mb-1 bg-white border border-[hsl(var(--stroke))] rounded-[var(--r-sm)] shadow-lg overflow-hidden z-50">
              <button
                onClick={handleReplace}
                className="w-full px-4 py-2 text-left text-sm text-[hsl(var(--ink))] hover:bg-[hsl(var(--panel-2))] transition-colors whitespace-nowrap"
              >
                Replace
              </button>
              <button
                onClick={handleReplaceAll}
                className="w-full px-4 py-2 text-left text-sm text-[hsl(var(--ink))] hover:bg-[hsl(var(--panel-2))] transition-colors whitespace-nowrap"
              >
                Replace All
              </button>
            </div>
          </>
        )}
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
